-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  challenge_id uuid REFERENCES challenges(id) ON DELETE SET NULL,
  day integer,
  entry_date date,
  content text NOT NULL,
  mood smallint,
  rating smallint,
  tags text[],
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
