# Environment Variables

This document describes all environment variables used in AiFarcaster.

## Required Variables

### NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

**Required for:** Wallet connections via RainbowKit

Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/):

1. Sign up at WalletConnect Cloud
2. Create a new project
3. Copy the Project ID
4. Add to `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Optional Variables

### Stripe Integration

**Required for:** Accepting fiat payments via credit card

Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Note:** Use test keys for development (`pk_test_...` and `sk_test_...`). Use live keys for production (`pk_live_...` and `sk_live_...`).

### Crypto Payments

**Required for:** Accepting crypto payments on Base

```env
NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS=0x...
```

Set this to your wallet address where you want to receive payments.

## Environment Files

### .env.local (Development)

Create `.env.local` in the root directory for local development:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS=0x...
```

**Never commit this file to Git!** It's already in `.gitignore`.

### Vercel Environment Variables

For Vercel deployment, you have two options:

#### Option 1: Vercel Dashboard (Recommended)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable with appropriate values:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)
   - `STRIPE_SECRET_KEY` (optional)
   - `NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS` (optional)
4. Set the scope (Production, Preview, Development)

#### Option 2: vercel.json Configuration

The `vercel.json` file references environment variables using `@` syntax (e.g., `@walletconnect-project-id`). This syntax indicates **Vercel Secrets** that must be pre-configured:

```bash
# Add secrets via Vercel CLI
vercel secrets add walletconnect-project-id "your_project_id"
vercel secrets add stripe-publishable-key "pk_live_..."
vercel secrets add stripe-secret-key "sk_live_..."
vercel secrets add payment-receiver-address "0x..."
```

**Important:** Secrets are separate from regular environment variables and provide enhanced security for sensitive values.

## Security Best Practices

1. **Never commit** `.env` or `.env.local` files
2. **Use test keys** in development
3. **Rotate keys** regularly
4. **Limit permissions** on API keys
5. **Use environment-specific** values (test vs production)

## Verification

To verify your environment variables are set correctly:

1. Start the development server: `npm run dev`
2. Check the browser console for any errors
3. Try connecting a wallet (should work if WalletConnect ID is set)
4. Try accessing payment features (should work if payment keys are set)

## Troubleshooting

### Wallet connection fails

- Check that `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Verify the project ID is correct in WalletConnect Cloud
- Ensure the variable name has the `NEXT_PUBLIC_` prefix

### Stripe integration not working

- Verify both public and secret keys are set
- Check that you're using the correct key format (test vs live)
- Ensure secret key doesn't have the `NEXT_PUBLIC_` prefix (it's server-only)

### Build fails on Vercel

- Check that all required environment variables are set in Vercel
- Verify variable names match exactly
- Ensure values don't have extra spaces or quotes
