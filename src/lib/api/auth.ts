import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

/**
 * Récupère l'utilisateur authentifié + son profil.
 * Retourne null si non authentifié.
 */
export async function getAuthenticatedUser(): Promise<{
  user: User;
  profile: Profile;
} | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // Récupère le profil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return { user, profile };
}