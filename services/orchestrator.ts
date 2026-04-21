/**
 * Social-graph sync orchestrator.
 *
 * Provides `executeSwarmSync` — a circuit-breaker-protected function that
 * fetches the Farcaster social graph for a given FID from the hub and upserts
 * it into the `SocialGraphCache` table.
 *
 * Usage pattern:
 *   - Trigger from a background route / cron job when `lastSyncedAt` is stale
 *     (> 24 hours old).
 *   - Pass `userId` for first-time creation; subsequent syncs can omit it
 *     (the existing record is found by `fid`).
 *
 * This module is server-side only — never import it in client components.
 */

import 'server-only';
import { isLinkAddMessage } from '@farcaster/hub-nodejs';
import { prisma } from '@/lib/db';
import { getHubClient } from '@/lib/farcaster/hub-client';
import type { SocialGraphCache } from '@prisma/client';

// ---------------------------------------------------------------------------
// Internal: Farcaster graph fetcher
// ---------------------------------------------------------------------------

interface SocialGraph {
  followingFids: number[];
  followerFids: number[];
  mutualFids: number[];
}

/**
 * Fetches the social graph for `fid` from the connected Farcaster hub.
 *
 * Returns three FID lists:
 *   - `followingFids` — FIDs this user follows
 *   - `followerFids`  — FIDs that follow this user
 *   - `mutualFids`    — intersection (mutual follows)
 *
 * Non-fatal hub errors (e.g. FID not found) return empty arrays so the caller
 * can still upsert a valid (albeit empty) cache record.
 */
async function fetchFarcasterGraph(fid: number): Promise<SocialGraph> {
  const client = getHubClient();

  // --- Who this FID follows ---
  const followingResult = await client.getLinksByFid({ fid, linkType: 'follow' });
  const followingFids: number[] = [];

  if (followingResult.isOk()) {
    for (const msg of followingResult.value.messages) {
      if (!isLinkAddMessage(msg)) continue;
      const targetFid = msg.data?.linkBody?.targetFid;
      if (typeof targetFid === 'number') followingFids.push(targetFid);
    }
  }

  // --- Who follows this FID ---
  const followersResult = await client.getLinksByTargetFid({ targetFid: fid, linkType: 'follow' });
  const followerFids: number[] = [];

  if (followersResult.isOk()) {
    for (const msg of followersResult.value.messages) {
      if (!isLinkAddMessage(msg)) continue;
      // The FID of the person who created the follow link is in msg.data.fid
      const followerFid = msg.data?.fid;
      if (typeof followerFid === 'number') followerFids.push(followerFid);
    }
  }

  const followingSet = new Set(followingFids);
  const mutualFids = followerFids.filter((f) => followingSet.has(f));

  return { followingFids, followerFids, mutualFids };
}

// ---------------------------------------------------------------------------
// Public: Circuit-breaker sync
// ---------------------------------------------------------------------------

const CIRCUIT_BREAKER_LIMIT = 3;
const RETRY_BASE_DELAY_MS = 500;

/**
 * Syncs the Farcaster social graph for `fid` into `SocialGraphCache`.
 *
 * Implements a simple circuit-breaker: retries up to `CIRCUIT_BREAKER_LIMIT`
 * times with exponential back-off before re-throwing the last error.
 *
 * @param fid     Farcaster FID to sync.
 * @param userId  Internal user ID — required only when creating a new cache
 *                record (i.e. first-time sync). Subsequent syncs can omit it.
 * @returns       The upserted `SocialGraphCache` record.
 * @throws        If all retry attempts are exhausted.
 */
export async function executeSwarmSync(
  fid: number,
  userId?: string,
): Promise<SocialGraphCache> {
  let attempts = 0;
  let lastError: unknown;

  while (attempts < CIRCUIT_BREAKER_LIMIT) {
    try {
      return await prisma.$transaction(async (tx) => {
        const syncData = await fetchFarcasterGraph(fid);

        // For upsert create, we need a userId. Derive it from an existing
        // record if the caller didn't provide one.
        let resolvedUserId = userId;
        if (!resolvedUserId) {
          const existing = await tx.socialGraphCache.findUnique({ where: { fid } });
          if (!existing) {
            throw new Error(
              `[orchestrator] executeSwarmSync: no SocialGraphCache record exists for fid=${fid} ` +
                'and no userId was provided. Pass userId for first-time creation.',
            );
          }
          resolvedUserId = existing.userId;
        }

        return tx.socialGraphCache.upsert({
          where: { fid },
          update: {
            followingFids: syncData.followingFids,
            followerFids: syncData.followerFids,
            mutualFids: syncData.mutualFids,
            lastSyncedAt: new Date(),
          },
          create: {
            userId: resolvedUserId,
            fid,
            followingFids: syncData.followingFids,
            followerFids: syncData.followerFids,
            mutualFids: syncData.mutualFids,
            lastSyncedAt: new Date(),
          },
        });
      });
    } catch (err) {
      lastError = err;
      attempts += 1;

      if (attempts < CIRCUIT_BREAKER_LIMIT) {
        // Exponential back-off: 500 ms, 1000 ms, …
        await new Promise<void>((resolve) =>
          setTimeout(resolve, RETRY_BASE_DELAY_MS * attempts),
        );
      }
    }
  }

  throw lastError;
}

/**
 * Returns `true` if the `SocialGraphCache` record for `fid` is stale
 * (i.e. `lastSyncedAt` is older than `maxAgeMs`, default 24 h).
 *
 * Helper intended for use in background-sync routes to determine whether a
 * re-sync is needed before calling `executeSwarmSync`.
 */
export async function isSocialGraphStale(
  fid: number,
  maxAgeMs: number = 24 * 60 * 60 * 1000,
): Promise<boolean> {
  const record = await prisma.socialGraphCache.findUnique({
    where: { fid },
    select: { lastSyncedAt: true },
  });

  if (!record) return true;
  return Date.now() - record.lastSyncedAt.getTime() > maxAgeMs;
}
