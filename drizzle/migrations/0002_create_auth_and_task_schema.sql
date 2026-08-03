-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions(token);

-- task_statuses table
CREATE TABLE IF NOT EXISTS task_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reflection_id uuid NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  notes text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS task_statuses_reflection_id_idx ON task_statuses(reflection_id);

-- Update reflections table to align with schema.ts
ALTER TABLE reflections
  DROP CONSTRAINT IF EXISTS reflections_user_id_fkey,
  DROP CONSTRAINT IF EXISTS reflections_challenge_id_fkey;

ALTER TABLE reflections
  DROP COLUMN IF EXISTS tags;

ALTER TABLE reflections
  ADD COLUMN IF NOT EXISTS photo_url text;

ALTER TABLE reflections
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE reflections
  ADD CONSTRAINT IF NOT EXISTS reflections_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS reflections_user_id_idx ON reflections(user_id);
CREATE INDEX IF NOT EXISTS reflections_challenge_id_idx ON reflections(challenge_id);
CREATE INDEX IF NOT EXISTS reflections_day_idx ON reflections(day);
