-- =============================================
-- CHRISTMAS INVITATION DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: attendees
-- Stores RSVP data from users
-- =============================================

CREATE TABLE IF NOT EXISTS attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  school_other TEXT,
  class TEXT NOT NULL,
  class_other TEXT,
  is_attending BOOLEAN NOT NULL DEFAULT true,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one RSVP per name + school combination
  CONSTRAINT unique_name_school UNIQUE(name, school)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_attendees_school ON attendees(school);
CREATE INDEX IF NOT EXISTS idx_attendees_is_attending ON attendees(is_attending);
CREATE INDEX IF NOT EXISTS idx_attendees_created_at ON attendees(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for RSVP submission)
CREATE POLICY "Allow public insert" ON attendees
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Policy: Anyone can update their own record
CREATE POLICY "Allow public update" ON attendees
  FOR UPDATE 
  TO anon
  USING (true);

-- Policy: Anyone can read (for duplicate checking and admin)
CREATE POLICY "Allow public select" ON attendees
  FOR SELECT 
  TO anon
  USING (true);

-- Policy: Service role can do everything (for admin)
CREATE POLICY "Allow service role all" ON attendees
  FOR ALL 
  TO service_role
  USING (true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_attendees_updated_at
  BEFORE UPDATE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- OPTIONAL: Admin users table
-- For more secure admin authentication
-- =============================================

-- CREATE TABLE IF NOT EXISTS admin_users (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   username TEXT UNIQUE NOT NULL,
--   password_hash TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Only service role" ON admin_users
--   FOR ALL 
--   TO service_role
--   USING (true);
