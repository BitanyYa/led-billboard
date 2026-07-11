"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, CheckCircle2 } from "lucide-react";
import type { SettingsMap } from "@/types/admin";
import { getSetting } from "@/lib/settings";

interface Props { settings: SettingsMap; }

const reasons = [
  "Prime strategic billboard location for maximum exposure",
  "State-of-the-art 10m × 7m high-resolution LED screen",
  "40 advertisement displays every single day",
  "Flexible packages for any budget and timeline",
  "Professional support from concept to campaign launch",
  "Proven results for businesses of all sizes",
];

export default function About({ settings }: Props) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const heading = getSetting(settings, "about_heading", "Ethiopia's Premier LED Billboard Operator");
  const body    = getSetting(settings, "about_body",    "AWLO Advertising is an Ethiopian company specializing exclusively in digital LED billboard advertising. We own and operate a large, state-of-the-art LED billboard that brings businesses to life with vivid, dynamic displays that no passerby can ignore.");
  const mission = getSetting(settings, "about_mission", "To empower Ethiopian businesses with premium outdoor advertising that delivers measurable impact and brand visibility.");
  const vision  = getSetting(settings, "about_vision",  "To become Ethiopia's most trusted and innovative outdoor digital advertising partner, helping brands achieve impossible visibility.");

  return (
    <section id="about" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-semibold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            About AWLO
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
            {heading.includes("LED") ? (
              <>
                {heading.split("LED")[0]}
                <span className="text-[#0057D9]">LED</span>
                {heading.split("LED")[1]}
              </>
            ) : (
              heading
            )}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            We connect businesses with their audiences through breathtaking digital
            displays that dominate the skyline and capture attention.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,87,217,0.25)] border border-white/10">
              <video
                autoPlay loop muted playsInline
                src="https://assets.mixkit.co/videos/preview/mixkit-city-traffic-on-a-busy-avenue-at-night-4217-large.mp4"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0057D9]/85 to-[#003DA0]/90" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10 p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: "10×7", unit: "Meters",  label: "Screen Size"    },
                    { num: "40",   unit: "Times",   label: "Daily Displays" },
                    { num: "20",   unit: "Seconds", label: "Per Ad Slot"    },
                    { num: "24/7", unit: "Hours",   label: "Visibility"     },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="font-heading font-bold text-2xl text-white">
                        {item.num}
                        <span className="text-[#FFD400] text-sm ml-1">{item.unit}</span>
                      </div>
                      <div className="text-white/60 text-xs mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 z-20"
            >
              <div className="text-xs text-gray-500 mb-1">Est. in Ethiopia</div>
              <div className="font-heading font-bold text-gray-900 text-sm">Premium Outdoor Media</div>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{body}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 bg-[#0057D9]/10 rounded-xl flex items-center justify-center mb-4">
                  <Target size={20} className="text-[#0057D9]" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-base mb-2">Our Mission</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{mission}</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 bg-[#FFD400]/20 rounded-xl flex items-center justify-center mb-4">
                  <Eye size={20} className="text-[#E6BF00]" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-base mb-2">Our Vision</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{vision}</p>
              </div>
            </div>

            <h3 className="font-heading font-bold text-gray-900 text-lg mb-5">
              Why businesses choose AWLO
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {reasons.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-[#0057D9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm leading-relaxed">{reason}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
