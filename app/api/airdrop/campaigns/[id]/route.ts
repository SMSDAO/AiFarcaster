// app/api/airdrop/campaigns/[id]/route.ts
// GET    /api/airdrop/campaigns/:id  – Get campaign + recipients.
// PATCH  /api/airdrop/campaigns/:id  – Update campaign metadata/status.
// DELETE /api/airdrop/campaigns/:id  – Delete a DRAFT campaign.
// POST   /api/airdrop/campaigns/:id  – Bulk upload recipients (JSON body with `recipients` array).
import 'server-only';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import {
  UpdateAirdropCampaignSchema,
  AirdropRecipientsUploadSchema,
} from '@/lib/validation';
import {
  ok,
  created,
  unauthorized,
  notFound,
  forbidden,
  zodError,
  error,
  rateLimited,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const campaign = await prisma.airdropCampaign.findUnique({
    where: { id },
    include: {
      recipients: { orderBy: { createdAt: 'asc' } },
      _count: { select: { recipients: true } },
    },
  });

  if (!campaign) return notFound('Airdrop campaign');
  if (campaign.userId !== user.id) return forbidden();

  return ok(campaign);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`airdrop:update:${user.id}`, 'write');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  const { id } = await params;
  const campaign = await prisma.airdropCampaign.findUnique({ where: { id } });
  if (!campaign) return notFound('Airdrop campaign');
  if (campaign.userId !== user.id) return forbidden();

  // Prevent modifying completed campaigns
  if (campaign.status === 'COMPLETED') {
    return error('CONFLICT', 'Completed campaigns cannot be modified');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  // Handle recipients upload as a sub-action
  const rawBody = body as Record<string, unknown>;
  if (rawBody.recipients !== undefined) {
    return uploadRecipients(user.id, id, rawBody.recipients);
  }

  let input;
  try {
    input = UpdateAirdropCampaignSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid request body');
  }

  const updated = await prisma.airdropCampaign.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.scheduledAt !== undefined ? { scheduledAt: new Date(input.scheduledAt) } : {}),
      ...(input.merkleRoot !== undefined ? { merkleRoot: input.merkleRoot } : {}),
    },
  });

  logger.info('airdrop.campaign.updated', { campaignId: id, userId: user.id });

  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const campaign = await prisma.airdropCampaign.findUnique({ where: { id } });
  if (!campaign) return notFound('Airdrop campaign');
  if (campaign.userId !== user.id) return forbidden();

  if (campaign.status !== 'DRAFT') {
    return error('CONFLICT', 'Only DRAFT campaigns can be deleted');
  }

  await prisma.airdropCampaign.delete({ where: { id } });

  logger.info('airdrop.campaign.deleted', { campaignId: id, userId: user.id });

  return ok({ deleted: true });
}

// ---------------------------------------------------------------------------
// POST /api/airdrop/campaigns/:id/recipients
// Handled inside PATCH for simplicity — see rawBody.recipients check above.
// Also exposed as POST for explicit sub-resource semantics.
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`airdrop:recipients:${user.id}`, 'write');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  const { id } = await params;
  const campaign = await prisma.airdropCampaign.findUnique({ where: { id } });
  if (!campaign) return notFound('Airdrop campaign');
  if (campaign.userId !== user.id) return forbidden();

  if (!['DRAFT', 'PENDING'].includes(campaign.status)) {
    return error('CONFLICT', 'Recipients can only be uploaded to DRAFT or PENDING campaigns');
  }

  let body: unknown;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  return uploadRecipients(user.id, id, (body as Record<string, unknown>).recipients);
}

async function uploadRecipients(
  userId: string,
  campaignId: string,
  recipientsRaw: unknown,
): Promise<Response> {
  let input;
  try {
    input = AirdropRecipientsUploadSchema.parse({ recipients: recipientsRaw });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid recipients data');
  }

  const RECIPIENT_UPSERT_BATCH_SIZE = 250;
  let uploaded = 0;

  // Upsert recipients in smaller batches to avoid one oversized transaction
  // that could time out or overload the DB with thousands of individual statements.
  for (let i = 0; i < input.recipients.length; i += RECIPIENT_UPSERT_BATCH_SIZE) {
    const batch = input.recipients.slice(i, i + RECIPIENT_UPSERT_BATCH_SIZE);
    const upserts = batch.map((r) =>
      prisma.airdropRecipient.upsert({
        where: { campaignId_address: { campaignId, address: r.address } },
        create: { campaignId, address: r.address, amount: r.amount },
        update: { amount: r.amount },
      }),
    );
    const results = await prisma.$transaction(upserts);
    uploaded += results.length;
  }

  logger.info('airdrop.recipients.uploaded', {
    campaignId,
    userId,
    count: uploaded,
  });

  return created({ uploaded });
}
