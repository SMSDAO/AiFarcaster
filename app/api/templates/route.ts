// app/api/templates/route.ts
// GET /api/templates – List templates (optionally filtered by category, tier).
import 'server-only';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const tierParam = searchParams.get('tier');
  const freeOnly = searchParams.get('free') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '100', 10)));

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

  return ok({ templates, total, page, limit });
}
