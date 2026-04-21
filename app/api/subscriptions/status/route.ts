// app/api/subscriptions/status/route.ts
// GET /api/subscriptions/status
// Returns the authenticated user's current subscription status and plan.
// Used by the frontend to gate premium content.
import 'server-only';
import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ok, unauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ['ACTIVE', 'TRIALING'] } },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) {
    return ok({
      hasActiveSubscription: false,
      plan: null,
      status: null,
      currentPeriodEnd: null,
    });
  }

  return ok({
    hasActiveSubscription: true,
    plan: subscription.plan,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
  });
}
