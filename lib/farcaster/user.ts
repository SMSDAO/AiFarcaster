/**
 * Farcaster user profile retrieval.
 *
 * Fetches all UserData messages for a given FID from the connected hub and
 * assembles them into a single {@link FarcasterUserProfile} object.
 *
 * This module is server-side only — never import it in client components.
 */

import 'server-only';
import { UserDataType, isUserDataAddMessage } from '@farcaster/hub-nodejs';
import { getHubClient } from './hub-client';
import type { FarcasterUserProfile } from '@/types/farcaster';

/**
 * Retrieves the public profile for the given Farcaster user ID.
 *
 * @param fid  Farcaster user ID.
 * @returns    A populated {@link FarcasterUserProfile}, or `null` if the hub
 *             returns an error (e.g. unknown FID).
 */
export async function getUserProfile(
  fid: number,
): Promise<FarcasterUserProfile | null> {
  const client = getHubClient();
  const result = await client.getUserDataByFid({ fid });

  if (result.isErr()) {
    return null;
  }

  const profile: FarcasterUserProfile = { fid };

  for (const msg of result.value.messages) {
    if (!isUserDataAddMessage(msg) || !msg.data?.userDataBody) continue;
    const { type, value } = msg.data.userDataBody;
    switch (type) {
      case UserDataType.PFP:
        profile.pfpUrl = value;
        break;
      case UserDataType.DISPLAY:
        profile.displayName = value;
        break;
      case UserDataType.BIO:
        profile.bio = value;
        break;
      case UserDataType.USERNAME:
        profile.username = value;
        break;
      case UserDataType.URL:
        profile.url = value;
        break;
    }
  }

  return profile;
}
