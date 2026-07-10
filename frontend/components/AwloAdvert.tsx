"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "slide-1",
    content: (
      <div className="flex flex-col items-center text-center w-full px-4">
        <img src="/logo.png" alt="AWLO Advert" className="h-12 sm:h-16 md:h-20 w-auto mb-3 sm:mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        <h3 className="text-white font-heading font-bold text-lg sm:text-xl md:text-3xl drop-shadow-md">
          PREMIER DIGITAL DISPLAY
        </h3>
      </div>
    ),
  },
  {
    id: "slide-2",
    content: (
      <div className="flex flex-col items-center text-center w-full px-4">
        <div className="text-[#FFD400] font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(255,212,0,0.5)]">
          10m × 7m
        </div>
        <h3 className="text-white font-heading font-bold text-sm sm:text-xl md:text-2xl tracking-widest uppercase drop-shadow-md">
          Massive Scale
        </h3>
      </div>
    ),
  },
  {
    id: "slide-3",
    content: (
      <div className="flex flex-col items-center text-center w-full px-4">
        <div className="text-white font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 drop-shadow-md">
          SEEN BY
        </div>
        <div className="text-[#0057D9] bg-white px-3 sm:px-4 py-1 rounded-sm font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
          THOUSANDS
        </div>
      </div>
    ),
  },
  {
    id: "slide-4",
    content: (
      <div className="flex flex-col items-center text-center w-full px-4">
        <h3 className="text-white font-heading font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 drop-shadow-md">
          ELEVATE YOUR BRAND
        </h3>
        <div className="text-[#FFD400] font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(255,212,0,0.5)]">
          BOOK NOW
        </div>
      </div>
    ),
  },
];

export default function AwloAdvert() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-20 overflow-hidden bg-black/40">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center w-full"
        >
          {slides[currentSlide].content}
        </motion.div>
      </AnimatePresence>
      
      {/* Persistent Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay">
        <div className="w-full h-[2px] bg-white/20 animate-scan" style={{
            animation: "scan 4s linear infinite",
            position: "absolute",
        }} />
      </div>
    </div>
  );
}
