"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import type { SettingsMap, Package as DbPackage } from "@/types/admin";
import { getSetting } from "@/lib/settings";

interface Props {
  settings: SettingsMap;
  packages?: DbPackage[];
}

// ── Map a DB package name/duration to the quote-form slug ──────────────────
// The quote form uses fixed slugs: 1_week | 1_month | 3_months | 6_months | 1_year
function toQuoteSlug(duration: string): string {
  const d = duration.toLowerCase().trim();
  if (d.includes("year") || d === "12 months" || d === "12months") return "1_year";
  if (d.includes("6 month") || d === "6months")                     return "6_months";
  if (d.includes("3 month") || d === "3months")                     return "3_months";
  if (d.includes("1 month") || d === "1month" || d === "month")     return "1_month";
  return "1_week";
}

// ── Compute total plays from duration string + displays_per_day ───────────
function totalPlays(pkg: DbPackage): string {
  const d = pkg.duration.toLowerCase();
  const days =
    d.includes("year")    ? 365
    : d.includes("6")     ? 180
    : d.includes("3")     ? 90
    : d.includes("month") ? 30
    : 7;
  return (pkg.displays_per_day * days).toLocaleString();
}

// ── Format ETB price ───────────────────────────────────────────────────────
function fmtPrice(n: number): string {
  return "ETB " + n.toLocaleString("en-ET", { minimumFractionDigits: 0 });
}

// ── Static fallback (used when DB returns nothing) ─────────────────────────
function buildFallback(settings: SettingsMap): DbPackage[] {
  const adLen = parseInt(getSetting(settings, "pkg_ad_duration_secs", "20")) || 20;
  const plays = parseInt(getSetting(settings, "pkg_plays_per_day_num", "40")) || 40;
  const now   = new Date().toISOString();

  const rows: Array<Omit<DbPackage, "id" | "created_at" | "updated_at">> = [
    {
      name: "1 Week",
      duration: "1 Week",
      price: 47036,
      advertisement_length: adLen,
      displays_per_day: plays,
      bonus_minutes: 0,
      description: getSetting(settings, "pkg_1week_tagline", "Try it out"),
      featured: false,
      visible: true,
      sort_order: 1,
    },
    {
      name: "1 Month",
      duration: "1 Month",
      price: 108460,
      advertisement_length: adLen,
      displays_per_day: plays,
      bonus_minutes: 0,
      description: getSetting(settings, "pkg_1month_tagline", "Most popular for starters"),
      featured: false,
      visible: true,
      sort_order: 2,
    },
    {
      name: "3 Months",
      duration: "3 Months",
      price: 291500,
      advertisement_length: adLen,
      displays_per_day: plays,
      bonus_minutes: 5,
      description: getSetting(settings, "pkg_3months_tagline", "Build your brand presence"),
      featured: true,
      visible: true,
      sort_order: 3,
    },
    {
      name: "6 Months",
      duration: "6 Months",
      price: 379500,
      advertisement_length: adLen,
      displays_per_day: plays,
      bonus_minutes: 10,
      description: getSetting(settings, "pkg_6months_tagline", "Serious brand exposure"),
      featured: false,
      visible: true,
      sort_order: 4,
    },
    {
      name: "1 Year",
      duration: "1 Year",
      price: 726000,
      advertisement_length: adLen,
      displays_per_day: plays,
      bonus_minutes: 15,
      description: getSetting(settings, "pkg_1year_tagline", "Dominate your market"),
      featured: false,
      visible: true,
      sort_order: 5,
    },
  ];

  return rows.map((r, i) => ({
    ...r,
    id: `fallback-${i}`,
    created_at: now,
    updated_at: now,
  }));
}

