// lib/supabase.ts
// Supabase client setup for server-side and client-side usage.
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env.
// Handles missing env vars gracefully.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

function warnIfMissing() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Admin features will not work.',
    );
  }
}

export function createClient() {
  warnIfMissing();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export function createBrowserClient() {
  warnIfMissing();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export function createServiceClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('[Supabase] Missing SUPABASE_SERVICE_ROLE_KEY. Service role features will not work.');
    return null;
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
}
