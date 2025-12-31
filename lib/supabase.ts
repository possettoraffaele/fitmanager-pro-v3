import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Export funzione factory per API routes
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Export istanza singleton per client components
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