export default function Packages({ settings, packages }: Props) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const vatNote      = getSetting(settings, "pkg_vat_note",      "excl. 15% VAT");
  const adDuration   = getSetting(settings, "pkg_ad_duration",   "20-second advertisement");
  const playsPerDay  = getSetting(settings, "pkg_plays_per_day", "40 plays per day");
  const contactPhone = getSetting(settings, "phone",             "+251 959 15 55 55");

  // Use DB packages when available, fall back to settings-driven static list
  const displayPackages = (packages && packages.length > 0)
    ? packages
    : buildFallback(settings);

  return (
    <section id="packages" className="relative py-24 lg:py-32 bg-blue-theme-alt grid-pattern overflow-hidden">
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-[#0057D9]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#FFD400]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 xl:mb-28"
        >
          <span className="inline-block bg-[#FFD400]/10 text-[#D9A000] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#FFD400]/20 shadow-sm">
            Pricing Packages
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl text-gray-900 mb-6 tracking-tight">
            Flexible Plans for <span className="text-[#0057D9]">Every Business</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Choose the advertising package that fits your campaign goals and budget.
            Every plan includes your {adDuration} playing {playsPerDay}.
          </p>
        </motion.div>

        {/* Cards */}
        <div className={`grid gap-5 xl:gap-7 items-stretch ${
          displayPackages.length <= 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : displayPackages.length === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        }`}>
          {displayPackages.map((pkg, i) => {
            const isPopular  = pkg.featured;
            const quoteSlug  = toQuoteSlug(pkg.duration);
            const ctaHref    = `/request-quote?package=${quoteSlug}`;
            const ctaLabel   = pkg.duration.toLowerCase().includes("year") ? "Contact Us" : "Get Started";
            const plays      = totalPlays(pkg);

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" }}
                animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ delay: i * 0.08, duration: 0.7, type: "spring", stiffness: 100, damping: 18 }}
                className="relative"
              >
                {/* Glow behind featured card */}
                {isPopular && (
                  <div className="absolute -inset-2 bg-gradient-to-b from-[#0057D9] to-[#003DA0] rounded-[28px] opacity-25 blur-lg animate-pulse-glow z-0 pointer-events-none" />
                )}

                <motion.div
                  whileHover={{
                    y: -8,
                    scale: isPopular ? 1.06 : 1.02,
                    boxShadow: isPopular
                      ? "0 25px 60px -15px rgba(0,87,217,0.4)"
                      : "0 20px 40px -15px rgba(0,0,0,0.06)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`relative flex flex-col rounded-3xl overflow-hidden h-full border transition-all duration-300 z-10 cursor-pointer ${
                    isPopular
                      ? "bg-gradient-to-b from-[#0057D9] to-[#003DA0] border-transparent scale-105"
                      : "bg-[#F0F5FF]/70 backdrop-blur-xl border-white/40 hover:border-[#0057D9]/40"
                  }`}
                >
                  {/* Badge */}
                  {isPopular && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-[#FFD400] text-gray-900 shadow-md"
                    >
                      <Star size={10} fill="currentColor" />
                      Best Value
                    </motion.div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Name */}
                    <div className={`font-heading font-extrabold text-2xl mb-1 tracking-tight ${isPopular ? "text-white" : "text-gray-900"}`}>
                      {pkg.name}
                    </div>

                    {/* Tagline / description */}
                    {pkg.description && (
                      <div className={`text-xs mb-6 font-medium ${isPopular ? "text-white/60" : "text-gray-500"}`}>
                        {pkg.description}
                      </div>
                    )}

                    {/* Price */}
                    <div className={`mb-6 py-4 px-4 rounded-2xl text-center border transition-colors duration-300 ${
                      isPopular ? "bg-white/10 border-white/10" : "bg-gray-50/80 border-gray-200/60"
                    }`}>
                      <div className={`font-heading font-extrabold text-2xl tracking-tight ${isPopular ? "text-[#FFD400]" : "text-[#0057D9]"}`}>
                        {fmtPrice(pkg.price)}
                      </div>
                      <div className={`text-[10px] mt-1 font-semibold ${isPopular ? "text-white/85" : "text-gray-800"}`}>
                        {vatNote}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3.5 flex-1 mb-8">
                      {[
                        `${pkg.advertisement_length}-second advertisement`,
                        `${pkg.displays_per_day} plays per day`,
                        `${plays} total displays`,
                        ...(pkg.bonus_minutes > 0
                          ? [`+${pkg.bonus_minutes} min bonus airtime`]
                          : []),
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-[#FFD400]/25" : "bg-[#0057D9]/10"}`}>
                            <Check size={11} className={isPopular ? "text-[#FFD400]" : "text-[#0057D9]"} strokeWidth={3} />
                          </div>
                          <span className={`text-sm leading-snug font-light ${isPopular ? "text-white/90" : "text-gray-700"}`}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA — links to request-quote with package pre-selected */}
                    <Link href={ctaHref}>
                      <motion.span
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`block text-center font-bold text-sm py-3.5 px-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                          isPopular
                            ? "bg-[#FFD400] text-gray-900 hover:bg-[#FFE033] shadow-md hover:shadow-lg"
                            : "bg-[#0057D9] text-white hover:bg-[#003DA0] shadow-sm hover:shadow-md"
                        }`}
                      >
                        {ctaLabel}
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-600 text-sm mt-12 font-normal"
        >
          All prices are before {vatNote}. Every package includes a 20-second ad slot running 40 times per day.
          Contact us at <span className="text-[#FFD400] font-medium">{contactPhone}</span> for more details.
        </motion.p>
      </div>
    </section>
  );
}
