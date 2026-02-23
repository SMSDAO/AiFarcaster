// lib/supabase.server.ts
// Server-only Supabase client using the service role key.
// This file must only be imported from server-side code (API routes, server actions, etc.).
// The `server-only` import causes a build error if this module is accidentally
// imported in a client component, preventing the service role key from leaking.

import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/**
 * Service role client with elevated privileges.
 * Only use in trusted server-side contexts (never in client components).
 */
export function createServiceClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn(
      '[Supabase] Missing SUPABASE_SERVICE_ROLE_KEY. Service role features will not work.',
    );
    return null;
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
