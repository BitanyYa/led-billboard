"use client";

import { motion } from "framer-motion";
import { CheckCircle, Home, Phone } from "lucide-react";
import Link from "next/link";

interface Props {
  referenceNumber: string;
}

export default function SuccessPage({ referenceNumber }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-lg w-full text-center">

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 16 }}
          className="relative inline-flex mb-8"
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#0057D9]/20 rounded-full blur-xl"
          />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#0057D9] to-[#1E73FF] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,87,217,0.35)]">
            <CheckCircle size={44} className="text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-3">
            🎉 Quote Request Submitted!
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Thank you for choosing <strong className="text-gray-800">AWLO Advertising</strong>.
            We have received your advertising campaign request. Our team will review your
            request and contact you shortly regarding pricing, scheduling, and next steps.
          </p>
        </motion.div>

        {/* Reference Number card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gradient-to-br from-[#0057D9]/5 to-[#0057D9]/10 border border-[#0057D9]/20 rounded-2xl px-8 py-6 mb-8 inline-block w-full"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Reference Number
          </p>
          <p className="font-heading font-bold text-3xl text-[#0057D9] tracking-widest">
            {referenceNumber}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Please save this number for future correspondence.
          </p>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white border border-gray-100 rounded-2xl px-6 py-5 mb-8 text-left shadow-sm"
        >
          <h3 className="font-heading font-bold text-gray-800 text-sm mb-4">
            What happens next?
          </h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Our team reviews your campaign request within 24 hours." },
              { step: "2", text: "We contact you to confirm pricing, scheduling, and payment." },
              { step: "3", text: "Once confirmed, your ad goes live on our LED billboard." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0057D9] text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-[#0057D9]/25 transition-colors cursor-pointer"
            >
              <Home size={16} />
              Return Home
            </motion.span>
          </Link>
          <Link href="/#contact">
            <motion.span
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-[#0057D9] text-gray-700 hover:text-[#0057D9] font-bold px-8 py-3.5 rounded-full text-sm transition-all cursor-pointer"
            >
              <Phone size={16} />
              Contact Us
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
