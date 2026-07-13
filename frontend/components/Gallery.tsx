import { unstable_noStore as noStore } from "next/cache";
import { fetchGalleryItems } from "@/lib/gallery";
import GalleryClient from "@/components/GalleryClient";

/**
 * Server component — fetches visible gallery items on every request.
 * noStore() opts this component out of Next.js full-route caching so
 * the public gallery always reflects the latest data from Supabase.
 * Falls back to static placeholders when the DB is empty or unreachable.
 */
export default async function Gallery() {
  noStore(); // never serve a stale cached version

  let items = [];
  try {
    items = await fetchGalleryItems();
  } catch {
    items = [];
  }

  return <GalleryClient items={items} />;
}
