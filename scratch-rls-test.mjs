import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRLS() {
  console.log("Testing RLS on 'clients' table with anonymous user...")
  const { data, error } = await supabase.from('clients').select('*').limit(5)
  
  if (error) {
    console.error("Error fetching clients:", error)
    process.exit(1)
  }
  
  if (data && data.length === 0) {
    console.log("SUCCESS: RLS is active. Anonymous query returned 0 rows.")
  } else {
    console.error("WARNING: RLS might be misconfigured! Anonymous query returned data:", data)
    process.exit(1)
  }
}

testRLS()
