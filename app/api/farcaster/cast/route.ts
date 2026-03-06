import { NextRequest, NextResponse } from 'next/server';
import { publishCast } from '@/lib/farcaster/cast';

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

  if (!fid || typeof fid !== 'number' || fid <= 0) {
    return NextResponse.json({ error: 'Invalid or missing field: fid' }, { status: 400 });
  }
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid or missing field: text' }, { status: 400 });
  }
  if (!Array.isArray(signerPrivateKey) || signerPrivateKey.length !== 32) {
    return NextResponse.json(
      { error: 'Invalid or missing field: signerPrivateKey (expected 32-byte array)' },
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
