/**
 * Farcaster domain types used across API routes and the client UI.
 * The hub returns protobuf-deserialized objects; these types represent
 * the serialisable shapes we pass over the wire in our own API responses.
 */

export interface FarcasterCast {
  hash: string;
  fid: number;
  text: string;
  timestamp: number;
  embeds: FarcasterEmbed[];
  mentions: number[];
  parentCastId?: { fid: number; hash: string };
  parentUrl?: string;
}

export interface FarcasterEmbed {
  url?: string;
  castId?: { fid: number; hash: string };
}

export interface FarcasterUserProfile {
  fid: number;
  username?: string;
  displayName?: string;
  bio?: string;
  pfpUrl?: string;
  url?: string;
}

export interface FarcasterAuth {
  fid: number;
  custodyAddress: string;
}

export interface FarcasterFeedResponse {
  casts: FarcasterCast[];
  nextPageToken?: string;
}
