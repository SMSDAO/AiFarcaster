import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/farcaster/user';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const fidParam = searchParams.get('fid');

  if (!fidParam) {
    return NextResponse.json({ error: 'Missing required query param: fid' }, { status: 400 });
  }

  const fid = parseInt(fidParam, 10);
  if (isNaN(fid) || fid <= 0) {
    return NextResponse.json({ error: 'Invalid fid: must be a positive integer' }, { status: 400 });
  }

  try {
    const profile = await getUserProfile(fid);
    if (!profile) {
      return NextResponse.json({ error: `No profile found for FID ${fid}` }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
