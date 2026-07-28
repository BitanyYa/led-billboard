"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  MapPin,
  Users,
  TrendingUp,
  Building2,
  Tv2,
  Handshake,
} from "lucide-react";

const benefits = [
  {
    icon: MapPin,
    title: "Prime Location",
    description: "In the heart of Bole Medhanialem, one of Addis Ababa's busiest commercial districts.",
    color: "text-[#0057D9]",
    bg: "bg-[#0057D9]/10",
    accent: "shadow-[#0057D9]/10",
  },
  {
    icon: Users,
    title: "High Daily Foot Traffic",
    description: "A destination visited daily by shoppers, professionals, and businesses.",
    color: "text-[#D9A000]",
    bg: "bg-[#FFD400]/15",
    accent: "shadow-[#FFD400]/10",
  },
  {
    icon: TrendingUp,
    title: "Business Growth Opportunities",
    description: "A thriving environment where businesses gain visibility and connect with customers.",
    color: "text-[#0057D9]",
    bg: "bg-[#0057D9]/10",
    accent: "shadow-[#0057D9]/10",
  },
  {
    icon: Building2,
    title: "Modern Commercial Environment",
    description: "Clean, accessible, and welcoming spaces designed for both visitors and businesses.",
    color: "text-[#D9A000]",
    bg: "bg-[#FFD400]/15",
    accent: "shadow-[#FFD400]/10",
  },
  {
    icon: Tv2,
    title: "Premium LED Advertising",
    description: "Reach a larger audience through AWLO Advert's high-resolution LED billboard.",
    color: "text-[#0057D9]",
    bg: "bg-[#0057D9]/10",
    accent: "shadow-[#0057D9]/10",
  },
  {
    icon: Handshake,
    title: "Trusted Business Community",
    description: "Join a growing community of businesses operating within AWLO Business Center.",
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

      <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 xl:mb-28"
        >
          <span className="inline-block bg-[#FFD400]/10 text-[#D9A000] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#FFD400]/20 shadow-sm">
            Why Choose Us
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl text-gray-900 mb-6 tracking-tight">
            Why Choose <span className="text-[#0057D9]">AWLO Business Center</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10"
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


