const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('🔧 Supabase Configuration:');
console.log('   URL:', supabaseUrl);
console.log('   Service Key:', supabaseServiceKey ? 'Set' : 'Missing');
console.log('   Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

// Create client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create client with anon key for token validation
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase, supabaseAnon };
