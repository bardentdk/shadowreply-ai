import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { historyQuerySchema } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/history
 *
 * Récupère l'historique paginé des générations de l'utilisateur.
 *
 * Query params :
 *   - page: number (défaut 1)
 *   - limit: number (défaut 10, max 50)
 *   - mode?: CommunicationMode (filtre)
 *   - favorites_only?: 'true' | 'false'
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  const { searchParams } = new URL(req.url);
  const queryRaw = Object.fromEntries(searchParams.entries());

  const parsed = historyQuerySchema.safeParse(queryRaw);
  if (!parsed.success) {
    return apiError(
      'VALIDATION_ERROR',
      'Paramètres invalides.',
      parsed.error.flatten()
    );
  }

  const { page, limit, mode, favorites_only } = parsed.data;
  const supabase = await createClient();

  // Construction de la requête
  let query = supabase
    .from('generations')
    .select(
      'id, input_message, context, objective, mode, ai_response, is_favorite, created_at',
      { count: 'exact' }
    )
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false });

  if (mode) {
    query = query.eq('mode', mode);
  }
  if (favorites_only) {
    query = query.eq('is_favorite', true);
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('[history GET] Error:', error);
    return apiError('INTERNAL_ERROR', 'Impossible de charger l\'historique.');
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return apiSuccess({
    items: data || [],
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  });
}