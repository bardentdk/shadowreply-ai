import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Client Supabase pour les Server Components et API Routes.
 * Lit les cookies de session pour identifier l'utilisateur.
 * RLS est appliquée.
 *
 * Usage (Server Component) :
 *   import { createClient } from '@/lib/supabase/server';
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll peut échouer dans un Server Component (read-only).
            // Le middleware se charge du refresh des sessions, donc OK.
          }
        },
      },
    }
  );
}