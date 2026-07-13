import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * POST /api/revalidate-gallery
 * Called by the admin gallery page after any create / update / delete / toggle.
 * Busts the Next.js full-route cache for the homepage so the public gallery
 * reflects the latest DB state on the very next request.
 *
 * No auth token needed — this is an internal server-to-server call that only
 * touches the route cache, it doesn't expose any data.
 */
export async function POST() {
  revalidatePath("/");          // homepage — where the public Gallery section lives
  revalidatePath("/", "layout"); // bust the shared layout cache too
  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
