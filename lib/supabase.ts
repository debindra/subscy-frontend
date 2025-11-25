import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(
  supabaseUrl || 'https://qwlrovakflxxnivoywlm.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Customize storage key names to use Subsy branding
      storageKey: 'subsy-auth-token',
      // Auto refresh token
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Flow type for OAuth
      flowType: 'pkce',
    },
  }
);

