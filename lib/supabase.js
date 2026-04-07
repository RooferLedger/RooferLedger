// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// We securely pull these keys out of the hidden .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialize the database connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
