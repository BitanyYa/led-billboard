"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#billboard", label: "Billboard" },
  { href: "#packages", label: "Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Image
                src="/logo.png"
                alt="AWLO Advert"
                width={120}
                height={56}
                className="h-14 w-auto drop-shadow-sm filter brightness-100 group-hover:brightness-105 transition-all duration-300"
              />
            </motion.div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-300 relative py-2 group ${
                  isScrolled 
                    ? "text-gray-700 hover:text-[#0057D9]" 
                    : "text-white/90 hover:text-[#FFD400]"
                }`}
              >
                {link.label}
                <span 
                  className={`absolute -bottom-0.5 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full ${
                    isScrolled ? "bg-[#0057D9]" : "bg-[#FFD400]"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <Link href="/request-quote">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 212, 0, 0.4)", y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hidden md:inline-flex items-center gap-2 bg-[#FFD400] text-gray-900 font-bold text-sm px-6 py-3 rounded-full hover:bg-[#E6BF00] transition-colors shadow-md cursor-pointer"
            >
              Get a Quote
            </motion.span>
          </Link>

          {/* Mobile Hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors duration-200 ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-100/80"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="text-gray-700 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-[#0057D9]/5 hover:text-[#0057D9] transition-all duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link href="/request-quote" onClick={handleLinkClick}>
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 bg-[#FFD400] text-gray-900 font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-[#E6BF00] transition-colors text-center shadow-md block cursor-pointer"
                >
                  Get a Quote
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}


