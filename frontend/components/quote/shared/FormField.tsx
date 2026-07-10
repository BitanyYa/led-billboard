"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

export default function FormField({
  label,
  required,
  error,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-[#0057D9] ml-0.5">*</span>}
      </label>

      {children}

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-xs font-medium"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-xs"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ── Reusable input className builder ──────────────────────────
export function inputCn(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-white",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20",
  ].join(" ");
}
