import { createClient } from '@supabase/supabase-js';

// Clean the URL if it accidentally includes /rest/v1/
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Ensure they are configured in Vercel. Falling back to local data where possible.');
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co', 
  supabaseAnonKey || 'test-anon-key'
);
