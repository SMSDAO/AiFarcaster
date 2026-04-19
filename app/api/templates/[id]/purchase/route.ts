// app/api/templates/[id]/purchase/route.ts
// POST /api/templates/:id/purchase
// Creates a TemplatePurchase record after a verified payment.
// For Stripe payments the webhook at /api/stripe/webhook is the primary
// fulfillment path; this endpoint handles crypto payment verification.
import 'server-only';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import { PurchaseTemplateSchema } from '@/lib/validation';
import {
  ok,
  unauthorized,
  notFound,
  paymentRequired,
  zodError,
  error,
  rateLimited,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`templates:purchase:${user.id}`, 'payment');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  const { id: templateId } = await params;
  const template = await prisma.template.findUnique({ where: { id: templateId, active: true } });
  if (!template) return notFound('Template');

  // Free templates don't need purchase
  if (template.tier === 'FREE') {
    return ok({ message: 'Free template — no purchase needed', templateId });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  let input;
  try {
    input = PurchaseTemplateSchema.parse({ ...body as object, templateId });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid request body');
  }

  // Check if already purchased
  const existing = await prisma.templatePurchase.findUnique({
    where: { userId_templateId: { userId: user.id, templateId } },
  });
  if (existing) {
    return ok({ message: 'Already purchased', purchase: existing });
  }

  // Check qualifying subscription (subscription holders, including trials, get all premium templates)
  const activeSub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ['ACTIVE', 'TRIALING'] } },
  });
  if (activeSub) {
    // Record the "purchase" as subscription-fulfillment for audit trail
    const purchase = await prisma.templatePurchase.create({
      data: {
        userId: user.id,
        templateId,
        paymentRef: `subscription:${activeSub.id}`,
        amountUsd: 0,
        idempotencyKey: input.idempotencyKey,
      },
    });
    logger.info('template.purchase.subscription', { userId: user.id, templateId });
    return ok(purchase);
  }

  // For crypto payments — record if payment reference provided
  if (input.paymentMethod === 'crypto') {
    // Crypto payment must be pre-verified; reject until feature is fully enabled
    return paymentRequired(
      'Crypto payment verification is not yet enabled. Please use Stripe checkout.',
    );
  }

  // For Stripe: direct to checkout session creation
  return paymentRequired(
    'Payment required. Please initiate a Stripe checkout session at /api/stripe/checkout.',
  );
}
