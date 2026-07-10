"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Billboard", href: "#billboard" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#060E1E] to-[#01050F] text-white border-t border-white/5 overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#0057D9]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <motion.img
                whileHover={{ scale: 1.03 }}
                src="/logo.png"
                alt="AWLO Advert"
                className="h-20 w-auto filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]"
              />
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md font-light">
              Ethiopia&apos;s premier LED billboard advertising company. We help
              businesses reach thousands of potential customers every day with
              stunning digital displays at Awlo Business Center.
            </p>

            <div className="space-y-3.5">
              <motion.a
                whileHover={{ x: 4 }}
                href="tel:+251959155555"
                className="flex items-center gap-3 text-white/80 hover:text-[#FFD400] transition-colors text-sm group"
              >
                <div className="w-8.5 h-8.5 rounded-lg bg-white/5 group-hover:bg-[#FFD400]/20 flex items-center justify-center transition-colors">
                  <Phone size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                +251 959 15 55 55
              </motion.a>
              <motion.a
                whileHover={{ x: 4 }}
                href="mailto:awloadvertising@gmail.com"
                className="flex items-center gap-3 text-white/80 hover:text-[#FFD400] transition-colors text-sm group"
              >
                <div className="w-8.5 h-8.5 rounded-lg bg-white/5 group-hover:bg-[#FFD400]/20 flex items-center justify-center transition-colors">
                  <Mail size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                awloadvertising@gmail.com
              </motion.a>
              <motion.a
                whileHover={{ x: 4 }}
                href="https://www.awloadvertising.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-[#FFD400] transition-colors text-sm group"
              >
                <div className="w-8.5 h-8.5 rounded-lg bg-white/5 group-hover:bg-[#FFD400]/20 flex items-center justify-center transition-colors">
                  <Globe size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                www.awloadvertising.com
              </motion.a>
              <div className="flex items-center gap-3 text-white/80 text-sm group">
                <div className="w-8.5 h-8.5 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                Awlo Business Center, Addis Ababa
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-6 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <motion.a
                    whileHover={{ x: 6, color: "#FFD400" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    href={link.href}
                    className="text-white/60 text-sm transition-colors inline-block"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-6 tracking-wide">
              Connect With Us
            </h3>

            <div className="mb-8">
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">
                Business Hours
              </div>
              <div className="text-white/60 text-sm space-y-1.5 font-light">
                <div>Mon - Fri: 8:00 AM - 6:00 PM</div>
                <div>Sat: 9:00 AM - 4:00 PM</div>
                <div>Sun: Closed</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    whileHover={{ 
                      y: -4, 
                      scale: 1.1,
                      backgroundColor: "#0057D9",
                      boxShadow: "0 10px 15px -3px rgba(0, 87, 217, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 group"
                  >
                    <Icon size={16} className="text-white/60 group-hover:text-white" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 text-sm text-white/40 font-light">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              Â© {new Date().getFullYear()} AWLO ADVERT. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white/70 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white/70 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


