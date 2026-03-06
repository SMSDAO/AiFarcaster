import { NextRequest, NextResponse } from 'next/server';
import { getFidByAddress } from '@/lib/farcaster/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing required query param: address' }, { status: 400 });
  }

  // Basic Ethereum address validation
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid Ethereum address format' }, { status: 400 });
  }

  try {
    const auth = await getFidByAddress(address);
    if (!auth) {
      return NextResponse.json(
        { error: `No Farcaster FID registered to address ${address}` },
        { status: 404 },
      );
    }
    return NextResponse.json(auth);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
