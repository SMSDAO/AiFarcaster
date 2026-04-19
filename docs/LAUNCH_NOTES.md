# AiFarcaster v1.0.0 Launch Notes

**Release date:** 2026-04-19  
**Tag:** `v1.0.0`

---

## What's New

AiFarcaster v1.0.0 is the first production-ready release of the platform.
This release completes the core feature set, hardens the backend for real traffic,
and enforces paid access controls throughout.

### Highlights

- **Real API layer** — All core routes (frames, templates, subscriptions, airdrop campaigns)
  are now fully implemented with authentication, validation, and rate limiting.
- **Stripe payments enforced** — Premium templates and subscriptions are gated server-side.
  The checkout flow uses a server-controlled `productId → priceId` mapping to prevent
  price manipulation. Webhook fulfillment is idempotent.
- **Subscription system** — Pro and Enterprise plans tracked in the database via Stripe webhooks.
  Subscription holders automatically unlock all premium templates.
- **Airdrop Manager** — Full campaign CRUD with bulk recipient upload (up to 10,000 recipients,
  idempotent upsert, Ethereum address validation).
- **Frame Builder persistence** — Frames are stored per-user in PostgreSQL.
  Premium template access is enforced server-side when creating frames.
- **Security hardening:**
  - Farcaster cast endpoint no longer accepts raw private keys in request bodies.
    Use `FARCASTER_SIGNER_PRIVATE_KEY` server environment variable instead.
  - Crypto payment utilities fully implemented via viem, disabled behind
    `FEATURE_CRYPTO_PAYMENTS=true` flag pending security review.
  - Token Launcher disabled (marked "Coming Soon") pending audit.
- **Observability** — `/api/health` returns live readiness for database, Redis, Stripe, and
  OpenAI. `/api/monitoring` reports platform metrics (requires `MONITORING_SECRET`).
- **Structured logging** — All API events emit JSON-line logs in production for aggregation.

---

## Deployment Checklist

### 1. Environment Variables (Vercel)

Set all the following in your Vercel project → Settings → Environment Variables:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | ✅ | `sk_live_...` for production |
| `STRIPE_WEBHOOK_SECRET` | ✅ | From Stripe dashboard → Webhooks |
| `STRIPE_PRICE_PRO_MONTHLY` | ✅ | Stripe price ID for monthly Pro plan |
| `STRIPE_PRICE_PRO_YEARLY` | ✅ | Stripe price ID for yearly Pro plan |
| `STRIPE_PRICE_PREMIUM_TEMPLATE` | ✅ | Stripe price ID for per-template purchases |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | `pk_live_...` for production |
| `OPENAI_API_KEY` | ✅ | For AI prompt optimizer |
| `UPSTASH_REDIS_REST_URL` | ✅ | For rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | For rate limiting |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | For admin auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | For admin auth |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-side admin operations |
| `FARCASTER_SIGNER_PRIVATE_KEY` | ✅ | 32-byte hex Ed25519 private key |
| `MONITORING_SECRET` | Recommended | Protects `/api/monitoring` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ | WalletConnect project ID |
| `FEATURE_TOKEN_LAUNCHER` | Optional | Set to `true` to re-enable |
| `FEATURE_CRYPTO_PAYMENTS` | Optional | Set to `true` after security review |

### 2. Stripe Configuration

1. Create webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
2. Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`
3. Create products and prices in Stripe → copy price IDs to env vars

### 3. Database

Run the Prisma migration on first deploy:
```bash
npx prisma migrate deploy
```
This is also included in `npm run vercel-build` automatically.

### 4. Smoke Tests (Post-Deploy)

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Expected: { "status": "ok", ... }

# Monitoring (with MONITORING_SECRET set)
curl -H "Authorization: Bearer <MONITORING_SECRET>" \
     https://your-domain.vercel.app/api/monitoring
```

### 5. Verify Payment Gating

1. Log in as a free user
2. Navigate to `/dashboard/templates`
3. Confirm premium templates show a padlock and "Purchase" button
4. Click "Purchase" → should redirect to Stripe Checkout
5. Log in as a Pro subscriber → all templates should show "Use Template"

---

## Known Limitations

| Feature | Status | Notes |
|---|---|---|
| Token Launcher | Disabled | Pending security audit; set `FEATURE_TOKEN_LAUNCHER=true` to re-enable |
| Crypto Payments | Disabled | viem implementation complete; set `FEATURE_CRYPTO_PAYMENTS=true` after review |
| Admin panel live data | Partial | Most admin pages still use mock data; live Supabase queries planned for v1.1 |
| Farcaster cast multi-signer | Planned | Currently one server-held key; per-user signers in v1.1 |

---

## Architecture Overview

```
Browser / Mobile
    │
    ├── /dashboard/*      Next.js App Router (RSC + Client Components)
    ├── /admin/*          Supabase-authenticated admin UI
    └── /api/*            Next.js Route Handlers (server-only)
              │
              ├── lib/auth.ts         Session token + Supabase bridge
              ├── lib/rbac.ts         Role enforcement (USER / DEVELOPER / ADMIN)
              ├── lib/rate-limit.ts   Upstash Redis sliding window
              ├── lib/validation.ts   Zod input validation
              ├── lib/logger.ts       Structured JSON logging
              ├── lib/db.ts           Prisma singleton (PostgreSQL)
              ├── lib/stripe.ts       Stripe checkout client-side helper
              └── lib/env.ts          Env validation + feature flags
```

---

*Built with Next.js 15, React 19, Prisma 7, Stripe, Supabase, Upstash Redis, and viem.*
