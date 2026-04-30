import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { updateProfileSchema } from '@/lib/api/validation';
import type { ProfileUpdate } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/me
 * Récupère le profil de l'utilisateur connecté.
 */
export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  return apiSuccess({
    user: {
      id: auth.user.id,
      email: auth.user.email,
    },
    profile: auth.profile,
  });
}

/**
 * PATCH /api/me
 * Met à jour le profil.
 */
export async function PATCH(req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Body JSON invalide.');
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      'VALIDATION_ERROR',
      'Données invalides.',
      parsed.error.flatten()
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return apiError('VALIDATION_ERROR', 'Aucun champ à mettre à jour.');
  }

  const supabase = await createClient();
  const updatePayload: ProfileUpdate = parsed.data;

  const { data, error } = await supabase
    .from('profiles')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updatePayload as any)
    .eq('id', auth.user.id)
    .select('*')
    .single();

  if (error || !data) {
    console.error('[me PATCH] Error:', error);
    return apiError('INTERNAL_ERROR', 'Mise à jour échouée.');
  }

  return apiSuccess({ profile: data });
}