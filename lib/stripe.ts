/**
 * Stripe Payment Integration – Client-Side Utilities
 *
 * Configuration:
 * Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
 * Set STRIPE_SECRET_KEY in .env.local (server-side only)
 *
 * SECURITY: The client sends a `productId`, never a Stripe `priceId`.
 * The server maps productId → priceId in /api/stripe/checkout to prevent
 * clients from manipulating prices.
 */

import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

/**
 * Initiates a Stripe Checkout session for the given product.
 *
 * @param productId  A product/template identifier (e.g. "subscription-pro-monthly"
 *                   or a template UUID). The server resolves this to a Stripe price.
 */
export async function createCheckoutSession(productId: string): Promise<void> {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error(
      'Stripe not loaded. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.',
    );
  }

  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Send productId — the server resolves this to the actual Stripe price.
    // Never send priceId directly from the client.
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    let errorMessage = `Failed to create checkout session: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json() as { error?: { message?: string }; message?: string };
      const apiMessage =
        (errorData && (errorData.error?.message ?? errorData.message)) ?? null;
      if (apiMessage) {
        errorMessage = apiMessage;
      }
    } catch {
      // Ignore JSON parsing errors and fall back to the default message.
    }
    throw new Error(errorMessage);
  }

  const session = await response.json() as { id: string; url?: string };

  // Prefer redirect URL when available (handles both payment and subscription modes)
  if (session.url) {
    window.location.href = session.url;
    return;
  }

  const result = await stripe.redirectToCheckout({ sessionId: session.id });
  if (result.error) {
    throw new Error(result.error.message);
  }
}

export { stripePromise };
