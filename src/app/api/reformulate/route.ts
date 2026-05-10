import type { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { checkRateLimit } from '@/lib/api/rate-limit';
import { reformulateInputSchema } from '@/lib/api/validation';
import { reformulateDraft } from '@/lib/ai/reformulate';
import { AIError } from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/reformulate
 *
 * Reformule un brouillon de message en 3 versions (Pro uniquement).
 *
 * Body :
 *   - draft: string (requis)
 *   - objective?: string
 *   - context?: string
 *   - language?: 'fr' | 'en' | 'es'
 */
export async function POST(req: NextRequest) {
  // 1. Auth
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté pour reformuler.');
  }
  const { user, profile } = auth;

  // 2. Plan Pro uniquement
  if (profile.plan === 'free') {
    return apiError(
      'FORBIDDEN',
      'Le reformulateur est réservé au plan Pro. Passe Pro pour accéder à cette fonctionnalité.'
    );
  }

  // 3. Rate limit
  const rateLimit = checkRateLimit({
    identifier: `reformulate:${user.id}`,
    limit: 15,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return apiError('RATE_LIMITED', 'Trop de requêtes. Réessaie dans une minute.', {
      resetAt: rateLimit.resetAt,
    });
  }

  // 4. Validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Body JSON invalide.');
  }

  const parsed = reformulateInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Données invalides.', parsed.error.flatten());
  }

  const input = {
    ...parsed.data,
    language: parsed.data.language || profile.language || 'fr',
  };

  // 5. Appel IA
  try {
    const result = await reformulateDraft(input);
    return apiSuccess({ result });
  } catch (err) {
    console.error('[reformulate] Erreur IA:', err);

    if (err instanceof AIError) {
      switch (err.code) {
        case 'RATE_LIMIT':
          return apiError('AI_PROVIDER_ERROR', 'Le service IA est saturé. Réessaie dans quelques secondes.');
        case 'TIMEOUT':
          return apiError('AI_PROVIDER_ERROR', 'La reformulation a pris trop de temps. Réessaie.');
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
