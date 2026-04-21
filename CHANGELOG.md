# Changelog

All notable changes to AiFarcaster will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-04-19

### Added

#### Data Layer
- New Prisma models: `Template`, `TemplatePurchase`, `Subscription`, `AirdropCampaign`, `AirdropRecipient`, `Frame`, `PaymentEvent`, `AuditLog`
- New enums: `TemplateTier`, `SubscriptionStatus`, `SubscriptionPlan`, `AirdropStatus`, `FrameStatus`
- Initial production migration: `prisma/migrations/0001_init_v1_0_0/migration.sql`

#### API Foundation
- `lib/api-errors.ts` — centralised error code type and `apiError()` helper
- `lib/api-response.ts` — `ok()`, `created()`, `error()`, `unauthorized()`, `forbidden()`, `notFound()`, `paymentRequired()`, `rateLimited()`, `internalError()` response helpers
- `lib/logger.ts` — structured JSON logger (JSON-lines in production, pretty-print in dev)
- `lib/env.ts` — server-only environment variable validation with feature flags (`FEATURE_TOKEN_LAUNCHER`, `FEATURE_CRYPTO_PAYMENTS`)
- Extended `lib/validation.ts` with Zod schemas for frames, templates, purchases, subscriptions, airdrop campaigns, and airdrop recipients
- Extended `lib/rate-limit.ts` with per-route profiles: `auth` (10/min), `write` (60/min), `payment` (20/min), `webhook` (200/min), `ai` (30/min)

#### API Routes (Real Implementations)
- `GET/POST /api/frames` — list and create user frames with authentication, rate limiting, and premium template gating
- `GET/PATCH/DELETE /api/frames/[id]` — get, update, delete individual frames
- `GET /api/templates` — list all active templates with filtering (category, tier, featured)
- `GET /api/templates/[id]` — get single template with user entitlement info
- `POST /api/templates/[id]/purchase` — fulfill template purchase; subscription-holders bypass payment
- `GET /api/subscriptions/status` — return authenticated user's subscription plan and status
- `GET/POST /api/airdrop/campaigns` — list and create airdrop campaigns
- `GET/PATCH/DELETE/POST /api/airdrop/campaigns/[id]` — full CRUD + recipient bulk upload (up to 10,000 recipients per campaign, idempotent upsert)

#### Payments
- `POST /api/stripe/checkout` — creates Stripe Checkout Session from a server-side `productId → priceId` mapping; client never controls the price
- `POST /api/stripe/webhook` — verifies Stripe-Signature header, stores events idempotently in `PaymentEvent`, fulfills subscriptions and one-time template purchases
- Updated `lib/stripe.ts` — `createCheckoutSession(productId)` sends `productId` (not `priceId`) to prevent client-side price manipulation

#### Premium Gating
- Templates page: fetches `/api/subscriptions/status` on load; locks premium templates behind a padlock icon for free-tier users
- Inline upgrade prompt in the templates page header for non-subscribers
- Frame creation API: enforces `hasActiveSubscription || hasTemplatePurchase` before allowing use of premium templates

#### Security Hardening
- `app/api/farcaster/cast/route.ts` — rewritten to use server-held signer key (`FARCASTER_SIGNER_PRIVATE_KEY` env var); raw private keys are no longer accepted in request bodies
- `lib/crypto-payments.ts` — fully implemented using viem (`encodeFunctionData`, `parseEther`, `parseUnits`, `createPublicClient`); gated behind `FEATURE_CRYPTO_PAYMENTS=true` feature flag

#### Observability
- `GET /api/health` — enhanced with live checks for database, Redis, Stripe, and OpenAI readiness; returns `ok`, `degraded`, or `down` with per-service latency
- `GET /api/monitoring` — platform metrics endpoint (user count, frames, subscriptions, purchases, 24 h prompt volume); protected by `MONITORING_SECRET` env var

#### Deployment
- `next.config.js` — optional standalone output via `NEXT_OUTPUT_STANDALONE=true` env var for self-hosted Docker deployments
- `vercel.json` — added `MONITORING_SECRET`, `FARCASTER_SIGNER_PRIVATE_KEY`, `FEATURE_TOKEN_LAUNCHER`, `FEATURE_CRYPTO_PAYMENTS`, Stripe price ID env refs

### Changed

- `app/dashboard/templates/page.tsx` — replaced static hardcoded templates with subscription-aware gating; premium templates show a padlock and Purchase CTA for non-subscribers; subscribers see "Use Template" for all
- `app/dashboard/tools/page.tsx` — Token Launcher marked as "Coming Soon" until security review completes; featured hero section updated to reflect disabled state

### Security

- Raw private keys are no longer accepted by any API endpoint
- Stripe checkout no longer exposes price IDs to the client
- Payment verification route enforces feature flag before processing crypto payments
- All new API routes use `server-only` imports to prevent accidental client bundling
- Rate limiting applied on auth, write, payment, and webhook routes

---

## [Unreleased — pre-1.0 scaffolding notes]

> The following items were present as scaffolding/mock data in v0.x and are
> either now implemented (above) or remain pending for a future release.

- Admin panel pages (`/admin/*`) still use mock data (users, agents, billing, API keys, logs, wallets, oracles); live Supabase queries are planned for v1.1
- Farcaster client page `/client` — compose and feed display are functional; persistent drafts not yet implemented

---

## [0.1.0] — 2025-01-01

### Added

- Initial repository scaffold with Next.js, TypeScript, Tailwind CSS
- Basic project structure and configuration files

---

[1.0.0]: https://github.com/SMSDAO/AiFarcaster/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/SMSDAO/AiFarcaster/releases/tag/v0.1.0
