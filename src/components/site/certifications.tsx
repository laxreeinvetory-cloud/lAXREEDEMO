"use client";

import { CERTIFICATIONS, type Certification } from "@/lib/laxree/site-data";

/**
 * Section 10 — CERTIFICATIONS (3D Badge Wall)
 * Ivory section, shorter padding (py-20 md:py-24).
 *
 * Five brass-ringed medallions in a row. State-free CSS-only 360° Y-axis
 * flip on hover:
 *   - Outer `.group` parent holds `perspective: 1000px`
 *   - Inner `.medallion-inner` carries the `transition-transform`
 *     `duration-[600ms] ease-in-out` + `group-hover:[transform:rotateY(180deg)]`
 *   - Two absolutely-positioned faces share `backface-visibility: hidden`
 *     Front face shows the short code + "CERTIFIED" caption.
 *     Back face is pre-rotated 180° so it reads correctly when flipped,
 *     showing the full certification name.
 *
 * Reduced-motion: the global CSS media query collapses transitions to 0.001ms,
 * so the flip becomes an instant swap — still functional, just not animated.
 */
export default function Certifications() {
  return (
    <section
      id="certifications"
      className="section section-ivory py-20 md:py-24"
    >
      <div className="container-laxree">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center">
          <span className="eyebrow text-ink-muted">Certifications</span>
          <h2
            className="mt-4 text-ink"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Commitment to Quality
          </h2>
          <p
            className="mt-5 mx-auto text-ink-muted"
            style={{ maxWidth: 720 }}
          >
            ISO 9001, ISO 14001, ISO 45001, CE and RoHS — global recognitions
            of our commitment to quality, sustainability and safety.
          </p>
        </div>

        {/* ── Badge medallions ───────────────────────────────── */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
          {CERTIFICATIONS.map((cert: Certification) => (
            <div
              key={cert.code}
              className="group"
              style={{ perspective: "1000px" }}
            >
              <div
                className="medallion-inner relative w-24 h-24 rounded-full border-2 border-brass bg-gradient-to-b from-white to-ivory [transform:rotateY(0deg)] [transform-style:preserve-3d] transition-transform duration-[600ms] ease-in-out group-hover:[transform:rotateY(180deg)]"
              >
                {/* Front face — code + CERTIFIED */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center px-2"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <span className="font-display text-[13px] font-medium text-ink leading-tight text-center">
                    {cert.code}
                  </span>
                  <span className="data-label text-[8px] text-ink-muted mt-1">
                    Certified
                  </span>
                </div>

                {/* Back face — full name (pre-rotated 180°) */}
                <div
                  className="absolute inset-0 flex items-center justify-center px-2 text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="font-display text-[11px] font-medium text-ink leading-tight">
                    {cert.fullName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
