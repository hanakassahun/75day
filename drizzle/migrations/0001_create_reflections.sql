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

-- reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  challenge_id uuid,
  day integer,
  entry_date date,
  content text NOT NULL,
  mood smallint,
  rating smallint,
  photo_url text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reflections_user_id_idx ON reflections(user_id);
CREATE INDEX IF NOT EXISTS reflections_challenge_id_idx ON reflections(challenge_id);
CREATE INDEX IF NOT EXISTS reflections_day_idx ON reflections(day);

-- trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_reflections_set_updated_at
BEFORE UPDATE ON reflections
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
