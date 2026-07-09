"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Eye,
  Monitor,
  MapPin,
  Repeat,
  Sun,
  BadgeDollarSign,
} from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "High Visibility",
    description:
      "Our billboard stands in a high-traffic location, ensuring thousands of eyes see your brand every single day.",
    color: "text-[#0057D9]",
    bg: "bg-[#0057D9]/10",
    accent: "shadow-[#0057D9]/10",
  },
  {
    icon: Monitor,
    title: "Premium LED Display",
    description:
      "A stunning 10m Ã— 7m LED screen with vibrant colors and sharp resolution that makes every ad pop.",
    color: "text-[#D9A000]",
    bg: "bg-[#FFD400]/15",
    accent: "shadow-[#FFD400]/10",
  },
  {
    icon: MapPin,
    title: "Strategic Location",
    description:
      "Positioned at a prime intersection for maximum reach to commuters, shoppers, and pedestrians.",
    color: "text-[#0057D9]",
    bg: "bg-[#0057D9]/10",
    accent: "shadow-[#0057D9]/10",
  },
  {
    icon: Repeat,
    title: "40 Displays Daily",
    description:
      "Your 20-second advertisement runs 40 times every day, keeping your brand top-of-mind for potential customers.",
    color: "text-[#D9A000]",
    bg: "bg-[#FFD400]/15",
    accent: "shadow-[#FFD400]/10",
  },
  {
    icon: Sun,
    title: "Day & Night Visibility",
    description:
      "Our LED display is fully visible in bright daylight and even more stunning after dark 24/7 exposure.",
    color: "text-[#0057D9]",
    bg: "bg-[#0057D9]/10",
    accent: "shadow-[#0057D9]/10",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Packages",
    description:
      "Flexible packages designed for every business size and budget, from weekly campaigns to annual placements.",
    color: "text-[#D9A000]",
    bg: "bg-[#FFD400]/15",
    accent: "shadow-[#FFD400]/10",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 18 } 
  },
};

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 lg:py-32 bg-blue-theme-alt grid-pattern overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#0057D9]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFD400]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block bg-[#FFD400]/10 text-[#D9A000] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#FFD400]/20 shadow-sm">
            Why Advertise With Us
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6 tracking-tight">
            Unmatched Outdoor{" "}
            <span className="text-[#0057D9]">Advertising</span> Power
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            AWLO Advertising delivers the reach, impact, and flexibility that modern
            businesses need to grow their presence in the real world.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={card}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 87, 217, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`group bg-[#F0F5FF]/70 backdrop-blur-xl rounded-3xl p-8 border border-white/40 hover:border-[#0057D9]/40 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${benefit.accent}`}
              >
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 ${benefit.bg} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner`}
                >
                  <Icon size={26} className={`${benefit.color} transition-transform duration-300 group-hover:scale-105`} />
                </div>

                <h3 className="font-heading font-bold text-gray-900 text-lg mb-3 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {benefit.description}
                </p>

                {/* Bottom accent progress slide line */}
                <div className="relative mt-8 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-0 bg-[#0057D9] rounded-full group-hover:w-full transition-all duration-500 ease-[0.16,1,0.3,1]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}


