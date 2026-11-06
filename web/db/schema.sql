-- Glance release list schema (Neon Postgres).
-- Apply once in the Neon SQL editor or with: psql "$DATABASE_URL" -f db/schema.sql
-- Emails are lowercased by the app before insert. Parameterized queries only.

CREATE TABLE IF NOT EXISTS release_list (
  id                bigserial PRIMARY KEY,
  email             text NOT NULL UNIQUE,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  confirm_token     text NOT NULL UNIQUE,
  unsubscribe_token text NOT NULL UNIQUE,
  source            text NOT NULL DEFAULT 'site',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  confirmed_at      timestamptz,
  unsubscribed_at   timestamptz
);

CREATE INDEX IF NOT EXISTS release_list_status_idx ON release_list (status);
