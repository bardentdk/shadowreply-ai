import type { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { checkRateLimit } from '@/lib/api/rate-limit';
import { analyzeInputSchema } from '@/lib/api/validation';
import { analyzeMessage } from '@/lib/ai/analyze';
import { AIError } from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/analyze
 *
 * Analyse un message sans générer de réponses et sans consommer de quota.
 *
 * - Tous les utilisateurs peuvent appeler cette route.
 * - Utilisateurs Free : analyse de base (tone, interest, intention, suggested_mode).
 * - Utilisateurs Pro : analyse complète (+ power_dynamic, risks, strategic_advice).
 */
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté pour analyser un message.');
  }
  const { user, profile } = auth;

  // Rate limit commun (12 req/min)
  const rateLimit = checkRateLimit({
    identifier: `analyze:${user.id}`,
    limit: 12,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return apiError('RATE_LIMITED', 'Trop de requêtes. Réessaie dans une minute.', {
      resetAt: rateLimit.resetAt,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Body JSON invalide.');
  }

  const parsed = analyzeInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Données invalides.', parsed.error.flatten());
  }

  const input = {
    ...parsed.data,
    language: parsed.data.language || profile.language || 'fr',
  };

  try {
    const result = await analyzeMessage(input);
    const isPro = profile.plan === 'pro' || profile.plan === 'enterprise';

    // Filtre les champs avancés pour les utilisateurs Free
    const safeResult = isPro
      ? result
      : {
          detected_tone: result.detected_tone,
          interest_level: result.interest_level,
          probable_intention: result.probable_intention,
          suggested_mode: result.suggested_mode,
          confidence: result.confidence,
          // Champs Pro masqués
          power_dynamic: null,
          risks: null,
          strategic_advice: null,
        };

    return apiSuccess({ result: safeResult, is_pro: isPro });
  } catch (err) {
    console.error('[analyze] Erreur IA:', err);

    if (err instanceof AIError) {
      switch (err.code) {
        case 'RATE_LIMIT':
          return apiError('AI_PROVIDER_ERROR', 'Le service IA est saturé. Réessaie dans quelques secondes.');
        case 'TIMEOUT':
          return apiError('AI_PROVIDER_ERROR', "L'analyse a pris trop de temps. Réessaie.");
        default:
          return apiError('AI_PROVIDER_ERROR', 'Erreur du service IA. Réessaie.');
      }
    }

    return apiError('INTERNAL_ERROR', 'Une erreur inattendue est survenue.');
  }
}

export async function GET() {
  return apiError('NOT_FOUND', 'Méthode non supportée.');
}
