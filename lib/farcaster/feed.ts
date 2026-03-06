/**
 * Farcaster feed retrieval.
 *
 * Fetches casts for a given FID from the connected Farcaster hub.
 * Supports pagination via the opaque page-token returned by the hub.
 *
 * This module is server-side only — never import it in client components.
 */

import 'server-only';
import {
  bytesToHexString,
  isCastAddMessage,
  type Message,
} from '@farcaster/hub-nodejs';
import { getHubClient } from './hub-client';
import type { FarcasterCast, FarcasterEmbed, FarcasterFeedResponse } from '@/types/farcaster';

const DEFAULT_PAGE_SIZE = 20;

function castFromMessage(msg: Message): FarcasterCast | null {
  if (!isCastAddMessage(msg) || !msg.data?.castAddBody) return null;

  const body = msg.data.castAddBody;
  const hashResult = bytesToHexString(msg.hash);
  // Skip messages whose hash cannot be decoded — they would produce empty/duplicate IDs.
  if (hashResult.isErr()) return null;

  const embeds: FarcasterEmbed[] = (body.embeds ?? []).flatMap((e) => {
    const embed: FarcasterEmbed = {};
    if (e.url) embed.url = e.url;
    if (e.castId) {
      const castIdHashResult = bytesToHexString(e.castId.hash);
      // Skip embeds with un-decodable hashes rather than emitting empty values.
      if (castIdHashResult.isErr()) return [];
      embed.castId = { fid: e.castId.fid, hash: castIdHashResult.value };
    }
    return [embed];
  });

  const result: FarcasterCast = {
    hash: hashResult.value,
    fid: msg.data.fid,
    text: body.text,
    timestamp: msg.data.timestamp,
    embeds,
    mentions: body.mentions ?? [],
  };

  if (body.parentCastId) {
    const parentHashResult = bytesToHexString(body.parentCastId.hash);
    // Skip the parent reference if its hash cannot be decoded.
    if (parentHashResult.isOk()) {
      result.parentCastId = { fid: body.parentCastId.fid, hash: parentHashResult.value };
    }
  }

  if (body.parentUrl) result.parentUrl = body.parentUrl;

  return result;
}

/**
 * Retrieves recent casts for the given FID.
 *
 * @param fid        Farcaster user ID to fetch casts for.
 * @param pageSize   Maximum number of casts to return (default: 20).
 * @param pageToken  Opaque continuation token from a previous call.
 */
export async function getFeed(
  fid: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
  pageToken?: Uint8Array,
): Promise<FarcasterFeedResponse> {
  const client = getHubClient();
  const result = await client.getCastsByFid({
    fid,
    pageSize,
    pageToken,
    reverse: true,
  });

  if (result.isErr()) {
    throw new Error(`Failed to fetch feed for FID ${fid}: ${result.error.message}`);
  }

  const casts: FarcasterCast[] = result.value.messages
    .map(castFromMessage)
    .filter((c): c is FarcasterCast => c !== null);

  const nextPageToken =
    result.value.nextPageToken && result.value.nextPageToken.length > 0
      ? Buffer.from(result.value.nextPageToken).toString('base64')
      : undefined;

  return { casts, nextPageToken };
}
