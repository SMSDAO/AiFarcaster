// app/api/templates/[id]/route.ts
// GET /api/templates/:id – Get a single template with entitlement information.
import 'server-only';
import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ok, notFound } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const template = await prisma.template.findFirst({ where: { id, active: true } });
  if (!template) return notFound('Template');

  // Optionally include entitlement info if authenticated
  const user = await getUserFromRequest(req);
  let hasAccess = template.tier === 'FREE';

  if (user && template.tier === 'PREMIUM') {
    const [activeSub, purchase] = await Promise.all([
      prisma.subscription.findFirst({
        where: { userId: user.id, status: { in: ['ACTIVE', 'TRIALING'] } },
      }),
      prisma.templatePurchase.findFirst({ where: { userId: user.id, templateId: id } }),
    ]);
    hasAccess = Boolean(activeSub ?? purchase);
  }

  return ok({ ...template, hasAccess });
}
