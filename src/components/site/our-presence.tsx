"use client";

import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EXHIBITIONS, type Exhibition } from "@/lib/laxree/site-data";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

/**
 * Section 9 — OUR PRESENCE (Exhibition coverflow gallery)
 * Charcoal section. Same interaction family as the product spotlight
 * carousel (section 6) but images-only.
 *
 * - Centered header (eyebrow brass + Fraunces ivory headline + sand body)
 * - 5 exhibition photos in a perspective(1600px) stage
 * - Active slide centered + flat; ±1 neighbors scale 0.82 + rotateY ±25°;
 *   ±2 neighbors hidden (opacity 0) so only 3 are visible at any time.
 * - Framer Motion `drag="x"` swipe with threshold + arrow buttons.
 * - Reduced-motion: rotateY is dropped (still layered scale/opacity, but
 *   no 3D rotation); spring transition remains snappy.
 */
const DRAG_THRESHOLD = 60;

export default function OurPresence() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const total = EXHIBITIONS.length;

  const goTo = (i: number) => setActiveIndex(((i % total) + total) % total);
  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD) next();
    else if (info.offset.x > DRAG_THRESHOLD) prev();
  };

  return (
    <section id="presence" className="section section-charcoal py-28 md:py-36">
      <div className="container-laxree">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center">
          <span className="eyebrow text-brass">Our Presence</span>
          <h2
            className="mt-4 text-ivory"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Connecting with Hospitality
          </h2>
          <p className="mt-5 mx-auto text-sand" style={{ maxWidth: 640 }}>
            LaxRee proudly showcases its innovations at leading hospitality
            exhibitions across the country.
          </p>
        </div>

        {/* ── Coverflow stage ────────────────────────────────── */}
        <div className="mt-16">
          <div className="relative">
            <motion.div
              className="relative mx-auto w-full max-w-[960px] aspect-video cursor-grab active:cursor-grabbing"
              style={{ perspective: "1600px" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
            >
              {EXHIBITIONS.map((ex: Exhibition, i: number) => {
                const offset = i - activeIndex;
                // Shortest signed offset for a 5-item carousel → [-2, 2]
                const norm = ((offset + total + 2) % total) - 2;
                const absNorm = Math.abs(norm);
                const isActive = norm === 0;

                const targetX = `${norm * 26}%`;
                const targetScale = absNorm === 0 ? 1 : absNorm === 1 ? 0.82 : 0.7;
                const targetRotateY = reduced
                  ? 0
                  : norm === 0
                    ? 0
                    : norm > 0
                      ? -25
                      : 25;
                const targetOpacity = absNorm === 0 ? 1 : absNorm === 1 ? 0.55 : 0;
                const targetZ = absNorm === 0 ? 30 : absNorm === 1 ? 20 : 10;

                return (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={false}
                    animate={{
                      x: targetX,
                      scale: targetScale,
                      rotateY: targetRotateY,
                      opacity: targetOpacity,
                      zIndex: targetZ,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 30,
                      opacity: { duration: 0.3 },
                    }}
                  >
                    <div className="relative w-full h-full card-24 overflow-hidden bg-charcoal">
                      <img
                        src={ex.image}
                        alt={`${ex.caption} — ${ex.year}`}
                        loading="lazy"
                        width={960}
                        height={540}
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                      />
                      {/* Active-slide caption (charcoal gradient for legibility) */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent pointer-events-none">
                          <span className="data-label text-[11px] text-ivory">
                            {ex.caption} · {ex.year}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Arrow controls */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous exhibition"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full glass-on-charcoal flex items-center justify-center text-ivory hover:text-brass hover:border-brass/40 transition-colors"
            >
              <ChevronLeft size={22} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next exhibition"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full glass-on-charcoal flex items-center justify-center text-ivory hover:text-brass hover:border-brass/40 transition-colors"
            >
              <ChevronRight size={22} strokeWidth={1.75} />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="mt-8 flex justify-center gap-2">
            {EXHIBITIONS.map((ex, i) => {
              const isCurrent = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${ex.caption} ${ex.year}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-8 bg-brass"
                      : "w-1.5 bg-sand/30 hover:bg-sand/60"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
