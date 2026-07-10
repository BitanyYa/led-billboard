"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Package, Upload, Rocket } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    num: 1,
    icon: Phone,
    title: "Contact AWLO",
    description:
      "Reach out to us via phone, email, WhatsApp, or our contact form. Let's discuss your advertising goals.",
    accent: "#0057D9",
    glow: "shadow-[#0057D9]/20",
  },
  {
    num: 2,
    icon: Package,
    title: "Choose a Package",
    description:
      "Select a package that fits your campaign timeline and budget â€” from weekly to annual plans.",
    accent: "#FFD400",
    glow: "shadow-[#FFD400]/20",
  },
  {
    num: 3,
    icon: Upload,
    title: "Submit Your Ad",
    description:
      "Send us your 20-second video advertisement. Our team will review and optimize it for the LED screen.",
    accent: "#0057D9",
    glow: "shadow-[#0057D9]/20",
  },
  {
    num: 4,
    icon: Rocket,
    title: "Go Live",
    description:
      "Your advertisement goes live on our LED billboard and starts playing 40 times daily. Watch your brand soar!",
    accent: "#FFD400",
    glow: "shadow-[#FFD400]/20",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 lg:py-32 bg-blue-theme grid-pattern overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-[#0057D9]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FFD400]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#0057D9]/10 shadow-sm">
            How It Works
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6 tracking-tight">
            Get Started in <span className="text-[#0057D9]">4 Simple Steps</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Advertising with AWLO is straightforward. From first contact to your ad
            going live, we make the process smooth and hassle-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200/80 to-transparent z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                  transition={{ delay: i * 0.12, duration: 0.7, type: "spring", stiffness: 100, damping: 18 }}
                  className="relative flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Circle icon */}
                  <div className="relative mb-6 z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${step.glow}`}
                      style={{ backgroundColor: step.accent }}
                    >
                      <Icon size={30} className="text-white" />
                    </motion.div>
                    {/* Number badge */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD400] rounded-full flex items-center justify-center shadow-md border-4 border-white"
                    >
                      <span className="font-heading font-extrabold text-gray-900 text-sm">
                        {step.num}
                      </span>
                    </motion.div>
                  </div>

                  {/* Text */}
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-3 tracking-tight transition-colors duration-300 group-hover:text-[#0057D9]">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs font-light">
                    {step.description}
                  </p>

                  {/* Arrow (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-8 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#0057D9]/50">
                      <svg
                        width="32"
                        height="24"
                        viewBox="0 0 32 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12H30M30 12L20 2M30 12L20 22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Arrow (mobile/tablet) */}
                  {i < steps.length - 1 && (
                    <div className="lg:hidden mt-6 text-gray-300 transition-transform duration-300 group-hover:translate-y-1 group-hover:text-[#0057D9]/50">
                      <svg
                        width="24"
                        height="32"
                        viewBox="0 0 24 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 1V30M12 30L2 20M12 30L22 20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <Link href="/request-quote">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -10px rgba(0,87,217,0.5)", y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
              className="inline-flex items-center gap-2 bg-[#0057D9] text-white font-bold text-base px-9 py-4 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
            >
              Start Your Campaign Today
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


