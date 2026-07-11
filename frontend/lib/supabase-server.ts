import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service role key.
 * NEVER import this in client components — it bypasses RLS.
 * Only use inside app/api routes and server actions.
 *
 * Results are cast to our own types at each call site.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
