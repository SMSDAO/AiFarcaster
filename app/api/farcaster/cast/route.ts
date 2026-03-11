import { NextRequest, NextResponse } from 'next/server';
import { publishCast } from '@/lib/farcaster/cast';

/**
 * POST /api/farcaster/cast
 *
 * SECURITY NOTE: This endpoint currently accepts a raw Ed25519 private key
 * (`signerPrivateKey`) in the request body. Transmitting private keys over
 * HTTP — even to your own backend — is high-risk: keys can be captured by
 * browser extensions, logs, proxies, or analytics.
 *
 * For production use, redesign this so the server holds the signer key
 * (e.g., stored in a secret manager / environment variable), and the client
 * authenticates via a session token. The client should submit only the cast
 * text; the server looks up the registered signer key for the authenticated
 * user.
 */

interface CastRequestBody {
  fid: number;
  text: string;
  signerPrivateKey: number[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: CastRequestBody;
  try {
    body = (await request.json()) as CastRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { fid, text, signerPrivateKey } = body;

  if (!Number.isInteger(fid) || fid <= 0) {
    return NextResponse.json({ error: 'Invalid or missing field: fid' }, { status: 400 });
  }
  if (typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid or missing field: text' }, { status: 400 });
  }
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  if (textBytes.length > 320) {
    return NextResponse.json(
      { error: 'Invalid field: text must be at most 320 bytes' },
      { status: 400 },
    );
  }
  if (
    !Array.isArray(signerPrivateKey) ||
    signerPrivateKey.length !== 32 ||
    !signerPrivateKey.every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 255,
    )
  ) {
    return NextResponse.json(
      {
        error:
          'Invalid or missing field: signerPrivateKey (expected 32-byte array of integers in [0, 255])',
      },
      { status: 400 },
    );
  }

  try {
    const result = await publishCast(fid, text, new Uint8Array(signerPrivateKey));
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
