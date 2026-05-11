import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { checkRateLimit } from '@/lib/api/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/stats
 *
 * Retourne les statistiques de l'utilisateur connecté.
 * - Tous les utilisateurs : stats de base (totaux, semaine, aujourd'hui)
 * - Pro : répartition par mode de communication
 */
export async function GET(_req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté pour accéder aux statistiques.');
  }
  const { user, profile } = auth;

  const rateLimit = checkRateLimit({
    identifier: `stats:${user.id}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return apiError('RATE_LIMITED', 'Trop de requêtes. Réessaie dans une minute.');
  }

  const supabase = await createClient();
  const isPro = profile.plan === 'pro' || profile.plan === 'enterprise';

  // Récupère la vue user_stats
  const { data: statsRow, error: statsError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (statsError && statsError.code !== 'PGRST116') {
    console.error('[stats] Erreur user_stats:', statsError);
    return apiError('INTERNAL_ERROR', 'Impossible de récupérer les statistiques.');
  }

  const stats = {
    total_generations: statsRow?.total_generations ?? 0,
    favorite_generations: statsRow?.favorite_generations ?? 0,
    today_generations: statsRow?.today_generations ?? 0,
    week_generations: statsRow?.week_generations ?? 0,
    last_generation_at: statsRow?.last_generation_at ?? null,
  };

  // Répartition par mode (Pro uniquement)
  let mode_distribution: Record<string, number> | null = null;

  if (isPro) {
    const { data: modeData, error: modeError } = await supabase
      .from('generations')
      .select('mode')
      .eq('user_id', user.id);

    if (!modeError && modeData) {
      const dist: Record<string, number> = {};
      for (const row of modeData) {
        if (row.mode) {
          dist[row.mode] = (dist[row.mode] ?? 0) + 1;
        }
      }
      mode_distribution = dist;
    }
  }

  // Activité des 7 derniers jours (Pro uniquement)
  let weekly_activity: { date: string; count: number }[] | null = null;

  if (isPro) {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const { data: weekData, error: weekError } = await supabase
      .from('generations')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', since.toISOString());

    if (!weekError && weekData) {
      const dayMap: Record<string, number> = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(since);
        d.setDate(d.getDate() + i);
        dayMap[d.toISOString().slice(0, 10)] = 0;
      }
      for (const row of weekData) {
        const day = row.created_at.slice(0, 10);
        if (day in dayMap) dayMap[day]++;
      }
      weekly_activity = Object.entries(dayMap).map(([date, count]) => ({ date, count }));
    }
  }

  return apiSuccess({
    stats,
    mode_distribution,
    weekly_activity,
    is_pro: isPro,
  });
}

export async function POST() {
  return apiError('NOT_FOUND', 'Méthode non supportée.');
}
