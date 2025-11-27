import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase';

const supabaseUrl = PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase admin environment variables are missing.');
}

// Server client with service role (for admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
