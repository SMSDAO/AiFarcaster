// app/api/airdrop/campaigns/route.ts
// GET  /api/airdrop/campaigns   – List campaigns for the authenticated user.
// POST /api/airdrop/campaigns   – Create a new airdrop campaign.
import 'server-only';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import { CreateAirdropCampaignSchema } from '@/lib/validation';
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

  const ALLOWED_STATUSES = ['DRAFT', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'] as const;
  if (statusFilter !== null && !ALLOWED_STATUSES.includes(statusFilter as typeof ALLOWED_STATUSES[number])) {
    return error('BAD_REQUEST', `Invalid status value. Must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  const where = {
    userId: user.id,
    ...(statusFilter ? { status: statusFilter as typeof ALLOWED_STATUSES[number] } : {}),
  };

  const [campaigns, total] = await Promise.all([
    prisma.airdropCampaign.findMany({
      where,
      include: { _count: { select: { recipients: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.airdropCampaign.count({ where }),
  ]);

  return ok({ campaigns, total, page, limit });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`airdrop:create:${user.id}`, 'write');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  // Check if request contains recipients for bulk upload
  const rawBody = body as Record<string, unknown>;

  if (rawBody.recipients !== undefined) {
    // Bulk-upload recipients to an existing campaign — reject on campaign creation
    return error(
      'BAD_REQUEST',
      'POST /api/airdrop/campaigns does not accept a recipients field. Create the campaign without recipients, then POST to /api/airdrop/campaigns/:id with a recipients field.',
    );
  }

  let input;
  try {
    input = CreateAirdropCampaignSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid request body');
  }

  const campaign = await prisma.airdropCampaign.create({
    data: {
      userId: user.id,
      name: input.name,
      description: input.description,
      tokenAddress: input.tokenAddress,
      tokenSymbol: input.tokenSymbol,
      totalAmount: input.totalAmount,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    },
  });

  logger.info('airdrop.campaign.created', { campaignId: campaign.id, userId: user.id });

  return created(campaign);
}
