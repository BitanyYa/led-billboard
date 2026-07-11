import { createClient } from "@supabase/supabase-js";
import type { SettingsMap } from "@/types/admin";

/**
 * Server-side (or client-side) settings fetch.
 * Uses the anon key — settings table has public-read RLS policy.
 * Returns a flat key → value map with typed fallback defaults.
 */
export async function fetchSettings(): Promise<SettingsMap> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("settings")
    .select("key, value") as { data: { key: string; value: string }[] | null; error: { message: string } | null };

  if (error || !data) {
    console.warn("[settings] Failed to fetch settings, using defaults:", error?.message);
    return DEFAULT_SETTINGS;
  }

  // Merge DB values over defaults so missing keys always have a fallback
  const map: SettingsMap = { ...DEFAULT_SETTINGS };
  data.forEach((row) => { map[row.key] = row.value; });
  return map;
}

/**
 * Convenience helper — get a single setting value with a fallback.
 */
export function getSetting(settings: SettingsMap, key: string, fallback = ""): string {
  return settings[key] ?? fallback;
}

// ─────────────────────────────────────────────────────────────────
//  Default values — used when DB fetch fails or key is missing.
//  Mirrors exactly what migration 007 seeds.
// ─────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: SettingsMap = {
  // Company
  company_name:        "AWLO Advertising",
  company_tagline:     "Ethiopia's premier LED billboard advertising company",
  company_description: "We help businesses reach thousands of potential customers every day with stunning digital displays at Awlo Business Center.",

  // Contact
  phone:    "+251 959 15 55 55",
  whatsapp: "+251959155555",
  telegram: "+251959155555",
  email:    "awloadvertising@gmail.com",
  address:  "Awlo Business Center, Bole, Addis Ababa",
  maps_url: "https://www.google.com/maps/place/Awlo+Business+center/@9.02497,38.74689,17z",
  maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.4522739821397!2d38.74689!3d9.02497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa2de1724cdb233da!2sAwlo%20Business%20center!5e0!3m2!1sen!2set!4v1720000000000",
  website:  "https://www.awloadvertising.com",

  // Hours
  hours_weekday:  "Mon - Fri: 8:00 AM - 6:00 PM",
  hours_saturday: "Sat: 9:00 AM - 4:00 PM",
  hours_sunday:   "Closed",

  // Social
  facebook:  "#",
  twitter:   "#",
  instagram: "#",
  linkedin:  "#",

  // Hero
  hero_headline:     "Make Your Brand Impossible to Ignore",
  hero_subheadline:  "Reach thousands of potential customers every day through premium LED billboard advertising. Your message, bigger and brighter than ever.",
  hero_badge_text:   "Premium Digital Billboard Advertising",
  hero_stat1_value:  "40x",
  hero_stat1_label:  "Daily Displays",
  hero_stat2_value:  "10×7m",
  hero_stat2_label:  "Screen Size",
  hero_stat3_value:  "24/7",
  hero_stat3_label:  "Visibility",

  // About
  about_heading: "Ethiopia's Premier LED Billboard Operator",
  about_body:    "AWLO Advertising is an Ethiopian company specializing exclusively in digital LED billboard advertising. We own and operate a large, state-of-the-art LED billboard that brings businesses to life with vivid, dynamic displays that no passerby can ignore.",
  about_mission: "To empower Ethiopian businesses with premium outdoor advertising that delivers measurable impact and brand visibility.",
  about_vision:  "To become Ethiopia's most trusted and innovative outdoor digital advertising partner, helping brands achieve impossible visibility.",

  // Billboard specs
  billboard_screen_size:  "10m × 7m",
  billboard_resolution:   "3600 × 720",
  billboard_ad_duration:  "20 Seconds",
  billboard_daily_plays:  "40 Times",
  billboard_brightness:   "5000+ Nits",
  billboard_target:       "All Sizes",

  // Packages
  pkg_1week_price:      "ETB 47,036",
  pkg_1week_tagline:    "Try it out",
  pkg_1month_price:     "ETB 108,460",
  pkg_1month_tagline:   "Most popular for starters",
  pkg_3months_price:    "ETB 291,500",
  pkg_3months_tagline:  "Build your brand presence",
  pkg_6months_price:    "ETB 379,500",
  pkg_6months_tagline:  "Serious brand exposure",
  pkg_1year_price:      "ETB 726,000",
  pkg_1year_tagline:    "Dominate your market",
  pkg_vat_note:         "excl. 15% VAT",
  pkg_ad_duration:      "20-second advertisement",
  pkg_plays_per_day:    "40 plays per day",
};
