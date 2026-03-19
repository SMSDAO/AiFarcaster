# Changelog

All notable changes to AiFarcaster will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] — upcoming v1.0.0

> **Note:** The entries below are staged for the `v1.0.0` release. `package.json` will be bumped to `1.0.0` when the release tag is created.

### Added

#### Core Platform
- Initial production release of AiFarcaster — AI-powered Farcaster Frame Builder & Token Launcher
- Next.js 15 application with App Router, React 19, TypeScript 5, and Tailwind CSS
- Supabase integration for authentication and database (`@supabase/ssr`, `@supabase/supabase-js`)
- RainbowKit + wagmi wallet connection for Base mainnet and Base Sepolia

#### User Dashboard
- Stats overview cards: Total Frames, Active Projects, Engagement, Revenue
- Quick Actions panel: New Frame, New Project, Browse Templates, AI Assistant
- Recent Activity feed with event type badges
- Frames Timeline with status indicators (Active / Draft)
- Sidebar navigation: Overview, Frames, Projects, Templates, AI Prompts, Tools
- Mobile-responsive layout with hamburger menu

#### Admin Panel (`/admin`)
- System Overview dashboard with KPI cards: Total Users, Active Agents, Revenue (MTD), API Calls (24h) — **UI scaffolding with mock data**
- Recent Activity log with user attribution and timestamps — **mock data**
- System Health indicator panel: API, Database, Auth, Storage — **mock data; `/api/health` endpoint reports `services.api` only**
- User Management table with search, plan badges, and status indicators — **read-only mock data; Edit/Ban/Restore actions are planned**
- Agent Management page (`/admin/agents`) — **UI scaffolding with mock data**
- Billing & Payments dashboard (`/admin/billing`) — **UI scaffolding with mock data; no Stripe/crypto integration yet**
- Wallet management (`/admin/wallets`) — **UI scaffolding**
- Oracle management (`/admin/oracles`) — **UI scaffolding**
- API Key management (`/admin/api-keys`) — **UI scaffolding with mock data; no key generation/revocation yet**
- Audit Logs viewer (`/admin/logs`) — **UI scaffolding with mock data; no persistent log storage yet**
- Add-on marketplace (`/admin/addons`) — **UI scaffolding**
- Settings with change-password flow (`/admin/settings`, `/admin/settings/change-password`) — **change-password implemented via Supabase**
- Admin login page with Supabase authentication (`/admin/login`) — **implemented**

#### Farcaster Integration
- Hub client with SSL gRPC connection via `@farcaster/hub-nodejs`
- API routes: `/api/farcaster/auth`, `/api/farcaster/feed`, `/api/farcaster/user`, `/api/farcaster/cast`
- Singleton hub client with configurable `FARCASTER_HUB_URL`

#### Payment Processing
- Stripe integration for fiat payments (`stripe`, `@stripe/stripe-js`)
- Crypto payments on Base mainnet: ETH, USDC, platform tokens (`viem`, `wagmi`)
- Base Sepolia testnet support for development

#### Security & Middleware
- Route protection middleware enforcing authentication on `/admin/*` routes only (dashboard routes are not protected by middleware)
- Supabase session refresh in middleware
- Admin-only route guard redirecting unauthenticated users to `/admin/login`

#### Developer Experience
- Build system with Next.js 15 and webpack externals for gRPC compatibility
- ESLint configuration with `eslint-config-next`
- TypeScript strict mode
- CI/CD pipeline with Node.js 20.x, 22.x, 24.x matrix testing
- Dependency caching and parallel execution in GitHub Actions
- Security audit step (`npm audit`) in CI

#### Documentation
- `README.md` with feature overview, quick-start, architecture, and screenshots
- `docs/ADMIN_GUIDE.md` — Enterprise admin guide with admin dashboard screenshot
- `docs/USER_GUIDE.md` — User guide with user dashboard screenshot
- `docs/API.md` — API documentation
- `docs/DEPLOYMENT.md` — Vercel and manual deployment guide
- `docs/ENVIRONMENT.md` — Complete environment variable reference
- `docs/PAYMENTS.md` — Payment integration documentation
- `CHANGELOG.md` — This file

#### Assets
- `public/logos/aifarcaster-logo.svg` — Platform logo
- `public/screenshots/user-dashboard.svg` — User dashboard UI screenshot
- `public/screenshots/admin-dashboard.svg` — Admin dashboard UI screenshot

### Changed

- Upgraded from create-next-app scaffold to full enterprise platform
- Replaced placeholder dashboard with functional stat cards and activity feeds
- Extended webpack configuration with `@grpc/grpc-js`, `bufferutil`, `utf-8-validate` externals
- Updated `package.json` engines to require Node >=20.0.0 and npm >=10.0.0

### Fixed

- `next.config.js`: removed deprecated `swcMinify` option (removed in Next.js 15)
- Webpack resolve fallback for `fs`, `net`, `tls` to prevent browser bundle errors
- Build-time placeholder pattern for `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to allow CI builds without secrets

### Security

- Admin routes protected by Supabase session authentication
- Password hashing delegated to Supabase (bcrypt-based)
- NEXT_PUBLIC_ variables validated at client runtime with clear error messages
- No secrets committed to source control; all credentials via environment variables
- `.env.example` provided with placeholder values only
- `npm audit` integrated into CI pipeline

---

## [0.1.0] — 2025-01-01

### Added

- Initial repository scaffold with Next.js, TypeScript, Tailwind CSS
- Basic project structure and configuration files

---

[Unreleased]: https://github.com/SMSDAO/AiFarcaster/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/SMSDAO/AiFarcaster/releases/tag/v0.1.0
