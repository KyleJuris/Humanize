import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxibkxddlgxufvqceqtn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWJreGRkbGd4dWZ2cWNlcXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzgzNjMsImV4cCI6MjA3MzgxNDM2M30.placeholder'

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
