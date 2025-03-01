
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xwjgchqoqfmjnwhfqqdb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3amdjaHFvcWZtam53aGZxcWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTY3MjcsImV4cCI6MjA1NjM5MjcyN30.oRuiiVTYhTHZDlA9Cc6gLQR43HjPWLwnjZra6LNLluo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('Supabase client initialized with URL:', supabaseUrl);
