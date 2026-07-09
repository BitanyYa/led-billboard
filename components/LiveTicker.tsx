"use client";

import { useEffect, useState } from "react";

const tickerItems = [
  "🔴 LIVE NOW — Your Ad Plays 40× Every Day",
  "⚡ 5000+ Nits Brightness — Visible Day & Night",
  "📍 Prime Location — Addis Ababa''s #1 LED Billboard",
  "📐 10m × 7m Screen — 70 m² of Pure Impact",
  "🏆 Premium LED Display — 3600 × 720 Resolution",
  "📊 Reach Thousands of Commuters & Shoppers Daily",
  "🚀 Get Started in 4 Simple Steps — Contact Us Today",
];

export default function LiveTicker() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-ET", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="relative bg-[#0057D9] overflow-hidden z-50 border-b border-[#003DA0]">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#003DA0] border-r border-[#0047C4] z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-white font-extrabold text-xs tracking-widest uppercase">
            LIVE
          </span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0057D9] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0057D9] to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee flex whitespace-nowrap py-2.5">
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center text-white/90 text-xs font-medium tracking-wide px-8">
                {item}
                <span className="ml-8 text-[#FFD400]/50">•</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#003DA0] border-l border-[#0047C4]">
          <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">ADD. TIME</span>
          <span className="text-[#FFD400] font-mono font-bold text-xs tabular-nums">{currentTime || "—:—:—"}</span>
        </div>
      </div>
    </div>
  );
}

