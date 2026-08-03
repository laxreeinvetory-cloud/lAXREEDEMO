"use client";

import { useState } from "react";
import { Quote, Star, TrendingUp, Award, Users, MapPin, Building2, Hotel, Utensils, Heart, Briefcase } from "lucide-react";
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

/* ─────────────────────────────────────────────────────────────
   Industry categories for sidebar filter (Dolphy-style)
   ───────────────────────────────────────────────────────────── */
const INDUSTRY_CATEGORIES = [
  { label: "All Clients", value: "all", icon: Users },
  { label: "Hotel Chains", value: "hotel", icon: Hotel },
  { label: "Resorts", value: "resort", icon: Building2 },
  { label: "Heritage Properties", value: "heritage", icon: Briefcase },
  { label: "Business Hotels", value: "business", icon: Building2 },
  { label: "Boutique Hotels", value: "boutique", icon: Heart },
];

/* ─────────────────────────────────────────────────────────────
   Distribute client logos across industry categories
   ───────────────────────────────────────────────────────────── */
const HOTEL_CHAINS = ["Radisson", "Holiday Inn", "Fairmont", "Ramada Group", "Taj", "Ananta Hotels"];
const RESORTS = ["Sayaji Hotels", "Sunday Hotels", "Club Mahindra", "Swosti Group"];
const HERITAGE = ["The Lords Inn", "The Fern Hotels & Resorts"];
const BUSINESS = ["7 Apple Hotels"];

function getCategoryForClient(name: string): string {
  if (HOTEL_CHAINS.includes(name)) return "hotel";
  if (RESORTS.includes(name)) return "resort";
  if (HERITAGE.includes(name)) return "heritage";
  if (BUSINESS.includes(name)) return "business";
  return "boutique";
}

/* ─────────────────────────────────────────────────────────────
   Trust stats — eye-catching animated counters
   ───────────────────────────────────────────────────────────── */
const TRUST_STATS = [
  { value: "1,347+", label: "Projects Delivered", icon: Building2 },
  { value: "28", label: "States Covered", icon: MapPin },
  { value: "97.4%", label: "On-Time Delivery", icon: TrendingUp },
  { value: "13+", label: "National Hotel Chains", icon: Award },
];

export default function ClientsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredClients = activeCategory === "all"
    ? CLIENT_LOGOS
    : CLIENT_LOGOS.filter((name) => getCategoryForClient(name) === activeCategory);

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
          Section 3 — Client logos with sidebar filter (Dolphy-style)
          ───────────────────────────────────────────── */}
      <section className="section section-ivory py-16 md:py-24">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="CLIENT ROSTER"
            title="Hotels That Choose LaxRee"
            body="A selection of the hospitality brands we manufacture and supply for — from luxury chains to boutique resorts."
          />

          {/* Two-column layout: sidebar filter + logo grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            {/* Left sidebar — industry filter (Dolphy-style) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[16px] border border-ink/10 bg-white p-4 shadow-sm">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Filter by Industry
                </h3>
                <div className="flex flex-col gap-1">
                  {INDUSTRY_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.value;
                    const count = cat.value === "all"
                      ? CLIENT_LOGOS.length
                      : CLIENT_LOGOS.filter((n) => getCategoryForClient(n) === cat.value).length;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-all duration-200 ${
                          isActive
                            ? "bg-charcoal text-ivory"
                            : "text-ink-muted hover:bg-charcoal/5 hover:text-ink"
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.5} className={isActive ? "text-brass" : ""} />
                        <span className="font-body text-[13px] font-medium flex-1">
                          {cat.label}
                        </span>
                        <span className={`font-mono text-[10px] ${isActive ? "text-brass" : "text-ink-muted/60"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — logo grid */}
            <div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
                {filteredClients.map((name, i) => (
                  <FadeIn key={name} delay={(i % 6) * 0.05}>
                    <div className="group flex h-28 items-center justify-center rounded-[16px] border border-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-brass/40 hover:shadow-lg hover:-translate-y-1">
                      <span className="font-display text-[16px] font-medium text-ink-muted transition-colors duration-300 group-hover:text-ink text-center">
                        {name}
                      </span>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {filteredClients.length === 0 && (
                <div className="flex h-40 items-center justify-center rounded-[16px] border border-ink/10 bg-white">
                  <p className="font-body text-[14px] text-ink-muted">
                    No clients in this category yet.
                  </p>
                </div>
              )}
            </div>
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
                  {/* Brass top accent line */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent"
                  />
                  {/* Large metric */}
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
                  {/* Hotel name + location */}
                  <h3 className="font-display text-[22px] font-medium leading-tight text-ivory">
                    {cs.hotel}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-brass">
                    <MapPin size={12} strokeWidth={1.5} />
                    <span className="data-label text-[11px]">{cs.location}</span>
                  </div>
                  {/* Project title */}
                  <p className="mt-4 font-body text-[16px] font-medium text-ivory">
                    {cs.project}
                  </p>
                  {/* Scope */}
                  <p className="mt-3 font-body text-[13px] leading-relaxed text-sand">
                    {cs.scope}
                  </p>
                  {/* Outcome — highlighted */}
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
                  {/* Quote icon */}
                  <Quote
                    className="absolute right-6 top-6 h-12 w-12 text-brass/15 transition-colors duration-300 group-hover:text-brass/25"
                    strokeWidth={1}
                    aria-hidden
                  />
                  {/* 5-star rating */}
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4 w-4 fill-brass text-brass"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  {/* Quote text */}
                  <p className="relative z-10 font-body text-[15px] italic leading-relaxed text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {/* Divider */}
                  <div className="hairline-brass mt-6" />
                  {/* Author */}
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
