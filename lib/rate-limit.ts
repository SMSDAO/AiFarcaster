// lib/rate-limit.ts
// Token-bucket rate limiter backed by Upstash Redis.
// Each key is a string uniquely identifying the caller (e.g. userId or IP).
// Limits are checked via a sliding-window counter stored in Redis.
import 'server-only';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/** Singleton Redis client – only instantiated when env vars are present. */
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redisClient = getRedis();

/**
 * Rate-limit configuration for a given tier.
 * Returns a `Ratelimit` instance or null when Redis is not configured
 * (development graceful-degradation).
 */
function buildLimiter(requests: number, windowSeconds: number): Ratelimit | null {
  if (!redisClient) return null;
  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: false,
  });
}

/** 100 requests per 60 seconds (free tier). */
const freeLimiter = buildLimiter(100, 60);

/** 1000 requests per 60 seconds (pro tier). */
const proLimiter = buildLimiter(1000, 60);

export type RateLimitTier = 'free' | 'pro';

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  reset: number;
}

/**
 * Check whether `key` has exceeded its rate limit for `tier`.
 * When Redis is not configured, always returns success (dev mode).
 */
export async function checkRateLimit(
  key: string,
  tier: RateLimitTier = 'free',
): Promise<RateLimitResult> {
  const limiter = tier === 'pro' ? proLimiter : freeLimiter;
  if (!limiter) {
    return { success: true, remaining: Infinity, reset: 0 };
  }

  const result = await limiter.limit(key);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
