import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client for admin pages.
 * Uses the anon key — relies on Supabase Auth session for RLS.
 * The user must be authenticated for protected queries to work.
 *
 * Results are cast to our own types (types/admin.ts) at each call site,
 * so we intentionally omit the Database generic here.
 */
export function createAdminClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "awlo-admin-auth",
      },
    }
  );
}

/** Singleton instance for use in client components. */
let _adminClient: ReturnType<typeof createAdminClient> | null = null;

export function getAdminClient() {
  if (!_adminClient) {
    _adminClient = createAdminClient();
  }
  return _adminClient;
}
