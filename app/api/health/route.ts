import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: process.env.APP_VERSION ?? 'unknown',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
    },
  });
}
