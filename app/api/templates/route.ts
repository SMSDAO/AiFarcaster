// app/api/templates/route.ts
// GET /api/templates – List templates (optionally filtered by category, tier).
// For authenticated users, each template includes a `hasAccess` field that
// reflects whether the user can use it (subscription, trial, or individual purchase).
import 'server-only';
import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ok, error } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const tierParam = searchParams.get('tier');
  const freeOnly = searchParams.get('free') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const parsedPage = parseInt(searchParams.get('page') ?? '1', 10);
  const parsedLimit = parseInt(searchParams.get('limit') ?? '100', 10);
  const page = Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage);
  const limit = Math.min(100, Math.max(1, Number.isNaN(parsedLimit) ? 100 : parsedLimit));

  // Validate tier query param against allowed enum values
  const VALID_TIERS = ['FREE', 'PREMIUM'] as const;
  if (tierParam !== null && !VALID_TIERS.includes(tierParam as typeof VALID_TIERS[number])) {
    return error('BAD_REQUEST', `Invalid tier value. Must be one of: ${VALID_TIERS.join(', ')}`);
  }

  const where = {
    active: true,
    ...(category ? { category } : {}),
    ...(tierParam ? { tier: tierParam as 'FREE' | 'PREMIUM' } : {}),
    ...(freeOnly ? { tier: 'FREE' as const } : {}),
    ...(featured ? { featured: true } : {}),
  };

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.template.count({ where }),
  ]);

  // If authenticated, enrich each template with per-user access info in a single
  // pair of queries (avoid N+1 queries over the template list).
  const user = await getUserFromRequest(req);
  if (user) {
    const premiumTemplateIds = templates
      .filter((t) => t.tier === 'PREMIUM')
      .map((t) => t.id);

    // One query for active/trialing subscription; one for purchased template IDs.
    const [activeSub, purchases] = await Promise.all([
      prisma.subscription.findFirst({
        where: { userId: user.id, status: { in: ['ACTIVE', 'TRIALING'] } },
      }),
      premiumTemplateIds.length > 0
        ? prisma.templatePurchase.findMany({
            where: { userId: user.id, templateId: { in: premiumTemplateIds } },
            select: { templateId: true },
          })
        : Promise.resolve([]),
    ]);

    const purchasedIds = new Set(purchases.map((p) => p.templateId));
    const hasSubscription = Boolean(activeSub);

    const enriched = templates.map((t) => ({
      ...t,
      hasAccess:
        t.tier === 'FREE' || hasSubscription || purchasedIds.has(t.id),
    }));

    return ok({ templates: enriched, total, page, limit });
  }

  // Unauthenticated: free templates are accessible, premium are not
  const enriched = templates.map((t) => ({ ...t, hasAccess: t.tier === 'FREE' }));
  return ok({ templates: enriched, total, page, limit });
}
