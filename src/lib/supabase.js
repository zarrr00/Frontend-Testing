import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://PROJECT_ID.supabase.co"
const supabaseAnonKey = "ANON_KEY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)