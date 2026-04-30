import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { updateGenerationSchema } from '@/lib/api/validation';
import type { GenerationUpdate } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const uuidSchema = z.string().uuid();

/**
 * GET /api/history/[id]
 * Récupère une génération spécifique.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return apiError('VALIDATION_ERROR', 'ID invalide.');
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .single();

  if (error || !data) {
    return apiError('NOT_FOUND', 'Génération introuvable.');
  }

  return apiSuccess(data);
}

/**
 * PATCH /api/history/[id]
 * Met à jour une génération (ex: toggle favori).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return apiError('VALIDATION_ERROR', 'ID invalide.');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Body JSON invalide.');
  }

  const parsed = updateGenerationSchema.safeParse(body);
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
  const updatePayload: GenerationUpdate = parsed.data;

  const { data, error } = await supabase
    .from('generations')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updatePayload as any)
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .select('id, is_favorite')
    .single();

  if (error || !data) {
    console.error('[history PATCH] Error:', error);
    return apiError(
      'NOT_FOUND',
      'Génération introuvable ou mise à jour échouée.'
    );
  }

  return apiSuccess(data);
}

/**
 * DELETE /api/history/[id]
 * Supprime une génération.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Connexion requise.');
  }

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return apiError('VALIDATION_ERROR', 'ID invalide.');
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', id)
    .eq('user_id', auth.user.id);

  if (error) {
    console.error('[history DELETE] Error:', error);
    return apiError('INTERNAL_ERROR', 'Suppression échouée.');
  }

  return apiSuccess({ deleted: true, id });
}