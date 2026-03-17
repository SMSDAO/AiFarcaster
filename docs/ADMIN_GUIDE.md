# Admin Guide

Complete guide for administrators managing the AiFarcaster enterprise platform.

## Table of Contents

1. [Admin Dashboard](#admin-dashboard)
2. [User Management](#user-management)
3. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac--planned)
4. [System Health Monitoring](#system-health-monitoring)
5. [API Key Management](#api-key-management)
6. [Billing & Payments](#billing--payments)
7. [Audit Logs](#audit-logs)
8. [Agent Management](#agent-management)
9. [Oracle Management](#oracle-management)
10. [Security Settings](#security-settings)
11. [Configuration](#configuration)

---

## Admin Dashboard

The Admin Dashboard provides a full enterprise-grade system overview with real-time metrics, user management, and system health monitoring.

### Dashboard Screenshot

![Admin Dashboard](../public/screenshots/admin-dashboard.svg)
*Enterprise admin dashboard — system overview, user management, and health monitoring*

### Key Metrics

The admin overview displays four key performance indicators:

| Metric | Description |
|--------|-------------|
| **Total Users** | Total registered users with month-over-month change |
| **Active Agents** | Number of currently running AI agents |
| **Revenue (MTD)** | Month-to-date revenue with comparison |
| **API Calls (24h)** | Total API calls in the past 24 hours |

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Sign in with your admin credentials (Supabase email/password)
3. The dashboard loads at `/admin`

> **Security Note:** Admin routes (`/admin/*`) are protected by Supabase session authentication in `middleware.ts`. Any authenticated Supabase user can currently access the admin panel — no additional role check is enforced in the middleware. For production deployments, restrict access to specific user IDs or add a role claim to Supabase JWTs and validate it in the middleware.

---

## User Management

The **Users** section (`/admin/users`) allows searching and viewing platform users.

> **Note:** The current implementation displays a mock/placeholder dataset. Edit, ban, restore, and delete actions are planned for a future release once the Supabase `users` table and server actions are wired up.

### Viewing Users

- Search users by email or wallet address
- See each user's plan, credits, and status (active / banned)

### Planned User Actions

The following actions are planned and not yet implemented:

| Action | Description |
|--------|-------------|
| **Edit** | Modify user role, permissions, or profile |
| **Ban/Suspend** | Temporarily or permanently restrict access |
| **Restore** | Reinstate a suspended user |
| **Delete** | Permanently remove a user (irreversible) |

### Adding a New User (Planned)

> This feature is not yet implemented. Currently, new users must be created directly in Supabase Authentication.

---

## Role-Based Access Control (RBAC) — Planned

> **Note:** Role-based access control is planned but not yet implemented in the codebase. The middleware currently enforces only Supabase session authentication (any authenticated user), not role-level authorization. The role model below describes the intended future design.

The planned RBAC model uses four roles with escalating permissions:

| Role | Access Level | Description |
|------|-------------|-------------|
| **Admin** | Full access | Complete system control, user management, billing |
| **Developer** | Extended | API access, environment management, deployment tools |
| **User** | Standard | Dashboard, frames, projects, templates |
| **Auditor** | Read-only | View logs, metrics, and reports; no write access |

### Planned Permission Matrix

| Feature | Admin | Developer | User | Auditor |
|---------|-------|-----------|------|---------|
| Manage users | ✅ | ❌ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ | ✅ |
| API key management | ✅ | ✅ | ❌ | ❌ |
| Create frames | ✅ | ✅ | ✅ | ❌ |
| View dashboards | ✅ | ✅ | ✅ | ✅ |
| Billing management | ✅ | ❌ | ❌ | ❌ |
| System configuration | ✅ | ❌ | ❌ | ❌ |

---

## System Health Monitoring

The **System Health** panel (visible on the admin overview) shows real-time status of all platform services.

### Service Status Indicators

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green | Operational | Service running normally |
| 🟡 Yellow | Degraded | Service running with reduced capacity |
| 🔴 Red | Down | Service unavailable |

### Monitored Services

- **API** — Next.js API routes and Farcaster hub connection
- **Database** — Supabase PostgreSQL connection
- **Auth** — Supabase authentication service
- **Storage** — Supabase file storage

### Health Check Endpoint

```
GET /api/health
```

Returns a JSON response with API status and current timestamp:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-03-15T07:00:00.000Z",
  "services": {
    "api": "operational"
  }
}
```

The health endpoint is implemented at `app/api/health/route.ts`. For deeper service health checks (database, auth, storage), monitor your Supabase project directly at [app.supabase.com](https://app.supabase.com).

---

## API Key Management

The **API Keys** section (`/admin/api-keys`) manages keys for external integrations.

### Creating an API Key

1. Navigate to **Admin → API Keys**
2. Click **Generate New Key**
3. Enter a descriptive name and set permissions scope
4. Copy the key immediately — it will not be shown again
5. Store securely in your application's environment variables

### Key Permissions

- `read` — Read-only access to data endpoints
- `write` — Create and update operations
- `admin` — Full API access including user management

### Revoking Keys

1. Find the key in the list
2. Click **Revoke**
3. Confirm the action — this cannot be undone

---

## Billing & Payments

The **Billing** section (`/admin/billing`) manages subscriptions and payment records.

### Supported Payment Methods

- **Crypto (Base mainnet)** — ETH, USDC, and platform tokens
- **Stripe** — Credit/debit card processing

### Viewing Payment History

- Filter by date range, user, or payment method
- Export reports as CSV

### Subscription Tiers

| Tier | Monthly Price | Frames | Templates | API Calls |
|------|--------------|--------|-----------|-----------|
| Free | $0 | 3 | 20 (basic) | 1,000 |
| Pro | $29 | Unlimited | 100+ | 50,000 |
| Enterprise | Custom | Unlimited | All | Unlimited |

---

## Audit Logs

The **Audit Logs** section (`/admin/logs`) provides a complete, tamper-evident record of all platform actions.

### Log Categories

| Category | Events |
|----------|--------|
| **Auth** | Login, logout, password changes, failed attempts |
| **Users** | Creation, modification, deletion, role changes |
| **Payments** | Transactions, refunds, subscription changes |
| **API** | Key creation/revocation, rate limit events |
| **System** | Config changes, deployments, health events |

### Searching Logs

- Full-text search on event description
- Filter by user, category, date range
- Export filtered results to CSV or JSON

---

## Agent Management

The **Agents** section (`/admin/agents`) controls AI agent instances.

### Agent Operations

- **Start/Stop** individual agents
- **View** agent logs and output
- **Configure** agent parameters (model, temperature, max tokens)
- **Monitor** token usage and costs

---

## Oracle Management

The **Oracles** section (`/admin/oracles`) manages data feed connections for on-chain integrations.

### Supported Oracle Networks

- Chainlink (price feeds)
- Custom HTTP oracles
- Webhook-based data sources

---

## Security Settings

### Password Policy

The change-password flow (`/admin/settings/change-password`) enforces:
- **Minimum length: 8 characters** (validated client-side before submission)
- Supabase enforces its own server-side password requirements based on your project settings

To strengthen password requirements, configure the minimum password length and complexity rules in your [Supabase project authentication settings](https://app.supabase.com/project/_/auth/providers).

### Session Management

- Supabase manages session lifetime via JWT expiry (default: 1 hour access token, 1 week refresh token)
- The `must_change_password` user metadata flag forces a password change on next login
- To force a logout, invalidate sessions via the Supabase dashboard or the Admin API

---

## Configuration

The **Settings** section (`/admin/settings`) provides system-wide configuration.

### Environment Variables

Critical variables required for admin features:

```env
# Authentication (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Farcaster
FARCASTER_HUB_URL=nemes.farcaster.xyz:2283
```

See [ENVIRONMENT.md](./ENVIRONMENT.md) for the complete list.

### Changing Admin Password

1. Navigate to **Admin → Settings → Change Password**
2. Enter your current password
3. Enter and confirm your new password
4. Click **Update Password**

---

## Troubleshooting

### Cannot Access Admin Panel

1. Verify you are signed in with a valid Supabase session (any authenticated user can currently access `/admin/*` — role-based restriction is not yet enforced)
2. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Check the browser console for authentication errors

### Users Not Loading

> **Note:** The Users page currently displays mock/placeholder data and does not query Supabase. If you wire up a live Supabase query in the future, the steps below will apply.

1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set (will be required once live Supabase user queries are implemented)
2. Check that the `users` table exists in your Supabase project
3. Run pending migrations if the schema is missing

### System Health Shows Degraded

1. Check Supabase project status at [status.supabase.com](https://status.supabase.com)
2. Verify your Supabase project quota has not been exceeded
3. Check the deployment logs for recent errors

---

*For general platform usage, see the [User Guide](./USER_GUIDE.md). For API integration, see [API.md](./API.md).*
