// lib/supabase.ts
// Supabase client setup for client-side (browser) usage.
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env.
// Handles missing env vars gracefully — logs a warning once (dev only) and returns null.
//
// For server-side service role usage, see lib/supabase.server.ts.

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Warn only once per module load, only in development, to avoid repeated console noise.
let _warned = false;
function warnIfMissing() {
  if (_warned || (supabaseUrl && supabaseAnonKey)) return;
  _warned = true;
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Admin features will not work.',
    );
  }
}

/** Server-side anon client (for non-SSR server usage where cookie handling isn't needed). */
export function createClient() {
  warnIfMissing();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Browser client that stores the session in cookies so that
 * the middleware (via @supabase/ssr) can read and validate it.
 */
export function createBrowserClient() {
  warnIfMissing();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
}
