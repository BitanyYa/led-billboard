"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, Scissors, UtensilsCrossed, Briefcase, Tv2, CheckCircle2 } from "lucide-react";

const highlights = [
  { icon: ShoppingBag,     label: "Retail Shops"         },
  { icon: Scissors,        label: "Beauty & Salons"       },
  { icon: UtensilsCrossed, label: "Restaurants & Cafés"   },
  { icon: Briefcase,       label: "Professional Services" },
  { icon: Tv2,             label: "AWLO Advert Billboard" },
];

const paragraphs = [
  "Located in the vibrant Bole Medhanialem area of Addis Ababa, AWLO Business Center is a modern commercial hub bringing businesses and customers together from retail and dining to professional services and premium LED billboard advertising.",
];

export default function About() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 xl:mb-20"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-semibold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            About AWLO
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl text-gray-900 mb-4">
            About <span className="text-[#0057D9]">AWLO</span> Business Center
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Left: Visual card */}
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
                    { num: "Bole",  unit: "",        label: "Medhanialem"   },
                    { num: "100+",  unit: "Businesses", label: "Under One Roof" },
                    { num: "7",     unit: "Days",    label: "Open Weekly"   },
                    { num: "24/7",  unit: "Ads",     label: "LED Billboard" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="font-heading font-bold text-2xl text-white">
                        {item.num}
                        {item.unit && <span className="text-[#FFD400] text-sm ml-1">{item.unit}</span>}
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
              <div className="text-xs text-gray-500 mb-1">Addis Ababa, Ethiopia</div>
              <div className="font-heading font-bold text-gray-900 text-sm">Modern Commercial Hub</div>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-5"
          >
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                className="text-gray-600 text-base lg:text-lg leading-relaxed"
              >
                {p}
              </motion.p>
            ))}

            {/* What's inside */}
            <div className="pt-4">
              <h3 className="font-heading font-bold text-gray-900 text-lg mb-5">
                What&apos;s inside AWLO BC
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {highlights.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.55 + i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0057D9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={15} className="text-[#0057D9]" />
                    </div>
                    <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.55 + highlights.length * 0.07, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-[#0057D9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm leading-relaxed">
                    And many more growing businesses
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
