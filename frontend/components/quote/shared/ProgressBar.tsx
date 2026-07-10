"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { StepMeta } from "@/types/quote";

interface ProgressBarProps {
  steps: StepMeta[];
  currentStep: number; // 1-based
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Step dots + connectors */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />

        {/* Animated progress line */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[#0057D9] to-[#1E73FF] z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: (currentStep - 1) / (steps.length - 1),
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
        />

        {steps.map((step) => {
          const isDone    = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              {/* Circle */}
              <motion.div
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isDone
                    ? "#0057D9"
                    : isCurrent
                    ? "#0057D9"
                    : "#E5E7EB",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                style={{
                  backgroundColor: isDone || isCurrent ? "#0057D9" : "#E5E7EB",
                }}
              >
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <Check size={16} className="text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span
                    className={`text-sm font-bold font-heading ${
                      isCurrent ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </motion.div>

              {/* Label — hidden on small screens for space */}
              <div className="hidden sm:flex flex-col items-center">
                <span
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isCurrent
                      ? "text-[#0057D9]"
                      : isDone
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: current step label */}
      <div className="sm:hidden mt-4 text-center">
        <span className="text-sm font-semibold text-[#0057D9]">
          Step {currentStep} of {steps.length}:{" "}
          {steps[currentStep - 1]?.title}
        </span>
      </div>
    </div>
  );
}
