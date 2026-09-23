-- ============================================================
-- Supabase SQL — NFC Standee SaaS
-- Run this in your Supabase project: SQL Editor > New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS cards (
  -- Primary key: UMKM-001-A7X9 format
  id_kartu      TEXT PRIMARY KEY,

  -- Business display name
  business_name TEXT,

  -- Google Maps Place ID
  place_id      TEXT,

  -- Final redirect URL (Google Review link)
  redirect_url  TEXT,

  -- bcrypt-hashed PIN for owner authentication
  password_hash TEXT,

  -- Activation status (false = awaiting setup by UMKM owner)
  is_active     BOOLEAN NOT NULL DEFAULT FALSE,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update the updated_at timestamp on every row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index on is_active to speed up the redirect query
-- (most scans hit active cards in production)
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON cards (is_active);

-- Row Level Security: disable public access — all access goes through
-- the Prisma client using the DATABASE_URL (service role key).
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- VERIFICATION: After running, you should see the "cards" table
-- in Supabase Table Editor with all columns above.
-- ============================================================
