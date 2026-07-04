"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

const ABOUT_COPY =
  "At LaxRee Amenities, we specialize in Premium Hotel & Resort Amenities designed to enhance guest comfort and elevate hospitality standards. Trusted by leading hotels across India, we are committed to quality, innovation, and timely service. With a focus on durability, aesthetics, and guest satisfaction, LaxRee is the preferred partner for hospitality professionals seeking excellence in every detail.";

const ABOUT_CHIPS = [
  "OEM Manufacturer — Minibar & Safe Locker",
  "Ajmer's Largest Hospitality Exhibition Centre",
  "Pan-India Delivery",
];

export function AboutUs() {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Parallax: as the section scrolls through the viewport, the inner image
  // translates from -8% → +8%. Image is scaled 1.1 so edges never reveal.
  const { scrollYProgress } = useScroll({
    target: imageWrapRef,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const y = useSpring(yRaw, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <section id="about" className="section section-charcoal py-28 md:py-36">
      <div className="container-laxree">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ───────── Left column (45% — lg:col-span-5) ───────── */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="eyebrow text-brass"
            >
              Who We Are
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
              className="mt-5 font-display text-5xl text-ivory md:text-6xl"
            >
              About Us
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="mt-6 max-w-[520px] font-sans text-[17px] leading-relaxed text-sand"
            >
              {ABOUT_COPY}
            </motion.p>

            {/* Glass chips */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {ABOUT_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="glass-on-charcoal rounded-full px-4 py-2 font-mono text-xs text-sand"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* Brass outline pill CTA */}
            <motion.a
              href="#about"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
              className="pill pill-ghost-brass mt-10 self-start px-6 py-3 text-xs"
            >
              Know More
              <ArrowRight className="ml-2 h-3.5 w-3.5" strokeWidth={1.75} />
            </motion.a>
          </div>

          {/* ───────── Right column (55% — lg:col-span-7) ───────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div
              ref={imageWrapRef}
              className="relative h-[480px] w-full overflow-hidden rounded-24px sm:h-[560px] md:h-[640px]"
            >
              {/* Parallax image — scaled 1.1 so the ±8% translate never reveals edges */}
              <motion.img
                src="/images/about/factory.png"
                alt="LaxRee Amenities manufacturing facility in Ajmer, Rajasthan"
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                style={reduced ? undefined : { y }}
                className="absolute inset-0 h-full w-full scale-110 object-cover"
              />

              {/* Soft top vignette to seat the glass card */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/20" />

              {/* Floating glass stat card — bottom-left */}
              <div className="glass-on-charcoal absolute bottom-6 left-6 rounded-2xl p-5">
                <div className="font-mono text-[32px] leading-none text-brass">
                  11+
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sand">
                  Years Industry Experience
                </div>
              </div>

              {/* Subtle brass corner accent */}
              <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2">
                <span className="block h-1.5 w-1.5 rounded-full bg-brass animate-pulse-glow" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ivory/70">
                  Ajmer · Rajasthan
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
