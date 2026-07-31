"use client";

import { motion } from "framer-motion";
import { ArrowRight, Megaphone, ShoppingBag, Utensils, Briefcase, Tv2 } from "lucide-react";
import Link from "next/link";
import type { SettingsMap } from "@/types/admin";
import { getSetting } from "@/lib/settings";

interface Props { settings: SettingsMap; }

export default function Hero({ settings }: Props) {
  const videoUrl = getSetting(settings, "hero_video_url", "") || "/billboard-video.mp4";
  const stat1v   = getSetting(settings, "hero_stat1_value", "40x");
  const stat1l   = getSetting(settings, "hero_stat1_label", "Daily Displays");
  const stat2v   = getSetting(settings, "hero_stat2_value", "10×7m");
  const stat2l   = getSetting(settings, "hero_stat2_label", "Screen Size");
  const stat3v   = getSetting(settings, "hero_stat3_value", "24/7");
  const stat3l   = getSetting(settings, "hero_stat3_label", "Visibility");

  const stats = [
    { value: stat1v, label: stat1l },
    { value: stat2v, label: stat2l },
    { value: stat3v, label: stat3l },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020B1A] via-[#030F24] to-[#061630]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0057D9]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#FFD400]/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content — same container as Navbar */}
      <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-16 xl:pt-36 xl:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">

          {/* ── Left: Text ── */}
          <div className="flex-1 min-w-0">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-6xl sm:text-7xl lg:text-7xl xl:text-8xl text-white leading-[1.0] mb-6"
            >
              <span className="inline-flex items-center tracking-tight gap-0">
                {/* A */}
                <span className="text-slate-300">A</span>

                {/* W — exact logo polygon coords */}
                <svg
                  viewBox="36 96 65 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[0.72em] w-auto inline-block align-middle -ml-[0.18em] mr-[0.02em] mb-[0.02em]"
                  aria-hidden="true"
                >
                  {/* Green triangle: corners at 39,96 / 63,96 / 51.5,125 — r=2.5 */}
                  <path
                    d="M 41.5,96 Q 63,96 61.1,97.9 L 53.8,122.7 Q 51.5,125 49.2,122.7 L 41.9,97.9 Q 39,96 41.5,96 Z"
                    fill="#10B981"
                  />
                  {/* Yellow chevron: corners at 66,96 / 82,96 / 61,145 / 53,128 — r=2.5 */}
                  <path
                    d="M 68.5,96 Q 82,96 80.1,97.8 L 63.3,142.6 Q 61,145 58.8,143.5 L 53.6,130.3 Q 53,128 54.9,126.2 L 64.1,97.8 Q 66,96 68.5,96 Z"
                    fill="#FACC15"
                  />
                  {/* Red chevron: corners at 85,96 / 101,96 / 80,145 / 70,130 — r=2.5 */}
                  <path
                    d="M 87.5,96 Q 101,96 99.1,97.8 L 82.3,142.6 Q 80,145 77.8,143.5 L 72.6,132.3 Q 70,130 71.9,128.2 L 83.1,97.8 Q 85,96 87.5,96 Z"
                    fill="#EF4444"
                  />
                </svg>

                {/* L */}
                <span className="text-slate-300">L</span>

                {/* O */}
                <span className="text-slate-300">O</span>
              </span>
              <br />
              Business
              <br />
              Center
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-md"
            >
              Addis Ababa&apos;s Premium commercial hub shopping, dining,
              services, and billboard advertising in one place.
            </motion.p>

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { icon: ShoppingBag, label: "Shopping"  },
                { icon: Utensils,    label: "Dining"    },
                { icon: Briefcase,   label: "Services"  },
                { icon: Tv2,         label: "Billboard" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium backdrop-blur-md"
                >
                  <Icon size={12} className="text-[#FFD400]" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#about"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] text-white font-semibold text-base px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(0,87,217,0.45)] hover:shadow-[0_14px_40px_rgba(0,87,217,0.65)] transition-colors duration-300"
              >
                Explore
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/request-quote"
                  className="group inline-flex items-center gap-2 border border-white/30 hover:border-[#FFD400]/60 text-white hover:text-[#FFD400] font-medium text-base px-8 py-4 rounded-full transition-all duration-300 hover:bg-[#FFD400]/5"
                >
                  <Megaphone size={17} className="transition-transform duration-300 group-hover:rotate-12" />
                  Advertise
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.36 }}
              className="mt-14 flex items-center gap-10 flex-wrap"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                >
                  <div className="font-heading font-bold text-3xl text-[#FFD400]">{stat.value}</div>
                  <div className="text-white/50 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Billboard mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex-1 min-w-0 w-full"
          >
            <div className="relative max-w-md lg:max-w-none mx-auto">
              <div className="absolute -inset-4 bg-[#0057D9]/30 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-b from-[#0A1628] to-[#0D1F3C] rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(0,87,217,0.3)] overflow-hidden">
                <div className="p-4">
                  <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#0057D9] via-[#0047B3] to-[#001F5C]">
                    <video
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "8px 8px",
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                </div>
                <div className="h-6 bg-gradient-to-b from-[#0A1628] to-[#060E1E] mx-6 flex items-center justify-center">
                  <div className="w-16 h-1 bg-white/10 rounded-full" />
                </div>
              </div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 bg-[#FFD400] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                LIVE NOW
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-[#0057D9] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-white/20"
              >
                {stat2v} Screen
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
