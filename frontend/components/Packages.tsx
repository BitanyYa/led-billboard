"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    duration: "1 Week",
    period: "weekly",
    price: "ETB 47,036",
    badge: null,
    tagline: "Try it out",
    features: [
      "20-second advertisement",
      "40 plays per day",
      "280 total displays",
      "Basic support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    duration: "1 Month",
    period: "monthly",
    price: "ETB 108,460",
    badge: null,
    tagline: "Most popular for starters",
    features: [
      "20-second advertisement",
      "40 plays per day",
      "1,200 total displays",
      "Priority support",
      "Ad review assistance",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    duration: "3 Months",
    period: "quarterly",
    price: "ETB 291,500",
    badge: "Best Value",
    tagline: "Build your brand presence",
    features: [
      "20-second advertisement",
      "40 plays per day",
      "3,600 total displays",
      "Priority support",
      "Ad review assistance",
      "Campaign performance update",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    duration: "6 Months",
    period: "semi-annual",
    price: "ETB 379,500",
    badge: null,
    tagline: "Serious brand exposure",
    features: [
      "20-second advertisement",
      "40 plays per day",
      "7,200 total displays",
      "Dedicated support",
      "Ad review assistance",
      "Campaign performance updates",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    duration: "1 Year",
    period: "annual",
    price: "ETB 726,000",
    badge: "Max Savings",
    tagline: "Dominate your market",
    features: [
      "20-second advertisement",
      "40 plays per day",
      "14,600 total displays",
      "VIP dedicated support",
      "Ad review assistance",
      "Campaign performance updates",
      "Seasonal creative refresh",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export default function Packages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="packages" className="relative py-24 lg:py-32 bg-blue-theme-alt grid-pattern overflow-hidden">
      {/* Decorative gradient overlay blurs */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-[#0057D9]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#FFD400]/5 rounded-full blur-[100px] pointer-events-none" />

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
            Pricing Packages
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6 tracking-tight">
            Flexible Plans for <span className="text-[#0057D9]">Every Business</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Choose the advertising package that fits your campaign goals and budget.
            Every plan includes your 20-second ad playing 40 times per day.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.duration}
              initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ delay: i * 0.08, duration: 0.7, type: "spring", stiffness: 100, damping: 18 }}
              className="relative"
            >
              {/* Popular glowing backdrop blur */}
              {pkg.popular && (
                <div className="absolute -inset-2 bg-gradient-to-b from-[#0057D9] to-[#003DA0] rounded-[28px] opacity-25 blur-lg animate-pulse-glow z-0 pointer-events-none" />
              )}

              <motion.div
                whileHover={{ 
                  y: -8, 
                  scale: pkg.popular ? 1.06 : 1.02,
                  boxShadow: pkg.popular 
                    ? "0 25px 60px -15px rgba(0,87,217,0.4)" 
                    : "0 20px 40px -15px rgba(0,0,0,0.06)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`relative flex flex-col rounded-3xl overflow-hidden h-full border transition-all duration-300 z-10 cursor-pointer
                  ${
                    pkg.popular
                      ? "bg-gradient-to-b from-[#0057D9] to-[#003DA0] border-transparent scale-105"
                      : "bg-[#F0F5FF]/70 backdrop-blur-xl border-white/40 hover:border-[#0057D9]/40"
                  }
                `}
              >
                {/* Badge */}
                {pkg.badge && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`absolute top-4 right-4 flex items-center gap-1 text-[10px] font-extrabold px-3 py-1.5 rounded-full ${
                      pkg.popular
                        ? "bg-[#FFD400] text-gray-900 shadow-md"
                        : "bg-[#0057D9] text-white"
                    }`}
                  >
                    <Star size={10} fill="currentColor" />
                    {pkg.badge}
                  </motion.div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Duration */}
                  <div
                    className={`font-heading font-extrabold text-2xl mb-1 tracking-tight ${
                      pkg.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {pkg.duration}
                  </div>
                  <div
                    className={`text-xs mb-6 font-medium ${
                      pkg.popular ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    {pkg.tagline}
                  </div>

                  {/* Price */}
                  <div
                    className={`mb-6 py-4 px-4 rounded-2xl text-center border transition-colors duration-300 ${
                      pkg.popular
                        ? "bg-white/10 border-white/10"
                        : "bg-gray-50/80 border-gray-200/60"
                    }`}
                  >
                    <div className={`font-heading font-extrabold text-2xl tracking-tight ${
                      pkg.popular ? "text-[#FFD400]" : "text-[#0057D9]"
                    }`}>
                      {pkg.price}
                    </div>
                    <div className={`text-[10px] mt-1 font-medium ${
                      pkg.popular ? "text-white/40" : "text-gray-500"
                    }`}>
                      excl. 15% VAT
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 flex-1 mb-8">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            pkg.popular
                              ? "bg-[#FFD400]/25"
                              : "bg-[#0057D9]/10"
                          }`}
                        >
                          <Check
                            size={11}
                            className={pkg.popular ? "text-[#FFD400]" : "text-[#0057D9]"}
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          className={`text-sm leading-snug font-light ${
                            pkg.popular ? "text-white/90" : "text-gray-700"
                          }`}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/request-quote">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`block text-center font-bold text-sm py-3.5 px-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                        pkg.popular
                          ? "bg-[#FFD400] text-gray-900 hover:bg-[#FFE033] shadow-md hover:shadow-lg"
                          : "bg-[#0057D9] text-white hover:bg-[#003DA0] shadow-sm hover:shadow-md"
                      }`}
                    >
                      {pkg.cta}
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-400 text-sm mt-12 font-light"
        >
          All prices are before 15% VAT. Every package includes a 20-second ad slot running 40 times per day.
          Contact us at <span className="text-[#FFD400] font-medium">+251 959 15 55 55</span> for more details.
        </motion.p>
      </div>
    </section>
  );
}


