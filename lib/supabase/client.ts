import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // If these aren't set, we'll need to add them to the project
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Your project's URL and Key are required to create a Supabase client! (client)")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
