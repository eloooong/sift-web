-- ScamShield PH initial schema: accounts, sessions, scan history,
-- community reports, confirmation receipts, rate-limit buckets.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS scan_history (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_type      TEXT NOT NULL CHECK (scan_type IN ('message', 'screenshot', 'url')),
  status         TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  input_preview  TEXT NOT NULL,
  full_input     TEXT NOT NULL,
  risk_score     INTEGER,
  risk_level     TEXT,
  category_label TEXT,
  message_report JSONB,
  url_report     JSONB
);

CREATE INDEX IF NOT EXISTS idx_history_user_created
  ON scan_history(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS community_reports (
  id                TEXT PRIMARY KEY,
  category_id       TEXT NOT NULL,
  platform          TEXT NOT NULL,
  description       TEXT NOT NULL,
  description_fp    TEXT NOT NULL,
  short_description TEXT NOT NULL,
  sender            TEXT,
  screenshot        JSONB,
  encountered_at    DATE NOT NULL,
  risk_score        INTEGER NOT NULL,
  risk_level        TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  confirmations     INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at      TIMESTAMPTZ,
  rejection_reason  TEXT
);

CREATE INDEX IF NOT EXISTS idx_reports_status_created
  ON community_reports(status, created_at DESC);

-- Duplicate-description auto-moderation lookup.
CREATE INDEX IF NOT EXISTS idx_reports_description_fp
  ON community_reports(description_fp);

-- One confirmation per anonymous visitor token; only the hash is stored.
CREATE TABLE IF NOT EXISTS report_confirmations (
  report_id  TEXT NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  PRIMARY KEY (report_id, token_hash)
);

CREATE INDEX IF NOT EXISTS idx_confirmations_token ON report_confirmations(token_hash);

-- Fixed-window rate-limit buckets, shared across serverless instances.
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket       TEXT PRIMARY KEY,
  hit_count    INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);
