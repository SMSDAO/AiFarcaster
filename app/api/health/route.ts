import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: process.env.APP_VERSION ?? '0.1.0',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
    },
  });
}
