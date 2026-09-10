-- The profiles table was created with id REFERENCES auth.users(id),
-- but this app uses custom OTP auth (not Supabase Auth).
-- Remove the FK constraint and add gen_random_uuid() default so
-- new profiles can be inserted without a pre-existing auth.users row.

-- First drop the FK constraint (name may vary, find it dynamically)
DO $$
DECLARE
  fk_name text;
BEGIN
  SELECT con.conname INTO fk_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'profiles'
    AND con.contype = 'f';
  IF fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', fk_name);
  END IF;
END $$;

-- Add default for id
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
