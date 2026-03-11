import { NextRequest, NextResponse } from 'next/server';
import { getFeed } from '@/lib/farcaster/feed';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const fidParam = searchParams.get('fid');
  const pageSizeParam = searchParams.get('pageSize');
  const pageTokenParam = searchParams.get('pageToken');

  if (!fidParam) {
    return NextResponse.json({ error: 'Missing required query param: fid' }, { status: 400 });
  }

  const fid = parseInt(fidParam, 10);
  if (isNaN(fid) || fid <= 0) {
    return NextResponse.json({ error: 'Invalid fid: must be a positive integer' }, { status: 400 });
  }

  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 20;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    return NextResponse.json(
      { error: 'Invalid pageSize: must be an integer between 1 and 100' },
      { status: 400 },
    );
  }

  let pageToken: Uint8Array | undefined;
  if (pageTokenParam !== null) {
    // Validate that the token is a properly-padded base64 string before decoding.
    // Buffer.from(str, 'base64') silently accepts many invalid inputs; an invalid
    // token would produce garbage bytes and a confusing 500 from the hub.
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(pageTokenParam)) {
      return NextResponse.json(
        { error: 'Invalid pageToken: must be a base64-encoded string' },
        { status: 400 },
      );
    }
    pageToken = new Uint8Array(Buffer.from(pageTokenParam, 'base64'));
  }

  try {
    const feed = await getFeed(fid, pageSize, pageToken);
    return NextResponse.json(feed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
