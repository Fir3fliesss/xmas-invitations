-- Fix RLS policies to ensure public/anon access for the invitation app

-- 1. Ensure RLS is enabled
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts/duplicates
DROP POLICY IF EXISTS "Allow public select" ON attendees;
DROP POLICY IF EXISTS "Allow public insert" ON attendees;
DROP POLICY IF EXISTS "Allow public update" ON attendees;

-- 3. Re-create policies with broader permissions for the anon role
-- Allow reading all attendees (needed for duplicate checks and admin)
CREATE POLICY "Enable read access for all users" 
ON attendees FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow inserting new RSVPs
CREATE POLICY "Enable insert for all users" 
ON attendees FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow updating records (needed for changing status to not-attending/attending)
CREATE POLICY "Enable update for all users" 
ON attendees FOR UPDATE 
TO anon, authenticated 
USING (true);
