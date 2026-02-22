-- Creates the initial admin user in Supabase Auth
-- Run this in your Supabase SQL Editor after setting up the project
-- 
-- Default credentials:
--   Email: admin@admin.com
--   Password: admin123
--
-- The user will be forced to change password on first login.

-- Note: Supabase Auth user creation should be done via the Auth API or Dashboard.
-- This script creates the admin_users table for role tracking.

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update own data" ON admin_users
  FOR UPDATE USING (auth.uid() = id);
