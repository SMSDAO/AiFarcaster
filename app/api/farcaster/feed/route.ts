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
  const pageToken = pageTokenParam
    ? new Uint8Array(Buffer.from(pageTokenParam, 'base64'))
    : undefined;

  try {
    const feed = await getFeed(fid, pageSize, pageToken);
    return NextResponse.json(feed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
