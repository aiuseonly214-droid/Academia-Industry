/*
# Create profiles table with role-based access

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null)
  - `full_name` (text, not null)
  - `role` (text, not null, check constraint: 'student' | 'company' | 'college')
  - `organization` (text, nullable — company or college name)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `profiles`.
- Each authenticated user can read and update only their own profile row.
- INSERT is allowed for authenticated users so they can create their own profile on signup.
- The `role` column is user-selectable at signup time (student/company/college).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'company', 'college')),
  organization text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);
