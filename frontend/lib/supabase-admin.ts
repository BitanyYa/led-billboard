import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for admin pages.
 * Uses @supabase/ssr so it automatically reads auth session from cookies
 * (which are set by the login page).
 *
 * Results are cast to our own types (types/admin.ts) at each call site,
 * so we intentionally omit the Database generic here.
 */
export function createAdminClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
