"use client";

import { CERTIFICATIONS_MARQUEE } from "@/lib/laxree/site-data";

/**
 * Trust / Certification marquee — emerald band, ivory text, infinitely
 * scrolling list of certifications separated by small brass diamond glyphs.
 *
 * The track is duplicated 4× so the loop never shows a gap, and the
 * `animate-marquee` keyframe translates the track from 0 → -50%, which
 * means we only ever see the first half (two full copies).
 *
 * The `.marquee-pause` class pauses the animation on hover. The CSS media
 * query inside globals.css already disables animation under
 * `prefers-reduced-motion: reduce` — we just make sure the layout still
 * holds together (overflow-hidden strip).
 */
export function TrustMarquee() {
  // Duplicate the items 4× — guarantees ≥ 200% track width so the loop
  // is seamless, and renders fine even with reduced-motion (the extra
  // copies just overflow off-screen).
  const items = [
    ...CERTIFICATIONS_MARQUEE,
    ...CERTIFICATIONS_MARQUEE,
    ...CERTIFICATIONS_MARQUEE,
    ...CERTIFICATIONS_MARQUEE,
  ];

  return (
    <div
      role="region"
      aria-label="Certifications and trust signals"
      className="section-emerald relative w-full overflow-hidden"
      style={{ height: 56, backgroundColor: "#1E4638" }}
    >
      {/* Edge fade masks for a cleaner look */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{
          width: 64,
          background:
            "linear-gradient(90deg, #1E4638 0%, rgba(30,70,56,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{
          width: 64,
          background:
            "linear-gradient(270deg, #1E4638 0%, rgba(30,70,56,0) 100%)",
        }}
      />

      <div className="marquee-pause h-full">
        <div className="animate-marquee flex items-center h-full whitespace-nowrap will-change-transform">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center h-full"
            >
              <span
                className="data-label text-ivory"
                style={{
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  paddingInline: 20,
                }}
              >
                {item}
              </span>
              {/* Brass diamond glyph */}
              <span
                aria-hidden
                className="block w-[8px] h-[8px] rotate-45 bg-brass shrink-0"
                style={{ marginRight: 4 }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrustMarquee;
