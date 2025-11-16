-- Create admin_users table and seed initial admin credentials
-- This migration uses the pgcrypto extension to securely hash the password.
-- Run this SQL in your Supabase project's SQL Editor.

-- enable extension if not already present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- enable row level security (we'll restrict access via policies in production)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- restrict read/update to authenticated users (recommended)
DROP POLICY IF EXISTS "Authenticated can read admin_users" ON admin_users;
CREATE POLICY "Authenticated can read admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update admin_users" ON admin_users;
CREATE POLICY "Authenticated can update admin_users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed the admin credentials (hashed using bcrypt via crypt())
-- Replace the email/password below if you want different credentials.
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'Yukti@2007.com',
  crypt('Utii14242$$', gen_salt('bf')), -- bcrypt hash
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;

-- NOTE: After running this migration, do NOT expose the service_role key or
-- make this table publicly readable. Instead, wire Supabase Auth so admins
-- authenticate and receive tokens which allow SELECT on this table under RLS.
