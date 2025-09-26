import { createClient } from '@supabase/supabase-js'

// Use environment variables directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Console log to check env var lengths and confirm no hidden spaces
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

// Memoized singleton pattern to ensure only one Supabase client instance
let supabaseInstance: any = null

const getSupabase = () => {
  if (!supabaseInstance) {
    console.log('🔧 Creating new Supabase client instance')
    console.log('🔧 Client URL:', supabaseUrl)
    console.log('🔧 Client Key Length:', supabaseAnonKey.length)
    
    // Create client with minimal configuration - no custom headers or fetch
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true
      }
      // No global.headers or custom fetch to avoid overriding apikey/Authorization
    })
    
    console.log('🔧 Supabase client created successfully')
    console.log('🔧 Client instance:', supabaseInstance)
  } else {
    console.log('🔧 Reusing existing Supabase client instance')
  }
  return supabaseInstance
}

// Export the memoized singleton function
export { getSupabase }

// Export the singleton instance for backward compatibility
export const supabase = getSupabase()

export default getSupabase
