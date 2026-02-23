-- Creates the initial admin user metadata in Supabase
-- Run this in your Supabase SQL Editor after setting up the project
--
-- IMPORTANT:
--   Do NOT use hard-coded default credentials for your admin user.
--   Instead, create an admin user via the Supabase Auth Dashboard or Auth API
--   with a strong, unique password, and then insert that user's id/email into
--   this admin_users table as needed.
--
-- Note: Supabase Auth user creation should be done via the Auth API or Dashboard.
-- This script creates the admin_users table for role tracking (including a
-- must_change_password flag you can enforce in your application logic).

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to keep updated_at in sync on row updates
CREATE OR REPLACE FUNCTION set_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_admin_users_updated_at_trigger
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION set_admin_users_updated_at();
-- RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update own data" ON admin_users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'admin');
