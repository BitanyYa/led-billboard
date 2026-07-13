"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import NextImage from "next/image";
import { Video } from "lucide-react";
import type { GalleryItem } from "@/types/admin";

interface Props {
  items: GalleryItem[];
}

// ─── Single card ─────────────────────────────────────────────────────────────
function GalleryCard({
  item,
  index,
  inView,
}: {
  item: Pick<GalleryItem, "id" | "title" | "category" | "file_url" | "file_type">;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Media */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
        {item.file_type === "video" ? (
          <>
            <video
              src={item.file_url}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              muted
              playsInline
              loop
              onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
              onMouseLeave={(e) => {
                const v = e.currentTarget as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <Video size={10} /> Video
            </div>
          </>
        ) : (
          <NextImage
            src={item.file_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}


      </div>

      {/* Text */}
      <div className="p-6 flex-grow flex flex-col justify-start">
        <h3 className="font-heading text-[#0A1A3B] text-xl font-semibold">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function GalleryClient({ items }: Props) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="gallery" className="relative py-20 lg:py-28 xl:py-36 bg-[#F4F7FB] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 xl:mb-20"
        >
          <div className="text-[#0057D9] font-bold text-sm tracking-[0.2em] uppercase mb-3">
            IMPACT GALLERY
          </div>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl text-gray-900 tracking-tight">
            See Our <span className="text-[#0057D9]">Billboards</span> in Action
          </h2>
        </motion.div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
            {items.map((item, i) => (
              <GalleryCard key={String(item.id)} item={item} index={i} inView={inView} />
            ))}
          </div>
        ) : (
          // Fallback shown only if DB is empty and no items have been uploaded yet
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
            {[
              { id: "f1", title: "Night Vibe",         category: "Night View", file_url: "/night-vibe.png",         file_type: "image" as const },
              { id: "f2", title: "Day Light View",      category: "Day View",   file_url: "/daylight-view.png",      file_type: "image" as const },
              { id: "f3", title: "Digital Brilliance",  category: "General",    file_url: "/digital-brilliance.png", file_type: "image" as const },
            ].map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} inView={inView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
