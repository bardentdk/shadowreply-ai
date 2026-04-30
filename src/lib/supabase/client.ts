import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Client Supabase pour les Components côté navigateur (Client Components).
 * Utilise la clé anonyme — RLS est appliquée.
 *
 * Usage :
 *   'use client';
 *   import { createClient } from '@/lib/supabase/client';
 *   const supabase = createClient();
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}