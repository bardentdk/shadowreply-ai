import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import type { CanUserGenerateRow } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/usage
 *
 * Retourne le compteur quotidien de l'utilisateur :
 *   - current_count : générations utilisées aujourd'hui
 *   - daily_limit : limite selon le plan
 *   - remaining : générations restantes
 *   - plan : plan actuel
 */
export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('can_user_generate', {
    p_user_id: auth.user.id,
  });

  if (error) {
    console.error('[usage] Error:', error);
    return apiError('INTERNAL_ERROR', 'Impossible de récupérer l\'usage.');
  }

  const quotaArray = data as unknown as CanUserGenerateRow[] | null;
  const quota: CanUserGenerateRow | null =
    Array.isArray(quotaArray) && quotaArray.length > 0 ? quotaArray[0] : null;

  if (!quota) {
    return apiError('INTERNAL_ERROR', 'Données de quota indisponibles.');
  }

  return apiSuccess({
    current_count: quota.current_count,
    daily_limit: quota.daily_limit,
    remaining: Math.max(0, quota.daily_limit - quota.current_count),
    can_generate: quota.can_generate,
    plan: quota.user_plan,
  });
}