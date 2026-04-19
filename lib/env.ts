// lib/env.ts
// Server-only environment variable validation.
// Import this module in any API route or server action that needs to confirm
// that required variables are present. Throws clear error messages at
// runtime (not build time) so that the build succeeds without secrets.
import 'server-only';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[env] Required environment variable "${name}" is not set. ` +
        `Add it to .env.local (dev) or Vercel project settings (production).`,
    );
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  return process.env[name];
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
export function getDatabaseUrl(): string {
  return requireEnv('DATABASE_URL');
}

// ---------------------------------------------------------------------------
// OpenAI
// ---------------------------------------------------------------------------
export function getOpenAIKey(): string {
  return requireEnv('OPENAI_API_KEY');
}

// ---------------------------------------------------------------------------
// Upstash Redis (rate limiting)
// ---------------------------------------------------------------------------
export function getUpstashRedisUrl(): string {
  return requireEnv('UPSTASH_REDIS_REST_URL');
}

export function getUpstashRedisToken(): string {
  return requireEnv('UPSTASH_REDIS_REST_TOKEN');
}

export function isRedisConfigured(): boolean {
  return Boolean(
    optionalEnv('UPSTASH_REDIS_REST_URL') &&
      optionalEnv('UPSTASH_REDIS_REST_TOKEN'),
  );
}

// ---------------------------------------------------------------------------
// Stripe
// ---------------------------------------------------------------------------
export function getStripeSecretKey(): string {
  return requireEnv('STRIPE_SECRET_KEY');
}

export function getStripeWebhookSecret(): string {
  return requireEnv('STRIPE_WEBHOOK_SECRET');
}

export function isStripeConfigured(): boolean {
  return Boolean(
    optionalEnv('STRIPE_SECRET_KEY') &&
      optionalEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  );
}

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------
export function getSupabaseServiceRoleKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}

// ---------------------------------------------------------------------------
// Farcaster
// ---------------------------------------------------------------------------
export function getFarcasterHubUrl(): string {
  return optionalEnv('FARCASTER_HUB_URL') ?? 'nemes.farcaster.xyz:2283';
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export function getAppUrl(): string {
  return (
    optionalEnv('NEXT_PUBLIC_URL') ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}

// ---------------------------------------------------------------------------
// Feature flags (server-side only)
// ---------------------------------------------------------------------------

/** Token Launcher is not yet production-ready. Disable until fully audited. */
export const FEATURE_TOKEN_LAUNCHER_ENABLED =
  optionalEnv('FEATURE_TOKEN_LAUNCHER') === 'true';

/** Crypto payments require a payment receiver address and working viem logic. */
export const FEATURE_CRYPTO_PAYMENTS_ENABLED =
  Boolean(optionalEnv('NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS')) &&
  optionalEnv('FEATURE_CRYPTO_PAYMENTS') === 'true';
