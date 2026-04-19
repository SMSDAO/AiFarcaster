// app/api/monitoring/route.ts
// GET /api/monitoring
// Basic platform metrics for ops dashboards.
// Protected by MONITORING_SECRET env var to prevent public exposure.
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Require a shared secret to access monitoring data
  const secret = process.env.MONITORING_SECRET;
  if (secret) {
    const authHeader = req.headers.get('authorization');
    const provided = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const { prisma } = await import('@/lib/db');

    const [
      totalUsers,
      totalFrames,
      totalTemplates,
      totalActiveSubscriptions,
      totalAirdropCampaigns,
      totalPurchases,
      recentPrompts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.frame.count(),
      prisma.template.count({ where: { active: true } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.airdropCampaign.count(),
      prisma.templatePurchase.count(),
      prisma.prompt.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? 'unknown',
      metrics: {
        users: { total: totalUsers },
        frames: { total: totalFrames },
        templates: { total: totalTemplates },
        subscriptions: { active: totalActiveSubscriptions },
        airdrops: { total: totalAirdropCampaigns },
        purchases: { total: totalPurchases },
        prompts: { last24h: recentPrompts },
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics', message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
