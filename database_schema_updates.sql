-- DANGER: Recreate profiles table from scratch for new OTP flow

DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
-- Do not enforce unique(email) here; auth.users already guarantees uniqueness.
-- Keeping it unique can cause auth user creation to fail via the trigger.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_email_unique'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_email_unique;
  END IF;
END $$;
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- Create projects table to persist user projects
DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE public.projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_text TEXT NOT NULL DEFAULT '',
  output_text TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'en',
  tone TEXT NOT NULL DEFAULT 'neutral',
  intensity INT NOT NULL DEFAULT 50,
  flags JSONB NOT NULL DEFAULT '{"avoidBurstiness": false, "avoidPerplexity": false}',
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO authenticated;

-- Ensure profile is created when a new auth user is inserted
-- Drop any existing trigger/function to avoid conflicts with previous schema versions
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'auth' AND c.relname = 'users' AND t.tgname = 'on_auth_user_created'
  ) THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  END IF;
EXCEPTION WHEN others THEN
  -- ignore if auth schema is not available in local dev
  NULL;
END $$;

DROP FUNCTION IF EXISTS public.handle_auth_user_created() CASCADE;

-- This trigger runs as the function owner and bypasses RLS
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Upsert a matching profile row. Use id = user_id = auth.users.id
  INSERT INTO public.profiles (id, user_id, email, full_name)
  VALUES (NEW.id, NEW.id, NEW.email, COALESCE((NEW.raw_user_meta_data ->> 'full_name')::text, ''))
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Do not create the trigger to avoid OTP sign-up failures caused by profile inserts
-- Instead, profiles are created during signup completion in the API.
-- Ensure any old trigger is dropped.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'auth' AND c.relname = 'users' AND t.tgname = 'on_auth_user_created'
  ) THEN
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;
