/**
 * Stripe Payment Integration
 * 
 * Configuration:
 * Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
 * Set STRIPE_SECRET_KEY in .env.local (server-side only)
 */

import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

export async function createCheckoutSession(priceId: string) {
  // NOTE: This function is scaffolding. You must implement the backend
  // `/api/stripe/checkout` (or equivalent) endpoint in your application.
  //
  // That endpoint should:
  //   - Use your STRIPE_SECRET_KEY server-side
  //   - Create a Stripe Checkout Session for the given `priceId`
  //   - Return a JSON object containing at least `{ id: string }`
  //
  // This library does not provide that API route implementation.
  
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error(
      'Stripe not loaded. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.'
    );
  }

  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    let errorMessage = `Failed to create checkout session: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      const apiMessage =
        (errorData && (errorData.error?.message || errorData.message)) || null;
      if (apiMessage) {
        errorMessage = apiMessage;
      }
    } catch {
      // Ignore JSON parsing errors and fall back to the default message.
    }
    throw new Error(errorMessage);
  }

  const session = await response.json();
  
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export { stripePromise };
