import { createClient } from '@supabase/supabase-js';

// Clean the URL if it accidentally includes /rest/v1/
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.PROD) {
    throw new Error('Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing in production.');
  }
  console.warn('Supabase environment variables are not set. Ensure .env.local is configured properly.');
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co', 
  supabaseAnonKey || 'test-anon-key'
);
