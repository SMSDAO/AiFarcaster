/**
 * Farcaster Hub gRPC client.
 *
 * Uses the official @farcaster/hub-nodejs library to connect to a Farcaster hub.
 * Configure the hub URL via the FARCASTER_HUB_URL environment variable.
 * Default: nemes.farcaster.xyz:2283 (public SSL hub).
 *
 * This module is server-side only — never import it in client components.
 */

import 'server-only';
import { getSSLHubRpcClient, type HubRpcClient } from '@farcaster/hub-nodejs';

const DEFAULT_HUB_URL = 'nemes.farcaster.xyz:2283';

const hubUrl = process.env.FARCASTER_HUB_URL ?? DEFAULT_HUB_URL;

let _client: HubRpcClient | null = null;

/**
 * Returns a lazily-initialised, singleton HubRpcClient.
 * Creating the client is cheap (no network round-trip at construction time),
 * so the singleton primarily avoids allocating a new gRPC channel per request.
 */
export function getHubClient(): HubRpcClient {
  if (!_client) {
    _client = getSSLHubRpcClient(hubUrl);
  }
  return _client;
}
