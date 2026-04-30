import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Client Supabase ADMIN avec privilèges complets.
 *
 * ⚠️ ATTENTION ⚠️
 * - Utilise SUPABASE_SERVICE_ROLE_KEY (bypass RLS)
 * - À utiliser UNIQUEMENT côté serveur (Server Actions, Route Handlers, Webhooks)
 * - JAMAIS dans un Client Component
 *
 * Usage :
 *   - Webhooks Stripe (modifier le plan d'un user)
 *   - Tâches d'administration
 *   - Opérations qui doivent contourner les RLS
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}