import type { Metadata } from "next";
import { Quote } from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import {
  CLIENT_LOGOS,
  CASE_STUDIES,
  TESTIMONIALS,
} from "@/lib/laxree/site-data";

export const metadata: Metadata = {
  title: "Clients — LaxRee Amenities | Trusted by India's Best Hospitality Brands",
  description:
    "1,347+ hotel projects delivered across 28 states. See the hotel chains that choose LaxRee, real case studies, and what procurement leaders say about us.",
  keywords: [
    "LaxRee clients",
    "hotel supply case studies",
    "hospitality procurement India",
    "hotel amenities supplier reviews",
    "resort renovation supplier",
  ],
};

/* ─────────────────────────────────────────────────────────────
   Section 5 — Trust stats (charcoal strip)
   ───────────────────────────────────────────────────────────── */
const TRUST_STATS = [
  { value: "1,347+", label: "Projects Delivered" },
  { value: "28", label: "States Covered" },
  { value: "97.4%", label: "On-Time Delivery" },
  { value: "9", label: "National Hotel Chains" },
];

export default function ClientsPage() {
  return (
    <>
      {/* ─────────────────────────────────────────────
          Section 1 — PageHero (charcoal)
          ───────────────────────────────────────────── */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clients" }]}
        eyebrow="OUR CLIENTS"
        title="Trusted by the Best in Hospitality"
        subtitle="Proudly serving India's most prestigious hotel chains — from heritage properties to new-build resorts. 1,347+ projects delivered across 28 states."
      />

      {/* ─────────────────────────────────────────────
          Section 2 — Client logo grid (ivory)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="CLIENT ROSTER"
            title="Hotels That Choose LaxRee"
            body="A selection of the hospitality brands we manufacture and supply for."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {CLIENT_LOGOS.map((name, i) => (
              <FadeIn key={name} delay={(i % 4) * 0.05}>
                <div className="group h-full">
                  <GlassCard
                    theme="ivory"
                    radius="20px"
                    className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 p-8 transition-all duration-300 hover:border-brass/60"
                  >
                    {/* Brass diamond glyph */}
                    <span
                      aria-hidden
                      className="text-brass transition-transform duration-300 group-hover:scale-110"
                      style={{ fontSize: "14px", lineHeight: 1 }}
                    >
                      ◆
                    </span>
                    <span className="font-display text-ink-muted text-[18px] leading-tight text-center transition-colors duration-300 group-hover:text-ink">
                      {name}
                    </span>
                  </GlassCard>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 3 — Case studies (charcoal)
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="CASE STUDIES"
            title="Projects We're Proud Of"
          />

          <div className="mt-12 flex flex-col gap-6">
            {CASE_STUDIES.map((cs, i) => (
              <FadeIn key={cs.slug} delay={i * 0.08}>
                <GlassCard theme="charcoal" radius="24px" className="p-8 md:p-10">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] md:gap-12">
                    {/* Left — metric */}
                    <div className="flex flex-col justify-center md:border-r md:border-white/10 md:pr-8">
                      <span
                        className="font-mono font-medium leading-none text-brass"
                        style={{ fontSize: "56px" }}
                      >
                        {cs.metric}
                      </span>
                      <span className="data-label mt-3 text-[12px] text-sand">
                        {cs.metricLabel}
                      </span>
                    </div>

                    {/* Right — details */}
                    <div className="flex flex-col gap-3">
                      <h3 className="font-display text-[24px] font-medium leading-tight text-ivory">
                        {cs.hotel}
                      </h3>
                      <span className="data-label text-[12px] text-brass">
                        {cs.location}
                      </span>
                      <p className="mt-1 font-body text-[16px] font-medium text-ivory">
                        {cs.project}
                      </p>
                      <p className="font-body text-[14px] leading-relaxed text-sand">
                        <span className="data-label mr-2 text-[11px] text-brass/80">
                          SCOPE
                        </span>
                        {cs.scope}
                      </p>
                      <p className="font-body text-[14px] leading-relaxed text-sand italic">
                        <span className="data-label mr-2 not-italic text-[11px] text-brass/80">
                          OUTCOME
                        </span>
                        {cs.outcome}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 4 — Testimonials (ivory)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="TESTIMONIALS"
            title="What Procurement Leaders Say"
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <GlassCard
                  theme="ivory"
                  radius="24px"
                  className="flex h-full flex-col gap-5 p-8"
                >
                  <Quote
                    className="h-8 w-8 text-brass"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <p className="font-body text-[15px] italic leading-relaxed text-ink">
                    “{t.quote}”
                  </p>
                  <div className="hairline-brass mt-auto" />
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-[16px] font-medium text-ink">
                      {t.name}
                    </span>
                    <span className="data-label text-[11px] text-ink-muted">
                      {t.role}
                    </span>
                    <span className="data-label text-[11px] text-brass">
                      {t.hotel}
                    </span>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 5 — Trust stats (charcoal strip)
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal py-16 md:py-20">
        <div className="container-laxree">
          <FadeIn>
            <GlassCard
              theme="charcoal"
              radius="24px"
              className="grid grid-cols-2 gap-6 p-8 md:grid-cols-4 md:p-10"
            >
              {TRUST_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="font-mono font-medium leading-none text-brass"
                    style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
                  >
                    {s.value}
                  </span>
                  <span className="data-label mt-3 text-[11px] text-sand">
                    {s.label}
                  </span>
                </div>
              ))}
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 6 — PageCTA (emerald)
          ───────────────────────────────────────────── */}
      <PageCTA
        title="Join 1,347+ satisfied hotel projects"
        subtitle="Let's discuss your next renovation or new-build."
      />
    </>
  );
}
