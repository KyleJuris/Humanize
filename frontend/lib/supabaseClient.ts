import { createClient } from '@supabase/supabase-js'
import { useRef, useEffect } from 'react'

// Use environment variables directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memoized singleton pattern to ensure only one Supabase client instance
let supabaseInstance: any = null

const getSupabase = () => {
  if (!supabaseInstance) {
    // Create client with minimal configuration - no custom headers or fetch
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true
      }
      // No global.headers or custom fetch to avoid overriding apikey/Authorization
    })
  }
  return supabaseInstance
}

// Hook to log Supabase configuration once
export const useSupabaseLogging = () => {
  const hasLogged = useRef(false)
  
  useEffect(() => {
    if (!hasLogged.current) {
      console.log('🔧 Supabase Configuration:')
      console.log('   URL:', supabaseUrl)
      console.log('   URL Length:', supabaseUrl?.length)
      console.log('   Key Length:', supabaseAnonKey?.length)
      console.log('   Key starts with:', supabaseAnonKey?.substring(0, 20) + '...')
      console.log('   Key ends with:', '...' + supabaseAnonKey?.substring(supabaseAnonKey.length - 20))
      console.log('   From env:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Yes' : 'No')

      // Decode and verify the anon key payload
      try {
        const keyParts = supabaseAnonKey.split('.')
        if (keyParts.length === 3) {
          const payload = JSON.parse(atob(keyParts[1]))
          console.log('   Payload ref:', payload.ref)
          console.log('   URL subdomain:', supabaseUrl.split('.')[0].split('//')[1])
          console.log('   Ref matches URL:', payload.ref === supabaseUrl.split('.')[0].split('//')[1])
        }
      } catch (error) {
        console.error('   Error decoding anon key:', error)
      }
      
      hasLogged.current = true
    }
  }, [])
}

// Export the memoized singleton function
export { getSupabase }

// Export the singleton instance for backward compatibility
export const supabase = getSupabase()

export default getSupabase
