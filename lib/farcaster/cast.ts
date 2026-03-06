/**
 * Farcaster cast publishing.
 *
 * Constructs, signs, and submits a CastAdd message to the connected hub.
 *
 * This module is server-side only — never import it in client components.
 */

import 'server-only';
import {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  CastType,
  bytesToHexString,
} from '@farcaster/hub-nodejs';
import { getHubClient } from './hub-client';

export interface PublishCastResult {
  success: boolean;
  hash?: string;
  error?: string;
}

/**
 * Publishes a new cast on behalf of a Farcaster user.
 *
 * @param fid              The Farcaster user ID of the author.
 * @param text             The cast text (max 320 bytes).
 * @param signerPrivateKey The 32-byte Ed25519 private key of the registered signer.
 */
export async function publishCast(
  fid: number,
  text: string,
  signerPrivateKey: Uint8Array,
): Promise<PublishCastResult> {
  const signer = new NobleEd25519Signer(signerPrivateKey);

  const castResult = await makeCastAdd(
    { text, type: CastType.CAST, embeds: [], embedsDeprecated: [], mentions: [], mentionsPositions: [] },
    { fid, network: FarcasterNetwork.MAINNET },
    signer,
  );

  if (castResult.isErr()) {
    return { success: false, error: castResult.error.message };
  }

  const client = getHubClient();
  const submitResult = await client.submitMessage(castResult.value);

  if (submitResult.isErr()) {
    return { success: false, error: submitResult.error.message };
  }

  const hashResult = bytesToHexString(submitResult.value.hash);
  return {
    success: true,
    hash: hashResult.isOk() ? hashResult.value : undefined,
  };
}
