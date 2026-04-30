import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { checkRateLimit } from '@/lib/api/rate-limit';
import { generateInputSchema } from '@/lib/api/validation';
import {
  generateStrategicReplies,
  AIError,
  type AIGenerationInput,
} from '@/lib/ai';
import type { CanUserGenerateRow, Json } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/generate
 *
 * Génère 3 réponses stratégiques pour un message reçu.
 *
 * Body :
 *   - message: string (requis)
 *   - context?: string
 *   - objective?: string
 *   - mode: CommunicationMode (requis)
 *
 * Headers :
 *   - cookies de session Supabase (auth requise)
 *
 * Retourne :
 *   { success: true, data: { generation_id, response, metadata, usage } }
 */
export async function POST(req: NextRequest) {
  // ----- 1. Authentification -----
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté pour générer.');
  }
  const { user, profile } = auth;

  // ----- 2. Rate limit anti-spam (10 req / minute) -----
  const rateLimit = checkRateLimit({
    identifier: `gen:${user.id}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      'RATE_LIMITED',
      'Trop de requêtes. Réessaie dans une minute.',
      { resetAt: rateLimit.resetAt }
    );
  }

  // ----- 3. Validation du body -----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Body JSON invalide.');
  }

  const parsed = generateInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      'VALIDATION_ERROR',
      'Données invalides.',
      parsed.error.flatten()
    );
  }
  const input = parsed.data;

  // ----- 4. Vérification du quota quotidien (via RPC Supabase) -----
  const supabase = await createClient();

  const { data: quotaCheck, error: quotaError } = await supabase.rpc(
    'can_user_generate',
    { p_user_id: user.id }
  );

  if (quotaError) {
    console.error('[generate] Quota check error:', quotaError);
    return apiError(
      'INTERNAL_ERROR',
      'Impossible de vérifier ton quota. Réessaie.'
    );
  }

  // can_user_generate retourne un array avec 1 élément (typé explicitement)
  const quotaArray = quotaCheck as unknown as CanUserGenerateRow[] | null;
  const quota: CanUserGenerateRow | null =
    Array.isArray(quotaArray) && quotaArray.length > 0 ? quotaArray[0] : null;

  if (!quota || !quota.can_generate) {
    return apiError(
      'QUOTA_EXCEEDED',
      `Tu as atteint ta limite quotidienne (${quota?.daily_limit ?? 5} générations). Reviens demain ou passe Pro.`,
      {
        current_count: quota?.current_count ?? 0,
        daily_limit: quota?.daily_limit ?? 5,
        plan: quota?.user_plan ?? 'free',
      }
    );
  }

  // ----- 5. Appel à l'IA -----
  const aiInput: AIGenerationInput = {
    message: input.message,
    context: input.context,
    objective: input.objective,
    mode: input.mode,
    userPreferences: {
      preferred_tone: profile.preferred_tone,
      language: profile.language,
    },
  };

  let aiResult;
  try {
    aiResult = await generateStrategicReplies(aiInput);
  } catch (err) {
    console.error('[generate] AI error:', err);

    if (err instanceof AIError) {
      switch (err.code) {
        case 'SAFETY_VIOLATION':
          return apiError('SAFETY_BLOCKED', err.message);
        case 'RATE_LIMIT':
          return apiError(
            'AI_PROVIDER_ERROR',
            'Le service IA est saturé. Réessaie dans quelques secondes.'
          );
        case 'TIMEOUT':
          return apiError(
            'AI_PROVIDER_ERROR',
            'La génération a pris trop de temps. Réessaie.'
          );
        default:
          return apiError(
            'AI_PROVIDER_ERROR',
            'Erreur du service IA. Réessaie.'
          );
      }
    }

    return apiError('INTERNAL_ERROR', 'Une erreur inattendue est survenue.');
  }

  // ----- 6. Cas spécial : réponse flagged (safety) -----
  if (aiResult.response.flagged) {
    return apiSuccess({
      generation_id: null,
      response: aiResult.response,
      metadata: aiResult.metadata,
      usage: {
        current_count: quota.current_count,
        daily_limit: quota.daily_limit,
      },
    });
  }

  // ----- 7. Sauvegarde en base de données -----
  const insertPayload = {
    user_id: user.id,
    input_message: input.message,
    context: input.context || null,
    objective: input.objective || null,
    mode: input.mode,
    ai_response: aiResult.response as unknown as Json,
    ai_provider: aiResult.metadata.provider,
    ai_model: aiResult.metadata.model,
    tokens_used: aiResult.metadata.tokens_used ?? null,
  };

  const { data: generation, error: insertError } = await supabase
    .from('generations')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(insertPayload as any)
    .select('id, created_at')
    .single();

  if (insertError || !generation) {
    console.error('[generate] Insert error:', insertError);
    return apiSuccess({
      generation_id: null,
      response: aiResult.response,
      metadata: aiResult.metadata,
      usage: {
        current_count: quota.current_count,
        daily_limit: quota.daily_limit,
      },
      warning: 'La génération n\'a pas pu être sauvegardée dans l\'historique.',
    });
  }

  // ----- 8. Incrément du compteur quotidien (RPC atomique) -----
  const { data: newCount, error: incrementError } = await supabase.rpc(
    'increment_generation_count',
    { p_user_id: user.id }
  );

  if (incrementError) {
    console.error('[generate] Increment error:', incrementError);
  }

  // ----- 9. Réponse finale -----
  return apiSuccess({
    generation_id: generation.id,
    created_at: generation.created_at,
    response: aiResult.response,
    metadata: aiResult.metadata,
    usage: {
      current_count:
        typeof newCount === 'number' ? newCount : quota.current_count + 1,
      daily_limit: quota.daily_limit,
    },
  });
}

export async function GET() {
  return apiError('NOT_FOUND', 'Méthode non supportée.');
}