"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import AwloAdvert from "@/components/AwloAdvert";

// Highly relevant LED billboard / outdoor advertising videos
const galleryImages = [
  {
    id: 1,
    title: "Bole Road Junction",
    description: "Maximum peak hour exposure in the business district.",
    src: "/bole-road.png",
  },
  {
    id: 2,
    title: "Mexico Square",
    description: "High traffic pedestrian and commuter crossing.",
    src: "/mexico-square.png",
  },
  {
    id: 3,
    title: "Megenagna Interchange",
    description: "Long-distance visibility for transit traffic.",
    src: "/megenagna.png",
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="gallery" className="relative py-20 lg:py-28 bg-[#F4F7FB] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="text-[#0057D9] font-bold text-sm tracking-[0.2em] uppercase mb-3">
            IMPACT GALLERY
          </div>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 tracking-tight">
            See Our <span className="text-[#0057D9]">Billboards</span> in Action
          </h2>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{
                y: -5,
              }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
                <img
                  src={img.src}
                  alt={img.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Body */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-start">
                <h3 className="font-heading text-[#0A1A3B] text-xl font-semibold mb-2">
                  {img.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {img.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


