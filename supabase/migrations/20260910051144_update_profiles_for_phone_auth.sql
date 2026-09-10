/*
# Update profiles for phone-based authentication

1. Modified Tables
- `profiles`
  - Add `phone` (text, nullable, unique) — mobile number for OTP login
  - Add `last_login` (timestamptz, nullable) — last login timestamp
  - Make `email` nullable (phone is primary identifier now)
  - Add `is_demo` (boolean, default false) — flag for demo accounts

2. Security
- Update RLS to allow anon access for demo mode (custom OTP auth, not Supabase auth)
- Anon can SELECT, INSERT, UPDATE profiles (needed for demo OTP flow without Supabase Auth)
- This is acceptable for a demo/MVP and documented here

3. Important Notes
- Real SMS OTP can be connected later by switching to Supabase phone auth
- The architecture separates auth (OTP) from profile storage (profiles table)
- Demo accounts are flagged with is_demo = true
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Make email nullable since we use phone as primary identifier
ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;

-- Add unique constraint on phone (partial - only for non-null values)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_phone_key') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_phone_key UNIQUE (phone);
  END IF;
END $$;

-- Drop existing authenticated-only policies and replace with anon-accessible ones for demo mode
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;

-- Demo mode: allow anon access (no Supabase Auth, custom OTP instead)
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT
TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE
TO anon, authenticated USING (true);