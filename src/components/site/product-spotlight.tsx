"use client";

/**
 * LaxRee Amenities — Product Spotlight (Section 6)
 * A horizontally draggable 3D coverflow carousel of 9 spotlight products.
 * Ivory section. Active card is flat + scaled to 1; side cards rotateY ±25°
 * and scale 0.82. Cards 2+ away fade to 0.3 opacity. Brass arrow buttons
 * advance ±1. Mobile / reduced-motion: horizontal snap-scroll fallback.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SPOTLIGHT_PRODUCTS, type Product } from "@/lib/laxree/site-data";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

const CARD_WIDTH = 280;
const CARD_HEIGHT = 360;
const SPACING = 220;
const DRAG_THRESHOLD = 50;
const MAX_VISIBLE_OFFSET = 3;

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

function ProductCard({ product, active }: { product: Product; active: boolean }) {
  return (
    <Link
      href="/products/amenities"
      aria-label={`${product.name} — view category`}
      className={`group card-20 overflow-hidden bg-white h-full w-full flex flex-col border-2 transition-shadow duration-300 ${
        active ? "border-brass shadow-2xl" : "border-transparent shadow-md"
      }`}
    >
      {/* Product image — 60% of card height, object-cover on charcoal bg */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "60%", backgroundColor: "var(--color-charcoal)" }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle brass corner accent on active card */}
        {active && (
          <div
            aria-hidden
            className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-brass animate-pulse-glow"
          />
        )}
      </div>

      {/* Caption */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <span
          className="font-mono uppercase text-ink-muted"
          style={{ fontSize: 10, letterSpacing: "0.18em" }}
        >
          {product.category}
        </span>
        <h3
          className="font-display text-ink"
          style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}
        >
          {product.name}
        </h3>
        <span
          className="font-mono text-brass uppercase group-hover:text-brass-light transition-colors"
          style={{ fontSize: 12, letterSpacing: "0.08em" }}
        >
          View Category →
        </span>
      </div>
    </Link>
  );
}

export function ProductSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const useFallback = reduced || isMobile;
  const total = SPOTLIGHT_PRODUCTS.length;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD) {
      setActiveIndex((i) => Math.min(total - 1, i + 1));
    } else if (info.offset.x > DRAG_THRESHOLD) {
      setActiveIndex((i) => Math.max(0, i - 1));
    }
  };

  const goNext = () => setActiveIndex((i) => Math.min(total - 1, i + 1));
  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));

  return (
    <section id="products" className="section section-ivory py-28 md:py-36">
      <div className="container-laxree">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow text-ink-muted mb-3">EXPLORE</div>
          <h2
            className="font-display text-ink font-medium"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Our Latest Offerings
          </h2>
          <p className="text-ink-muted mt-4 max-w-xl mx-auto text-base">
            Nine flagship products from the LaxRee factory floor — drag, tap
            the arrows, or click any card to bring it center-stage.
          </p>
        </div>

        {useFallback ? (
          /* ── Mobile / reduced-motion fallback: horizontal snap-scroll ── */
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
            {SPOTLIGHT_PRODUCTS.map((product, i) => (
              <div
                key={product.slug}
                className="snap-center shrink-0"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                <ProductCard product={product} active={i === activeIndex} />
              </div>
            ))}
          </div>
        ) : (
          /* ── Desktop coverflow stage ── */
          <>
            <div
              className="relative"
              style={{
                height: CARD_HEIGHT + 80,
                perspective: "1600px",
              }}
            >
              <motion.div
                className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
              >
                {SPOTLIGHT_PRODUCTS.map((product, i) => {
                  const offset = i - activeIndex;
                  const absOffset = Math.abs(offset);
                  const isActive = absOffset === 0;

                  const baseTranslate = offset * SPACING;
                  const extraPush =
                    absOffset > 1
                      ? Math.sign(offset) * (absOffset - 1) * 30
                      : 0;
                  const translateX = baseTranslate + extraPush;
                  const rotateY =
                    offset === 0 ? 0 : offset > 0 ? -25 : 25;
                  const scale = isActive ? 1 : 0.82;
                  const opacity =
                    absOffset > 2
                      ? 0.3
                      : absOffset > 1
                      ? 0.55
                      : absOffset > 0
                      ? 0.85
                      : 1;
                  const zIndex = 20 - absOffset;

                  return (
                    <motion.div
                      key={product.slug}
                      className="absolute"
                      style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                        left: "50%",
                        top: "50%",
                        zIndex,
                        pointerEvents:
                          absOffset > MAX_VISIBLE_OFFSET ? "none" : "auto",
                      }}
                      initial={false}
                      animate={{
                        x: -CARD_WIDTH / 2 + translateX,
                        y: -CARD_HEIGHT / 2,
                        rotateY,
                        scale,
                        opacity,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 30,
                      }}
                      onTap={() => {
                        if (!isActive) setActiveIndex(i);
                      }}
                    >
                      <ProductCard product={product} active={isActive} />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Controls — brass arrows + index indicator */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                aria-label="Previous product"
                className="w-11 h-11 rounded-full border border-brass/40 text-brass flex items-center justify-center transition-all duration-300 hover:bg-brass hover:text-charcoal hover:border-brass disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brass"
              >
                <ChevronLeft size={20} />
              </button>

              <span
                className="font-mono text-ink-muted tabular-nums min-w-[68px] text-center"
                style={{ fontSize: 13, letterSpacing: "0.12em" }}
              >
                <span className="text-ink">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5">/</span>
                {String(total).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={goNext}
                disabled={activeIndex === total - 1}
                aria-label="Next product"
                className="w-11 h-11 rounded-full border border-brass/40 text-brass flex items-center justify-center transition-all duration-300 hover:bg-brass hover:text-charcoal hover:border-brass disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brass"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dot rail */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {SPOTLIGHT_PRODUCTS.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to ${p.name}`}
                  aria-current={i === activeIndex}
                  className="p-1.5 group/dot"
                >
                  <span
                    className={`block transition-all duration-300 rounded-full ${
                      i === activeIndex
                        ? "w-6 h-1.5 bg-brass"
                        : "w-1.5 h-1.5 bg-ink-muted/30 group-hover/dot:bg-brass/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProductSpotlight;
