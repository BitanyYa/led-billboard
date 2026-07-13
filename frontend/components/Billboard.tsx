"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Maximize2, Zap, Clock, BarChart2, Lightbulb, Building2 } from "lucide-react";
import AwloAdvert from "@/components/AwloAdvert";
import type { SettingsMap } from "@/types/admin";
import { getSetting } from "@/lib/settings";

interface Props { settings: SettingsMap; }

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 18 },
  },
};

export default function Billboard({ settings }: Props) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const specs = [
    { icon: Maximize2, label: "Screen Size",     value: getSetting(settings, "billboard_screen_size",  "10m × 7m"),    detail: "Total display area",                accent: "#0057D9" },
    { icon: Zap,       label: "Resolution",      value: getSetting(settings, "billboard_resolution",   "4K Resolution"),  detail: "Crystal-clear pixel density",       accent: "#FFD400" },
    { icon: Clock,     label: "Ad Duration",     value: getSetting(settings, "billboard_ad_duration",  "20 Seconds"),  detail: "Per advertisement slot",            accent: "#0057D9" },
    { icon: BarChart2, label: "Daily Plays",     value: getSetting(settings, "billboard_daily_plays",  "40 Times"),    detail: "Per advertisement per day",         accent: "#FFD400" },
    { icon: Lightbulb, label: "Brightness",      value: getSetting(settings, "billboard_brightness",   "5000+ Nits"), detail: "Vivid in all lighting conditions",  accent: "#0057D9" },
    { icon: Building2, label: "Target Audience", value: getSetting(settings, "billboard_target",       "All Sizes"),   detail: "Ideal for any type of business",    accent: "#FFD400" },
  ];

  const screenSize = getSetting(settings, "billboard_screen_size", "10m × 7m");

  return (
    <section id="billboard" className="relative py-24 lg:py-32 bg-blue-theme grid-pattern overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#0057D9]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-[#FFD400]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 xl:mb-28"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#0057D9]/10 shadow-sm">
            The Billboard
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl text-gray-900 mb-6 tracking-tight">
            Technical <span className="text-[#0057D9]">Specifications</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Our LED billboard delivers outstanding visual performance.
            Here&apos;s what you get when you advertise with AWLO.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Billboard illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[#0057D9]/15 rounded-3xl blur-3xl animate-pulse-glow" />
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 3 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xs sm:max-w-sm xl:max-w-md cursor-pointer"
            >
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-700">
                <div className="m-3 bg-black rounded-xl overflow-hidden relative" style={{ aspectRatio: "3/4" }}>
                  <div className="absolute inset-0">
                    <video
                      autoPlay loop muted playsInline
                      src="https://assets.mixkit.co/videos/preview/mixkit-busy-highway-in-the-city-at-night-4165-large.mp4"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "6px 6px",
                      }}
                    />
                  </div>
                  <AwloAdvert />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent pointer-events-none" />
                </div>
                <div className="h-3 bg-gradient-to-b from-gray-700 to-gray-800 mx-3 mb-3 rounded-b-lg" />
              </div>

              <div className="flex items-center gap-2 mt-4 justify-center">
                <div className="h-px flex-1 bg-gray-400/30" />
                <span className="text-gray-500 text-xs font-mono px-3 bg-white/60 backdrop-blur-sm py-1 rounded-full border border-gray-200/60">
                  {screenSize} Portrait Screen
                </span>
                <div className="h-px flex-1 bg-gray-400/30" />
              </div>
            </motion.div>
          </motion.div>

          {/* Specs grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6"
          >
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={spec.label}
                  variants={cardVariants}
                  whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,87,217,0.12)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="group bg-[#F0F5FF]/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 hover:border-[#0057D9]/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-inner"
                    style={{ backgroundColor: spec.accent + "18" }}
                  >
                    <Icon size={22} style={{ color: spec.accent }} />
                  </motion.div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{spec.label}</div>
                  <div className="font-heading font-extrabold text-xl text-gray-900 mb-1 tracking-tight">{spec.value}</div>
                  <div className="text-gray-500 text-xs font-light">{spec.detail}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
