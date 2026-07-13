import { createClient } from "@supabase/supabase-js";
import type { GalleryItem } from "@/types/admin";

/**
 * Fetch all visible gallery items for the public website.
 * Uses the anon key — gallery_items has a public-read RLS policy for visible rows.
 * Returns an empty array on any failure so the page renders gracefully.
 */
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("[gallery] Missing Supabase env vars — skipping fetch.");
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient<any>(url, key);

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    // Swallow gracefully — table may not exist yet if migration hasn't been run
    console.warn("[gallery] Failed to fetch gallery items:", error.message);
    return [];
  }

  return (data ?? []) as GalleryItem[];
}
