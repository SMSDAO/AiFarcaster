/**
 * TypeScript types for Supabase database tables.
 * These mirror the schema defined in scripts/seed-admin.sql.
 */

export interface DbUser {
  id: string;
  email: string | null;
  username: string | null;
  wallet_address: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface DbFrame {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'active' | 'archived';
  views: number;
  interactions: number;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed';
  frame_ids: string[];
  member_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface DbAgent {
  id: string;
  name: string;
  type: string;
  model: string;
  status: 'active' | 'paused' | 'error';
  requests_today: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface DbBilling {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  amount_cents: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface DbWallet {
  id: string;
  user_id: string;
  address: string;
  chain: string;
  balance: string | null;
  status: 'connected' | 'disconnected';
  last_active: string | null;
  created_at: string;
}

export interface DbOracle {
  id: string;
  name: string;
  endpoint: string;
  chain: string;
  status: 'active' | 'degraded' | 'offline';
  latency_ms: number | null;
  last_checked: string | null;
  created_at: string;
}

export interface DbAddon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  version: string;
  status: 'enabled' | 'disabled';
  installed_count: number;
  created_at: string;
}

export interface DbLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context: Record<string, unknown> | null;
  user_id: string | null;
  created_at: string;
}

export interface DbSetting {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

/** Convenience union of all table row types */
export type DbRow =
  | DbUser
  | DbFrame
  | DbProject
  | DbAgent
  | DbApiKey
  | DbBilling
  | DbWallet
  | DbOracle
  | DbAddon
  | DbLog
  | DbSetting;
