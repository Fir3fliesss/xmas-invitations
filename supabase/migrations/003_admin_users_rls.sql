-- Add RLS policies for admin_users table

-- 1. Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow admin select" ON admin_users;

-- 3. Create policy for admin authentication
-- Allow reading admin_users for authentication purposes
CREATE POLICY "Enable admin authentication" 
ON admin_users FOR SELECT 
TO anon, authenticated 
USING (true);
