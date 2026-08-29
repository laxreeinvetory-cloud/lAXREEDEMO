"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO_STATS, SITE } from "@/lib/laxree/site-data";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import {
  useCountUp,
  usePrefersReducedMotion,
} from "@/hooks/laxree/use-laxree-motion";

// Static fallback hero image — used when the CMS has no override.
const DEFAULT_HERO_IMAGE = "/images/hero-room.webp";

/* ───────────────────────────────────────────────────────────
   Headline word-by-word reveal
   ─────────────────────────────────────────────────────────── */

type Word = { text: string; brass?: boolean };

// Split the headline into words, tagging "Whole", "New", "World" for the brass gradient.
const HEADLINE_WORDS: Word[] = [
  "Opening",
  "Doors",
  "To",
  "A",
  { text: "Whole", brass: true },
  { text: "New", brass: true },
  { text: "World", brass: true },
  "Of",
  "Hotel",
  "Supplies",
].map((w) => (typeof w === "string" ? { text: w } : w));

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.07,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ───────────────────────────────────────────────────────────
   Stat strip — count-up numbers
   ─────────────────────────────────────────────────────────── */

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, value: current } = useCountUp(value, 1.8);
  // Format large numbers with thousands separator
  const formatted =
    value >= 1000
      ? Math.round(current).toLocaleString("en-IN")
      : Math.round(current).toString();

  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="font-mono text-brass leading-none"
        style={{ fontSize: 28, fontWeight: 500 }}
      >
        {formatted}
        <span className="text-brass-light">{suffix}</span>
      </div>
      <div
        className="data-label text-sand mt-1.5"
        style={{ fontSize: 11 }}
      >
        {label}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Hero section
   ─────────────────────────────────────────────────────────── */

export function Hero() {
  const { openModal } = useEnquiry();
  const reduced = usePrefersReducedMotion();

  // CMS-driven hero image override (key "homepage:hero" field "heroImage").
  // Falls back to the static /images/products/mini-bar.webp image when the
  // CMS has no value or the fetch fails.
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/cms?key=homepage:hero", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const override =
          data?.value && typeof data.value === "object"
            ? (data.value as { heroImage?: unknown }).heroImage
            : undefined;
        if (typeof override === "string" && override.trim()) {
          setHeroImage(override.trim());
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Always show the static hero image (3D model removed per user request).

  return (
    <section
      id="home"
      className="section section-charcoal relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: 96 }}
    >
      {/* Subtle radial brass glow centred behind the 3D stage (right column) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 65% 50%, rgba(198,161,91,0.10), transparent 55%)",
        }}
      />

      <div className="container-laxree w-full py-16 sm:py-20 lg:py-12">
        <div className="lg:grid lg:grid-cols-[55fr_45fr] lg:gap-12 xl:gap-16 items-center">
          {/* ───────── Left column ───────── */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="eyebrow text-brass"
              style={{ fontSize: 13, letterSpacing: "0.2em" }}
            >
              Hotel Supplies Redefined
            </motion.span>

            {/* Headline */}
            <h1
              className="mt-5 font-display text-ivory"
              style={{
                fontWeight: 600,
                fontSize: "clamp(2.75rem, 6vw, 5.25rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
              }}
            >
              {HEADLINE_WORDS.map((w, i) => (
                <motion.span
                  key={`${w.text}-${i}`}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                  style={{ whiteSpace: "pre" }}
                >
                  <span className={w.brass ? "text-brass-gradient" : ""}>
                    {w.text}
                  </span>
                  {i < HEADLINE_WORDS.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + HEADLINE_WORDS.length * 0.07 + 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 font-body text-sand"
              style={{ fontSize: 18, maxWidth: 480, lineHeight: 1.55 }}
            >
              Premium hotel &amp; resort amenities, furniture, linen, roofing
              and lighting — manufactured and supplied pan-India by LaxRee,
              IndiaIndia&apos;s largest Hotel Supplier Experience Centerapos;s largest Hotel Supplier Experience Center.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + HEADLINE_WORDS.length * 0.07 + 0.25,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/products"
                className="pill pill-brass text-[13px] px-6 py-3 gap-2"
              >
                Explore Products
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={() => openModal("enquiry")}
                className="pill pill-ghost-ivory text-[13px] px-6 py-3 cursor-pointer"
              >
                Get a Quotation
              </button>
            </motion.div>

            {/* Glass stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + HEADLINE_WORDS.length * 0.07 + 0.4,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 glass-on-charcoal card-24 px-6 py-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
                {HERO_STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={[
                      // On sm+, add a left divider for items after the first
                      i > 0 ? "sm:pl-6 sm:relative" : "",
                      "flex justify-center sm:justify-start",
                    ].join(" ")}
                  >
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-brass/30"
                      />
                    )}
                    <StatItem
                      value={stat.value}
                      suffix={stat.suffix}
                      label={stat.label}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ───────── Right column — 3D stage ───────── */}
          <div className="mt-14 lg:mt-0 flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: "min(520px, 100%)",
                aspectRatio: "1 / 1",
                maxWidth: 520,
                maxHeight: 520,
              }}
            >
              {/* Soft brass halo behind the stage */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(198,161,91,0.25), transparent 60%)",
                }}
              />

              <HeroFallback src={heroImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────
   Static fallback for mobile / reduced-motion
   ─────────────────────────────────────────────────────────── */

function HeroFallback({ src }: { src: string }) {
  // Premium hero image display — fills the stage with object-cover for
  // an immersive look. Brass border + shadow for premium feel.
  return (
    <div className="w-full h-full rounded-[24px] overflow-hidden border-2 border-brass/20 bg-charcoal/60 shadow-2xl shadow-brass/10 relative">
      <img
        src={src}
        alt="LaxRee Amenities — Premium Hotel Room"
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Subtle gradient overlay at bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
      {/* Brass top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent pointer-events-none" />
    </div>
  );
}

export default Hero;
