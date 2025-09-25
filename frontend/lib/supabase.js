import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  console.error('   Please create frontend/.env.local with these variables')
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with proper session handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // Persist session in localStorage
    autoRefreshToken: true,      // Automatically refresh tokens
    detectSessionInUrl: true,    // Detect session from URL (magic links)
    flowType: 'pkce'            // Use PKCE flow for better security
  }
})

export default supabase
