
import { Quote } from "lucide-react";
import {
  CLIENT_LOGOS,
  TESTIMONIALS,
  type Testimonial,
} from "@/lib/laxree/site-data";

/**
 * Section 8 — CLIENTS & TESTIMONIALS
 * Ivory section with:
 *   - centered header (eyebrow + Fraunces headline + supporting copy)
 *   - full-width logo marquee (CLIENT_LOGOS duplicated 2x for seamless loop,
 *     .animate-marquee-slow, pause-on-hover via .marquee-pause)
 *   - 3 glass testimonial cards gently floating on staggered phases via
 *     .animate-float + negative inline animationDelay per card so they never
 *     sync. Reduced-motion is handled by the global CSS media query.
 */
const FLOAT_DELAYS = [0, -1.3, -2.6]; // negative => staggered phase from t=0

export default function ClientsTestimonials() {
  return (
    <section id="clients" className="section section-ivory py-28 md:py-36">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="container-laxree">
        <div className="text-center">
          <span className="eyebrow text-ink-muted">Clients</span>
          <h2
            className="mt-4 text-ink"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Trusted by the Best in Hospitality
          </h2>
          <p
            className="mt-5 mx-auto text-ink-muted"
            style={{ maxWidth: 720 }}
          >
            Proudly serving India&apos;s most prestigious hotel chains, LaxRee
            Amenities is trusted by hospitality leaders for our unmatched
            quality, innovation, and service.
          </p>
        </div>
      </div>

      {/* ── Full-width logo marquee ────────────────────────── */}
      <div
        className="marquee-pause mt-14 w-full overflow-hidden"
        style={{ height: 80 }}
        role="list"
        aria-label="Hotel client logos"
      >
        <div className="flex w-max animate-marquee-slow will-change-transform">
          {/* Copy 1 */}
          <div className="flex shrink-0">
            {CLIENT_LOGOS.map((logo) => (
              <div
                key={`c1-${logo}`}
                className="px-8 flex items-center shrink-0"
                role="listitem"
              >
                <span className="font-display text-[22px] leading-none text-ink-muted/40 hover:text-ink grayscale hover:grayscale-0 transition-all duration-300 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </div>
          {/* Copy 2 — duplicate for seamless loop (hidden from AT) */}
          <div className="flex shrink-0" aria-hidden>
            {CLIENT_LOGOS.map((logo) => (
              <div
                key={`c2-${logo}`}
                className="px-8 flex items-center shrink-0"
              >
                <span className="font-display text-[22px] leading-none text-ink-muted/40 hover:text-ink grayscale hover:grayscale-0 transition-all duration-300 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating glass testimonial cards ──────────────── */}
      <div className="container-laxree">
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {TESTIMONIALS.map((t: Testimonial, i: number) => (
            <article
              key={t.name}
              className="glass-on-ivory card-24 p-8 animate-float"
              style={{
                animationDelay: `${FLOAT_DELAYS[i] ?? 0}s`,
              }}
            >
              <Quote
                size={32}
                className="text-brass"
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="mt-5 text-ink italic text-[15px] leading-relaxed">
                {t.quote}
              </p>
              <div className="hairline-brass my-6" />
              <h3 className="font-display text-[16px] text-ink leading-tight">
                {t.name}
              </h3>
              <p className="data-label text-[11px] text-ink-muted mt-2">
                {t.role}
              </p>
              <p className="data-label text-[11px] text-brass mt-1">
                {t.hotel}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
