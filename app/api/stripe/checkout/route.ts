// app/api/stripe/checkout/route.ts
// POST /api/stripe/checkout
// Creates a Stripe Checkout Session.
// SECURITY: The client sends a productId (never a priceId).
// The server maps productId → priceId using a trusted server-side mapping.
// This prevents clients from manipulating prices.
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import Stripe from 'stripe';
import { getUserFromRequest } from '@/lib/auth';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import { StripeCheckoutSchema } from '@/lib/validation';
import {
  unauthorized,
  zodError,
  error,
  rateLimited,
  internalError,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { getAppUrl, isStripeConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Server-side product → Stripe price mapping.
// NEVER expose priceIds to the client.
// Update these values with your real Stripe price IDs from the dashboard.
// ---------------------------------------------------------------------------
const PRODUCT_PRICE_MAP: Record<string, { priceId: string; name: string; mode: Stripe.Checkout.SessionCreateParams['mode'] }> = {
  // Subscriptions
  'subscription-pro-monthly': {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    name: 'Pro Plan – Monthly',
    mode: 'subscription',
  },
  'subscription-pro-yearly': {
    priceId: process.env.STRIPE_PRICE_PRO_YEARLY ?? '',
    name: 'Pro Plan – Yearly',
    mode: 'subscription',
  },
  // Per-template purchases (IDs should match Template.id in your database)
  // These are looked up dynamically – see dynamic lookup below
};

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
  });
}

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return error('SERVICE_UNAVAILABLE', 'Stripe is not configured on this server');
  }

  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`stripe:checkout:${user.id}`, 'payment');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  let input;
  try {
    input = StripeCheckoutSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid request body');
  }

  const stripe = getStripeClient()!;
  const appUrl = getAppUrl();

  // Look up the product in the static map first
  let priceId: string | undefined;
  let mode: Stripe.Checkout.SessionCreateParams['mode'] = 'payment';

  const staticProduct = PRODUCT_PRICE_MAP[input.productId];
  if (staticProduct) {
    if (!staticProduct.priceId) {
      logger.warn('stripe.checkout.missing_price_id', { productId: input.productId });
      return error('SERVICE_UNAVAILABLE', 'Product price is not configured');
    }
    priceId = staticProduct.priceId;
    mode = staticProduct.mode;
  } else {
    // Treat productId as a template UUID — look up in DB
    try {
      const { prisma } = await import('@/lib/db');
      const template = await prisma.template.findFirst({
        where: { id: input.productId, active: true },
      });
      if (!template) {
        return error('NOT_FOUND', 'Product not found');
      }
      if (template.tier === 'FREE') {
        return error('BAD_REQUEST', 'Free templates do not require payment');
      }
      // Use the server-configured Stripe price for paid templates.
      // Template records do not store a per-template Stripe price ID.
      priceId = process.env.STRIPE_PRICE_PREMIUM_TEMPLATE ?? undefined;

      if (!priceId) {
        logger.warn('stripe.checkout.missing_template_price', { templateId: input.productId });
        return error('SERVICE_UNAVAILABLE', 'Template payment price is not configured');
      }
      mode = 'payment';
    } catch (e) {
      logger.error('stripe.checkout.db_error', { error: String(e) });
      return internalError('Failed to look up product');
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/templates?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/templates?canceled=1`,
      metadata: {
        userId: user.id,
        productId: input.productId,
      },
      ...(mode === 'subscription'
        ? { subscription_data: { metadata: { userId: user.id } } }
        : {}),
    });

    logger.info('stripe.checkout.created', {
      sessionId: session.id,
      userId: user.id,
      productId: input.productId,
      mode,
    });

    return NextResponse.json({ id: session.id, url: session.url }, { status: 201 });
  } catch (e) {
    logger.error('stripe.checkout.error', {
      userId: user.id,
      productId: input.productId,
      error: e instanceof Error ? e.message : String(e),
    });
    return internalError('Failed to create checkout session');
  }
}
