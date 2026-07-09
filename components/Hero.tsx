"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep night city gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020B1A] via-[#030F24] to-[#061630]" />

        {/* LED glow effect top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0057D9]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#FFD400]/10 rounded-full blur-[120px]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Side */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                Premium Digital Billboard Advertising
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6"
            >
              Make Your Brand{" "}
              <span className="relative inline-block">
                <span className="text-[#FFD400]">Impossible</span>
              </span>{" "}
              to Ignore
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Reach thousands of potential customers every day through premium
              LED billboard advertising. Your message, bigger and brighter than ever.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(0,87,217,0.4)] hover:shadow-[0_12px_40px_rgba(0,87,217,0.6)] hover:-translate-y-1"
              >
                Get a Quote
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-medium text-base px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10"
              >
                <Phone size={18} />
                Contact Us
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-14 flex items-center gap-8 justify-center lg:justify-start flex-wrap"
            >
              {[
                { value: "40x", label: "Daily Displays" },
                { value: "10×7m", label: "Screen Size" },
                { value: "24/7", label: "Visibility" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-heading font-bold text-3xl text-[#FFD400]">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Billboard Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-[#0057D9]/30 rounded-3xl blur-2xl" />

              {/* Billboard frame */}
              <div className="relative bg-gradient-to-b from-[#0A1628] to-[#0D1F3C] rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(0,87,217,0.3)] overflow-hidden">
                {/* Screen bezel */}
                <div className="p-4">
                  {/* Screen */}
                  <div className="relative rounded-xl overflow-hidden aspect-[10/7] bg-gradient-to-br from-[#0057D9] via-[#0047B3] to-[#001F5C]">
                    {/* LED grid overlay */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "8px 8px",
                      }}
                    />

                    {/* Bright content on screen */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="flex justify-center mb-3">
                        <img
                          src="/logo.png"
                          alt="AWLO Advert"
                          className="h-16 w-auto"
                        />
                      </div>
                      <div className="text-white/80 text-sm leading-relaxed max-w-[200px]">
                        Your brand, displayed 40× daily to thousands of viewers
                      </div>

                      {/* Scan line effect */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-x-0 h-px bg-white/5 animate-scan" />
                      </div>
                    </div>

                    {/* Screen glare */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                </div>

                {/* Billboard pole/base */}
                <div className="h-6 bg-gradient-to-b from-[#0A1628] to-[#060E1E] mx-6 flex items-center justify-center">
                  <div className="w-16 h-1 bg-white/10 rounded-full" />
                </div>
              </div>

              {/* Floating labels */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-[#FFD400] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                LIVE NOW
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-[#0057D9] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-white/20"
              >
                10m × 7m Screen
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

      <style jsx>{`
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 200%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </section>
  );
}

