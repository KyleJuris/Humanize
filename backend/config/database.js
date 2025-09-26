const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_KEY');
  if (!supabaseAnonKey) missing.push('SUPABASE_ANON_KEY');
  
  console.error('❌ Missing Supabase environment variables:', missing.join(', '));
  console.error('📋 Please set the following environment variables in your deployment:');
  missing.forEach(envVar => console.error(`   - ${envVar}`));
  
  throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`);
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
