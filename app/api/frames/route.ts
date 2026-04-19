// app/api/frames/route.ts
// GET  /api/frames   – List authenticated user's frames (paginated).
// POST /api/frames   – Create a new frame.
import 'server-only';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import { CreateFrameSchema } from '@/lib/validation';
import { ok, created, unauthorized, zodError, error, rateLimited } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { searchParams } = req.nextUrl;
  const parsedPage = parseInt(searchParams.get('page') ?? '1', 10);
  const parsedLimit = parseInt(searchParams.get('limit') ?? '20', 10);
  const page = Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage);
  const limit = Math.min(100, Math.max(1, Number.isNaN(parsedLimit) ? 20 : parsedLimit));
  const statusFilter = searchParams.get('status');

  const where = {
    userId: user.id,
    ...(statusFilter ? { status: statusFilter as 'DRAFT' | 'ACTIVE' | 'ARCHIVED' } : {}),
  };

  const [frames, total] = await Promise.all([
    prisma.frame.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.frame.count({ where }),
  ]);

  return ok({ frames, total, page, limit });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`frames:create:${user.id}`, 'write');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  let input;
  try {
    input = CreateFrameSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid request body');
  }

  // If a templateId is provided, verify access (premium check handled in template route)
  if (input.templateId) {
    const template = await prisma.template.findUnique({
      where: { id: input.templateId },
    });
    if (!template) return error('NOT_FOUND', 'Template not found');
    if (template.tier === 'PREMIUM') {
      const hasAccess = await checkPremiumAccess(user.id, input.templateId);
      if (!hasAccess) {
        return error('PAYMENT_REQUIRED', 'A subscription or template purchase is required to use this premium template');
      }
    }
  }

  const frame = await prisma.frame.create({
    data: {
      userId: user.id,
      title: input.title,
      description: input.description,
      templateId: input.templateId,
      config: (input.config ?? {}) as object,
    },
  });

  logger.info('frame.created', { frameId: frame.id, userId: user.id });

  return created(frame);
}

async function checkPremiumAccess(userId: string, templateId: string): Promise<boolean> {
  const [activeSub, purchase] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId, status: { in: ['ACTIVE', 'TRIALING'] } },
    }),
    prisma.templatePurchase.findFirst({
      where: { userId, templateId },
    }),
  ]);
  return Boolean(activeSub ?? purchase);
}
