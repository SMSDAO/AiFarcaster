// app/api/stripe/webhook/route.ts
// POST /api/stripe/webhook
// Handles incoming Stripe webhook events.
// - Verifies the Stripe-Signature header before processing any event.
// - All events are stored as PaymentEvent records for idempotency.
// - Fulfillment is idempotent: re-processing a processed event is a no-op.
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { getStripeWebhookSecret, isStripeConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

// Stripe requires the raw request body for signature verification.
// Next.js App Router: disable body parsing so we can read raw bytes.
export const config = { api: { bodyParser: false } };

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
  });
}

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  // Webhook rate limit (high volume from Stripe is normal)
  const ip = req.headers.get('x-forwarded-for') ?? 'stripe';
  const rl = await checkProfileRateLimit(`stripe:webhook:${ip}`, 'webhook');
  if (!rl.success) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }

  const stripe = getStripeClient()!;
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    logger.warn('stripe.webhook.missing_signature');
    return NextResponse.json({ error: 'Missing Stripe-Signature header' }, { status: 400 });
  }

  let webhookSecret: string;
  try {
    webhookSecret = getStripeWebhookSecret();
  } catch {
    logger.error('stripe.webhook.missing_secret');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    logger.warn('stripe.webhook.invalid_signature', {
      error: e instanceof Error ? e.message : String(e),
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency: check if already processed
  const existing = await prisma.paymentEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing?.processed) {
    logger.info('stripe.webhook.already_processed', { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true });
  }

  // Store the event for idempotency and audit trail
  const paymentEvent = await prisma.paymentEvent.upsert({
    where: { stripeEventId: event.id },
    create: {
      stripeEventId: event.id,
      eventType: event.type,
      payload: event as unknown as object,
    },
    update: {},
  });

  try {
    await handleStripeEvent(event);
    await prisma.paymentEvent.update({
      where: { id: paymentEvent.id },
      data: { processed: true, processedAt: new Date() },
    });
    logger.info('stripe.webhook.processed', { eventId: event.id, type: event.type });
  } catch (e) {
    logger.error('stripe.webhook.processing_failed', {
      eventId: event.id,
      type: event.type,
      error: e instanceof Error ? e.message : String(e),
    });
    // Return 200 to prevent Stripe retries for non-transient errors
    return NextResponse.json({ received: true, processed: false });
  }

  return NextResponse.json({ received: true });
}

async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
    default:
      logger.debug('stripe.webhook.unhandled_event', { type: event.type });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  const productId = session.metadata?.productId;

  if (!userId || !productId) {
    logger.warn('stripe.webhook.checkout.missing_metadata', { sessionId: session.id });
    return;
  }

  if (session.mode === 'payment') {
    // One-time template purchase
    const template = await prisma.template.findUnique({ where: { id: productId } });
    if (!template) {
      logger.warn('stripe.webhook.checkout.template_not_found', { productId });
      return;
    }

    await prisma.templatePurchase.upsert({
      where: { userId_templateId: { userId, templateId: productId } },
      create: {
        userId,
        templateId: productId,
        paymentRef: session.payment_intent as string,
        amountUsd: (session.amount_total ?? 0) / 100,
        idempotencyKey: session.id,
      },
      update: {},
    });

    logger.info('stripe.webhook.template_purchased', { userId, templateId: productId });
  }
  // Subscription creation is handled via customer.subscription.created
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    logger.warn('stripe.webhook.subscription.missing_user_id', { subId: subscription.id });
    return;
  }

  const status = mapStripeStatus(subscription.status);
  const periodStart = new Date((subscription.current_period_start as number) * 1000);
  const periodEnd = new Date((subscription.current_period_end as number) * 1000);

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      plan: 'PRO',
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
    update: {
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  });

  logger.info('stripe.webhook.subscription.updated', {
    userId,
    subId: subscription.id,
    status,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  logger.info('stripe.webhook.subscription.canceled', { subId: subscription.id });
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const subId = (invoice as Stripe.Invoice & { subscription?: string }).subscription;
  if (subId) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subId },
      data: { status: 'PAST_DUE' },
    });
  }
  logger.warn('stripe.webhook.payment_failed', { invoiceId: invoice.id });
}

function mapStripeStatus(
  stripeStatus: Stripe.Subscription['status'],
): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'trialing':
      return 'TRIALING';
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE';
    default:
      return 'CANCELED';
  }
}
