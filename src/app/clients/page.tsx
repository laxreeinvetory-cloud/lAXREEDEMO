"use client";

import { Quote, Star, TrendingUp, Award, MapPin, Building2 } from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import {
  CLIENT_LOGOS,
  CASE_STUDIES,
  TESTIMONIALS,
} from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Trust stats
   ───────────────────────────────────────────────────────────── */
const TRUST_STATS = [
  { value: "1,347+", label: "Projects Delivered", icon: Building2 },
  { value: "28", label: "States Covered", icon: MapPin },
  { value: "97.4%", label: "On-Time Delivery", icon: TrendingUp },
  { value: "13+", label: "National Hotel Chains", icon: Award },
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
          Section 2 — Trust stats (charcoal)
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal py-12 md:py-16">
        <div className="container-laxree">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {TRUST_STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeIn key={s.label} delay={i * 0.1}>
                  <div className="group relative overflow-hidden rounded-[16px] border border-brass/20 bg-charcoal/60 p-6 text-center transition-all duration-300 hover:border-brass/50 hover:bg-charcoal/40">
                    <div
                      aria-hidden
                      className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(198,161,91,0.12), transparent 70%)",
                      }}
                    />
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-brass/30 bg-brass/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-4 w-4 text-brass" strokeWidth={1.5} />
                    </div>
                    <div
                      className="font-mono font-medium leading-none text-brass"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                    >
                      {s.value}
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-sand">
                      {s.label}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 3 — Simple logo grid (no filter)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-16 md:py-24">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="CLIENT ROSTER"
            title="Hotels That Choose LaxRee"
            body="A selection of the hospitality brands we manufacture and supply for — from luxury chains to boutique resorts."
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {CLIENT_LOGOS.map((client, i) => (
              <FadeIn key={client.name} delay={(i % 8) * 0.05}>
                <div className="group flex h-32 items-center justify-center rounded-[16px] border border-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-brass/40 hover:shadow-xl hover:-translate-y-1">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-20 max-w-full object-contain transition-all duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span className="font-display text-[16px] font-medium text-ink-muted transition-colors duration-300 group-hover:text-ink text-center">
                      {client.name}
                    </span>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 4 — Case studies (charcoal)
          ───────────────────────────────────────────── */}
      <section className="section section-charcoal py-16 md:py-24">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="CASE STUDIES"
            title="Projects We're Proud Of"
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CASE_STUDIES.map((cs, i) => (
              <FadeIn key={cs.slug} delay={i * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-[20px] border border-brass/15 bg-charcoal/40 p-8 transition-all duration-300 hover:border-brass/40 hover:bg-charcoal/30">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent"
                  />
                  <div className="mb-6">
                    <span
                      className="font-mono font-medium leading-none text-brass"
                      style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
                    >
                      {cs.metric}
                    </span>
                    <span className="data-label ml-3 text-[12px] text-sand">
                      {cs.metricLabel}
                    </span>
                  </div>
                  <h3 className="font-display text-[22px] font-medium leading-tight text-ivory">
                    {cs.hotel}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-brass">
                    <MapPin size={12} strokeWidth={1.5} />
                    <span className="data-label text-[11px]">{cs.location}</span>
                  </div>
                  <p className="mt-4 font-body text-[16px] font-medium text-ivory">
                    {cs.project}
                  </p>
                  <p className="mt-3 font-body text-[13px] leading-relaxed text-sand">
                    {cs.scope}
                  </p>
                  <div className="mt-5 rounded-[12px] border border-brass/20 bg-brass/5 p-4">
                    <span className="data-label mb-1 block text-[10px] text-brass">
                      OUTCOME
                    </span>
                    <p className="font-body text-[13px] italic leading-relaxed text-ivory">
                      &ldquo;{cs.outcome}&rdquo;
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Section 5 — Testimonials (ivory)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-16 md:py-24">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="TESTIMONIALS"
            title="What Procurement Leaders Say"
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-[20px] border border-ink/10 bg-white p-8 transition-all duration-300 hover:border-brass/40 hover:shadow-xl hover:-translate-y-1">
                  <Quote
                    className="absolute right-6 top-6 h-12 w-12 text-brass/15 transition-colors duration-300 group-hover:text-brass/25"
                    strokeWidth={1}
                    aria-hidden
                  />
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4 w-4 fill-brass text-brass"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="relative z-10 font-body text-[15px] italic leading-relaxed text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="hairline-brass mt-6" />
                  <div className="mt-4 flex flex-col gap-1">
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
                </div>
              </FadeIn>
            ))}
          </div>
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
