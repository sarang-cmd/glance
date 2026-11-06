-- Run once against a dedicated Neon database. No product data belongs here.
CREATE TABLE IF NOT EXISTS release_subscribers (
 id uuid PRIMARY KEY,
 email text NOT NULL UNIQUE CHECK (length(email)<=254),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','subscribed')),
 confirmation_hash text NOT NULL UNIQUE,
 confirmation_expires timestamptz NOT NULL,
 unsubscribe_hash text NOT NULL UNIQUE,
 consent_version text NOT NULL,
 requested_at timestamptz NOT NULL DEFAULT now(),
 confirmed_at timestamptz,
 welcome_sent_at timestamptz
);
CREATE TABLE IF NOT EXISTS release_rate_limits (
 key text NOT NULL,
 window_start timestamptz NOT NULL,
 hits integer NOT NULL DEFAULT 1,
 PRIMARY KEY (key,window_start)
);
