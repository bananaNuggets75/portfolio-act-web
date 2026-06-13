// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Fall back to harmless placeholders when env vars are missing (e.g. the Supabase
// project is paused/expired, or you're just running locally without a DB).
// createClient() requires a valid-looking URL or it throws at import time and
// crashes the whole page. With these placeholders the app boots fine and the
// comments section degrades gracefully via the try/catch in app/page.tsx.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseKey);
