"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/laxree/use-laxree-motion";

/**
 * OwnerMessage — Founder's message section.
 * Shows the owner's photo, name, role, and a short personal message
 * about LaxRee's commitment to hospitality quality.
 *
 * Charcoal section with a two-column layout:
 * - Left: owner photo in a brass-bordered circular frame
 * - Right: heading, quote, signature, and name/role
 */
export function OwnerMessage() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="section section-charcoal py-20 md:py-28">
      <div className="container-laxree">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* ─── Left: Owner photo ─── */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Brass ring frame */}
              <div
                aria-hidden
                className="absolute -inset-3 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #C6A15B, #E4C989, #C6A15B, #8a6f3e, #C6A15B)",
                  opacity: 0.5,
                  filter: "blur(8px)",
                }}
              />
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-brass/40 bg-charcoal">
                <img
                  src="/images/owner-cropped.jpg"
                  alt="Ashish Agarwal — Founder & Managing Director, LaxRee Amenities"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Brass dot accent */}
              <span
                aria-hidden
                className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-brass border-2 border-charcoal"
              />
            </div>
          </motion.div>

          {/* ─── Right: Message ─── */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <span className="eyebrow text-brass mb-4">
              Founder's Message
            </span>

            <Quote
              className="h-8 w-8 text-brass/40 mb-4"
              strokeWidth={1.5}
              aria-hidden
            />

            <blockquote
              className="font-display text-ivory leading-relaxed"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 400 }}
            >
              &ldquo;For eleven years, we have opened doors for hotels across
              India — not just with products, but with a promise. Every minibar
              we manufacture, every safe we assemble, every piece of furniture
              we craft carries the same standard: <span className="text-brass-gradient">quality you can audit,
              durability you can trust, and service that never sleeps.</span> At
              LaxRee, we don&apos;t just supply hotels — we partner with them.&rdquo;
            </blockquote>

            {/* Signature + name */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 max-w-20 bg-brass/30" />
              <div>
                <div
                  className="font-display text-ivory"
                  style={{ fontSize: "1.25rem", fontWeight: 500 }}
                >
                  Ashish Agarwal
                </div>
                <div className="data-label text-[11px] text-brass mt-1">
                  Founder &amp; Managing Director
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default OwnerMessage;
