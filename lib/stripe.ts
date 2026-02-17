/**
 * Stripe Payment Integration
 * 
 * Configuration:
 * Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
 * Set STRIPE_SECRET_KEY in .env.local (server-side only)
 */

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export async function createCheckoutSession(priceId: string) {
  // TODO: Implement Stripe checkout session creation
  // This should call your API route that creates a Stripe checkout session
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  });

  const session = await response.json();
  
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not loaded');
  
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export { stripePromise };
