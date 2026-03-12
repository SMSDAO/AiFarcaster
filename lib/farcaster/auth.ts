/**
 * Farcaster wallet-based authentication helpers.
 *
 * Uses the hub's on-chain ID-registry events to look up the Farcaster ID (FID)
 * that is registered to a given Ethereum custody address.
 *
 * This module is server-side only — never import it in client components.
 */

import 'server-only';
import { hexStringToBytes } from '@farcaster/hub-nodejs';
import { getHubClient } from './hub-client';
import type { FarcasterAuth } from '@/types/farcaster';

/**
 * Looks up the Farcaster FID registered to an Ethereum custody address.
 *
 * @param address  Hex-encoded Ethereum address (with or without the 0x prefix).
 * @returns        A {@link FarcasterAuth} object with the resolved FID, or
 *                 `null` if no FID is registered to the address.
 */
export async function getFidByAddress(
  address: string,
): Promise<FarcasterAuth | null> {
  const normalised = address.startsWith('0x') ? address : `0x${address}`;
  const bytesResult = hexStringToBytes(normalised);
  if (bytesResult.isErr()) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }

  const client = getHubClient();
  const result = await client.getIdRegistryOnChainEventByAddress({
    address: bytesResult.value,
  });

  if (result.isErr()) {
    // Only treat an explicit "not found" as null — no FID registered to this address.
    // All other errors (hub unavailable, network failure, etc.) should surface as 5xx.
    if (result.error.errCode === 'not_found') return null;
    throw new Error(
      `Hub error looking up FID for address ${address}: ${result.error.message}`,
    );
  }

  const fid = result.value.fid;
  return { fid, custodyAddress: normalised };
}
