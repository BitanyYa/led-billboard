"use client";

import { motion } from "framer-motion";

interface StepWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  direction: 1 | -1; // 1 = forward, -1 = backward
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

export default function StepWrapper({
  title,
  description,
  children,
  direction,
}: StepWrapperProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Step header */}
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">{description}</p>
      </div>

      {children}
    </motion.div>
  );
}
