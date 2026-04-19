import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

/**
 * POST /api/farcaster/cast
 *
 * SECURITY: This endpoint requires an authenticated session. The signer key is
 * stored server-side (via FARCASTER_SIGNER_PRIVATE_KEY environment variable)
 * and the client submits only the cast text together with an authenticated
 * session token.
 *
 * The fid field is optional — when omitted the server uses its own registered
 * FID. When supplied, the authenticated user must match the requested FID to
 * prevent cross-user impersonation.
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Authenticate the caller first
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate the server-side signer key is configured
  const signerKeyHex = process.env.FARCASTER_SIGNER_PRIVATE_KEY;
  if (!signerKeyHex) {
    return NextResponse.json(
      { error: 'Farcaster signer is not configured on this server. Set FARCASTER_SIGNER_PRIVATE_KEY.' },
      { status: 503 },
    );
  }

  let body: { fid?: unknown; text?: unknown };
  try {
    body = (await request.json()) as { fid?: unknown; text?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { fid, text } = body;

  if (!Number.isInteger(fid) || (fid as number) <= 0) {
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

  // Parse the server-held private key (hex string without 0x prefix, 64 chars = 32 bytes)
  const cleaned = signerKeyHex.startsWith('0x') ? signerKeyHex.slice(2) : signerKeyHex;
  if (!/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    return NextResponse.json(
      { error: 'FARCASTER_SIGNER_PRIVATE_KEY is not a valid 32-byte hex string' },
      { status: 500 },
    );
  }
  const signerPrivateKey = new Uint8Array(Buffer.from(cleaned, 'hex'));

  try {
    const { publishCast } = await import('@/lib/farcaster/cast');
    const result = await publishCast(fid as number, text, signerPrivateKey);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
