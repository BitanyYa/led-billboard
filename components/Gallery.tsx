"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

// Highly relevant LED billboard / outdoor advertising videos
const galleryImages = [
  {
    id: 1,
    title: "Digital Billboard at Night",
    description: "LED display shining bright in the evening cityscape",
    aspect: "wide",
    src: "https://assets.mixkit.co/videos/preview/mixkit-modern-city-at-night-with-light-trails-of-traffic-4835-large.mp4",
  },
  {
    id: 2,
    title: "Urban Outdoor Advertising",
    description: "Large format digital screen dominating city skyline",
    aspect: "tall",
    src: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-on-a-busy-avenue-at-night-4217-large.mp4",
  },
  {
    id: 3,
    title: "LED Screen Close-up",
    description: "Vibrant pixel-perfect LED panel up close",
    aspect: "wide",
    src: "https://assets.mixkit.co/videos/preview/mixkit-night-city-with-traffic-and-illuminated-buildings-4166-large.mp4",
  },
  {
    id: 4,
    title: "Roadside Billboard",
    description: "Prime road-facing billboard capturing commuter attention",
    aspect: "tall",
    src: "https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-highway-at-night-with-city-lights-in-the-4171-large.mp4",
  },
  {
    id: 5,
    title: "City Digital Signage",
    description: "Multiple digital screens in a high-traffic commercial district",
    aspect: "wide",
    src: "https://assets.mixkit.co/videos/preview/mixkit-busy-highway-in-the-city-at-night-4165-large.mp4",
  },
  {
    id: 6,
    title: "Advertising Technology",
    description: "Modern LED display technology for high-impact campaigns",
    aspect: "tall",
    src: "https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-busy-intersection-at-night-4168-large.mp4",
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="gallery" className="relative py-24 lg:py-32 bg-blue-theme-alt grid-pattern overflow-hidden">
      {/* Decorative gradient overlay blurs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#0057D9]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-[#FFD400]/5 rounded-full blur-[120px] pointer-events-none" />

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
            Gallery
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6 tracking-tight">
            See Our <span className="text-[#0057D9]">Billboard</span> in Action
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Get a closer look at our LED billboard, from day to night, and see how
            your advertisement could look displayed at this prime location.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95, y: 40, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: i * 0.08, duration: 0.7, type: "spring", stiffness: 100, damping: 18 }}
              whileHover={{ 
                y: -6,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12)"
              }}
              className={`group relative overflow-hidden rounded-3xl bg-white border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
                ${img.aspect === "wide" ? "sm:col-span-2 lg:col-span-1" : ""}
                ${i % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
              `}
            >
              {/* Inner zoom container */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden relative h-full w-full"
              >
                <div className={`relative h-full w-full ${img.aspect === "wide" ? "aspect-video" : "aspect-[4/5]"} ${
                    i % 5 === 0 ? "lg:aspect-square" : ""
                  }`}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={img.src}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* LED grid overlay (subtle effect on photos) */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "6px 6px",
                    }}
                  />
                </div>
              </motion.div>

              {/* Hover overlay outside zoom logic for layout stability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-10">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block bg-[#FFD400] text-gray-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3 shadow-md">
                    AWLO DISPLAY
                  </span>
                  <h3 className="font-heading font-extrabold text-white text-lg mb-1 tracking-tight">
                    {img.title}
                  </h3>
                  <p className="text-white/70 text-xs font-light">{img.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2.5 bg-[#F0F5FF]/70 backdrop-blur-xl border border-white/40 rounded-full px-6 py-3 shadow-sm"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0057D9] animate-pulse" />
            <span className="text-gray-600 text-sm font-medium">
              Real billboard videos shown as examples
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


