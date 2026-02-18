# Payment Integration Guide

This guide covers integrating both crypto and fiat payments into AiFarcaster.

## Overview

AiFarcaster supports two payment methods:
1. **Crypto Payments** - Accept ETH and tokens on Base mainnet
2. **Stripe Payments** - Accept credit cards and traditional payments

## Crypto Payments (Base Mainnet)

### Setup

1. **Set receiver address** in `.env.local`:

```env
NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS=0xYourWalletAddress
```

2. **Supported tokens** (configured in `lib/crypto-payments.ts`):
   - ETH (native Base token)
   - USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
   - Add more tokens as needed

### Integration

```typescript
import { preparePayment, verifyPayment, PAYMENT_TOKENS } from '@/lib/crypto-payments';
import { parseEther } from 'viem';

// Prepare a payment
const paymentRequest = {
  tokenAddress: PAYMENT_TOKENS.ETH.address,
  // Amount must be in base units (wei). Use parseEther for ETH values.
  amount: parseEther('0.01').toString(), // 0.01 ETH in wei
  recipient: process.env.NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS!,
  metadata: {
    orderId: 'order_123',
    productId: 'template_456',
  },
};

const transaction = await preparePayment(paymentRequest);

// User signs and sends transaction
// ...

// Verify payment after transaction
const isVerified = await verifyPayment(txHash);
```

### Payment Flow

1. User selects product/service
2. Chooses payment token (ETH, USDC, etc.)
3. Wallet prompts for approval
4. Transaction is sent to Base network
5. Payment is verified
6. User receives confirmation
7. Product/service is delivered

### Testing

Use Base Sepolia testnet for testing:

```typescript
import { baseSepolia } from 'wagmi/chains';

// In providers.tsx, add baseSepolia for testing
chains: [base, baseSepolia]
```

Get testnet ETH from Base Sepolia faucets.

## Stripe Integration

### Setup

1. **Create Stripe account** at [stripe.com](https://stripe.com)

2. **Get API keys** from [Dashboard > API Keys](https://dashboard.stripe.com/apikeys)

3. **Add to environment variables**:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Create Products

1. Go to Stripe Dashboard > Products
2. Create products for your templates:
   - Name: "Premium Template"
   - Price: $9.99
   - Recurring: No (one-time)
3. Copy the Price ID

### Integration

```typescript
import { createCheckoutSession } from '@/lib/stripe';

// Create checkout session
async function handlePurchase() {
  try {
    await createCheckoutSession('price_1234567890');
  } catch (error) {
    console.error('Payment failed:', error);
  }
}
```

### API Routes

Create API route for checkout sessions:

```typescript
// app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
});

// SECURITY: Server-side price mapping to prevent client-side price manipulation
// Map product/template IDs to their actual Stripe price IDs
const PRICE_MAPPING: Record<string, string> = {
  'template-basic': 'price_xxxxx', // $9.99 template
  'template-pro': 'price_yyyyy',   // Premium template
  'subscription-monthly': 'price_zzzzz', // Monthly subscription
  // Add all your products here
};

export async function POST(req: Request) {
  // SECURITY: Accept product ID from client, not price ID
  const { productId } = await req.json();

  // SECURITY: Server derives the actual Stripe price ID from trusted mapping
  const priceId = PRICE_MAPPING[productId];
  
  if (!priceId) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use server-side mapped price, not client input
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/templates`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}
```

**Security Note:** This example shows the secure pattern where:
1. Client sends a `productId` (e.g., "template-basic")
2. Server looks up the actual `priceId` from a trusted server-side mapping
3. Client can never manipulate the price by changing the `priceId`

### Client-Side Usage

```typescript
// Secure: Send product ID, not price ID
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'template-basic', // Product identifier
  }),
});
```

### Webhooks

Set up webhooks to handle payment events:

1. **Configure webhook endpoint** in Stripe Dashboard
2. **Add webhook handler**:

```typescript
// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // Fulfill the order
      await fulfillOrder(session);
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  // Grant access to purchased template
  // Send confirmation email
  // Update database
}
```

## Hybrid Payments

Allow users to choose payment method:

```typescript
function PaymentOptions({ price, onComplete }) {
  return (
    <div className="space-y-4">
      <h3>Choose Payment Method</h3>
      
      {/* Crypto Payment */}
      <button onClick={() => handleCryptoPayment(price)}>
        Pay with Crypto ({price} ETH)
      </button>
      
      {/* Stripe Payment */}
      <button onClick={() => handleStripePayment(price)}>
        Pay with Card (${price})
      </button>
    </div>
  );
}
```

## Security Best Practices

### Environment Variables

- Never commit secrets to Git
- Use different keys for test/production
- Rotate keys regularly
- Limit key permissions

### Validation

- Validate amounts server-side
- Check payment status before fulfillment
- Verify webhook signatures
- Rate limit payment requests

### User Safety

- Show clear pricing
- Confirm before payment
- Display transaction status
- Provide receipts/confirmations
- Handle errors gracefully

## Testing

### Test Crypto Payments

1. Use Base Goerli testnet
2. Get test ETH from faucet
3. Test all payment flows
4. Verify transactions on explorer

### Test Stripe Payments

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

More test cards: [Stripe Testing](https://stripe.com/docs/testing)

## Monitoring

### Transaction Tracking

- Log all payment attempts
- Track success/failure rates
- Monitor for fraud
- Set up alerts

### Analytics

Track:
- Payment methods used
- Conversion rates
- Average transaction value
- Failed payment reasons

### Debugging

Check:
- Browser console for client errors
- Server logs for API errors
- Stripe dashboard for payment status
- Base explorer for transactions

## Common Issues

### Crypto Payment Fails

- Insufficient balance
- Network congestion
- Wrong network selected
- User rejected transaction
- Gas price too low

### Stripe Payment Fails

- Card declined
- Insufficient funds
- Invalid card details
- 3D Secure failed
- Region restrictions

## Going Live

### Checklist

- [ ] Test all payment flows
- [ ] Set production API keys
- [ ] Configure webhooks
- [ ] Set up monitoring
- [ ] Test with real payments (small amounts)
- [ ] Update error handling
- [ ] Add customer support contact
- [ ] Implement refund process
- [ ] Add terms of service
- [ ] Enable production mode

### Production Keys

1. Switch to production API keys
2. Update environment variables in Vercel
3. Test with small real payment
4. Monitor first transactions
5. Gradually increase limits

## Support

Need help with payments?
- [Stripe Documentation](https://stripe.com/docs)
- [Base Documentation](https://docs.base.org)
- [WalletConnect Docs](https://docs.walletconnect.com)
- Join our [Discord](https://discord.gg/aifarcaster)

## Examples

See example implementations in:
- `app/dashboard/templates/page.tsx` - Template purchases
- `app/dashboard/tools/page.tsx` - Tool payments
- `lib/stripe.ts` - Stripe utilities
- `lib/crypto-payments.ts` - Crypto payment utilities
