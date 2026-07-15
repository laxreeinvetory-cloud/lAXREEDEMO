/**
 * About Us page — LaxRee Amenities
 * Task ID: P-1
 *
 * A "corridor of lit rooms": alternating charcoal and ivory sections that
 * walk the visitor through who LaxRee is, how we grew, what we make, who
 * runs the company, what we believe, and what we've been certified for.
 *
 * The page is a server component — every interactive piece (motion,
 * hover, the CTA button) lives inside the client components it imports
 * from @/components/site/page-primitives.
 */

import {
  ShieldCheck,
  Factory,
  Leaf,
  Clock,
  Headset,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import {
  HERO_STATS,
  TIMELINE,
  LEADERSHIP,
  COMPANY_VALUES,
  CERTIFICATIONS,
} from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Icon lookup — map the string names stored in site-data.ts to
   the actual lucide-react components.
   ───────────────────────────────────────────────────────────── */
const VALUE_ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Factory,
  Leaf,
  Clock,
  Headset,
  Handshake,
};

export default function AboutUsPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 + 2 — PageHero + Stats band (charcoal)
          The stats strip is rendered as PageHero `children` so it
          sits inside the same charcoal section — no visual seam.
          ═══════════════════════════════════════════════════════════ */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        eyebrow="Who We Are"
        title="Eleven Years of Opening Doors"
        subtitle="LaxRee Amenities is an 11-year-old OEM manufacturer and Ajmer's largest hospitality exhibition centre — serving 1,347+ hotel projects across India with 700+ SKUs and 7+ certifications."
      >
        {/* Stats band — glass-on-charcoal strip, static Plex Mono numbers */}
        <div className="glass-on-charcoal rounded-3xl p-6 md:p-8 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center px-2 ${
                  i > 0 ? "md:border-l md:border-white/10" : ""
                }`}
              >
                <div className="font-mono text-brass text-3xl md:text-5xl font-medium tracking-tight tabular-nums">
                  {stat.value.toLocaleString("en-IN")}
                  {stat.suffix}
                </div>
                <div className="mt-2 data-label text-sand text-[10px] md:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — Our Story (ivory)
          Two-column: body copy left, factory image right.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="Our Story"
            title="From a Single Minibar Line to 700+ SKUs"
            body="Eleven years ago we started with one production line and one promise — own the factory, control the quality, and pass the savings to hotels. The promise hasn't changed; everything else has."
          />

          <div className="mt-12 md:mt-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Body copy */}
            <FadeIn>
              <div className="space-y-5 font-body text-ink-muted text-[15px] md:text-base leading-relaxed">
                <p>
                  In <span className="text-ink font-medium">2015</span>, LaxRee
                  opened its first manufacturing line in Ajmer — absorption
                  minibars at 200 units a month, a single shift, and a founder
                  who inspected every unit himself. The premise was simple:
                  if we own the factory, we own the quality.
                </p>
                <p>
                  That OEM philosophy is still the engine of the company. By
                  keeping sheet-metal forming, electronics assembly, furniture
                  joinery and final QC under one roof, we eliminate the layers
                  of distributors that inflate hospitality procurement. Today
                  the catalogue spans{" "}
                  <span className="text-ink font-medium">700+ SKUs</span> across
                  five categories — minibars, safes, furniture, amenities and
                  linen.
                </p>
                <p>
                  In 2019 we opened{" "}
                  <span className="text-ink font-medium">
                    Ajmer's largest hospitality exhibition centre
                  </span>
                  : 12,000 sq ft of working product displays where procurement
                  teams can test minibar cooling curves, weigh safe-locker
                  steel, and compare finish samples under daylight-matched
                  lighting — before they sign a PO.
                </p>
                <p>
                  A 22-state dealer network and dedicated service engineers in
                  14 cities mean a LaxRee shipment reaches your property on
                  time, and a service call reaches your room within hours.
                  ISO 9001, ISO 14001, ISO 45001, CE and RoHS are not posters
                  on our wall — they are the audit trail behind every unit we
                  ship.
                </p>
              </div>
            </FadeIn>

            {/* Factory image */}
            <FadeIn delay={0.1}>
              <div
                className="relative overflow-hidden bg-ink/5"
                style={{ borderRadius: 24 }}
              >
                <img
                  src="/images/about/factory.jpg"
                  alt="Inside the LaxRee manufacturing facility in Ajmer, Rajasthan"
                  width={800}
                  height={640}
                  loading="lazy"
                  className="w-full h-auto block object-cover aspect-[4/3]"
                />
                {/* Brass caption bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3 backdrop-blur-md bg-charcoal/60 border-t border-brass/30">
                  <span className="data-label text-[10px] text-brass">
                    Ajmer Facility
                  </span>
                  <span className="data-label text-[10px] text-sand/80">
                    12,000 sq ft
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — Timeline (charcoal)
          Vertical alternating timeline. Brass line center on desktop,
          left on mobile. Each milestone fades in on scroll.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="Our Journey"
            title="Milestones That Built LaxRee"
            body="From one minibar line in 2015 to a 700+ SKU catalogue and a 22-state network — every milestone is a factory floor we added or a door we opened."
          />

          {/* Timeline rail */}
          <div className="relative mt-16 md:mt-24 pb-4">
            {/* Vertical brass line */}
            <div
              aria-hidden
              className="absolute top-1 bottom-1 left-5 md:left-1/2 md:-translate-x-px w-px bg-gradient-to-b from-transparent via-brass/40 to-transparent"
            />

            <div className="space-y-12 md:space-y-20">
              {TIMELINE.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <FadeIn key={m.year} delay={i * 0.04}>
                    <div className="relative md:grid md:grid-cols-2 md:gap-16">
                      {/* Dot marker on the line */}
                      <span
                        aria-hidden
                        className="absolute left-5 md:left-1/2 top-1.5 -translate-x-1/2 size-3.5 rounded-full bg-brass ring-4 ring-charcoal"
                      />

                      {/* Content */}
                      <div
                        className={`pl-12 md:pl-0 ${
                          isLeft
                            ? "md:col-start-1 md:pr-16 md:text-right"
                            : "md:col-start-2 md:pl-16"
                        }`}
                      >
                        <div className="font-mono text-brass text-2xl md:text-4xl font-medium tracking-tight tabular-nums">
                          {m.year}
                        </div>
                        <h3 className="mt-2 font-display text-ivory text-xl md:text-2xl leading-snug">
                          {m.title}
                        </h3>
                        <p
                          className={`mt-3 font-body text-sand leading-relaxed text-sm md:text-[15px] md:max-w-sm ${
                            isLeft ? "md:ml-auto" : ""
                          }`}
                        >
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — OEM Manufacturing (ivory)
          Two-column: image left, body copy + chips right.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="OEM Manufacturing"
            title="We Own the Factory. You Get the Value."
            body="Three production lines, one QC lab, zero middlemen — that's the math behind LaxRee pricing."
          />

          <div className="mt-12 md:mt-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image */}
            <FadeIn>
              <div
                className="relative overflow-hidden bg-ink/5 order-2 lg:order-1"
                style={{ borderRadius: 24 }}
              >
                <img
                  src="/images/products/mini-bar.jpg"
                  alt="A LaxRee absorption minibar assembled on the Ajmer production line"
                  width={800}
                  height={640}
                  loading="lazy"
                  className="w-full h-auto block object-cover aspect-[4/3]"
                />
                <div className="absolute top-4 left-4 glass-on-charcoal rounded-full px-4 py-1.5">
                  <span className="data-label text-[10px] text-brass">
                    Made in Ajmer
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Body copy + chips */}
            <FadeIn delay={0.1} className="order-1 lg:order-2">
              <div className="space-y-5 font-body text-ink-muted text-[15px] md:text-base leading-relaxed">
                <p>
                  We own the factory. Three production lines in Ajmer handle
                  minibar assembly, electronic safe-locker manufacturing, and
                  case-goods furniture — all under one roof, all on the same
                  shift schedule, all answerable to the same QC report.
                </p>
                <p>
                  Quality control is built into the line, not bolted on at the
                  end. Every minibar runs a{" "}
                  <span className="text-ink font-medium">72-hour cooling test</span>
                  ; every safe cycles 200 lock/unlock sequences; every
                  furniture piece is weighed and measured against the spec
                  sheet before it is wrapped.
                </p>
                <p>
                  Because there is no distributor between us and your purchase
                  order, the price you pay reflects material, labour and a fair
                  margin — not a chain of markups. For chain-wide rollouts we
                  offer custom manufacturing: your logo, your finish, your
                  packaging, your lead time.
                </p>
              </div>

              {/* Capability chips */}
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  "Minibar Production Line",
                  "Safe Locker Assembly",
                  "Furniture Workshop",
                  "Quality Lab",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="pill pill-ghost-brass text-[11px] px-4 py-2"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — Leadership (charcoal)
          Grid of 4 leadership cards. Circular avatar with initials
          in brass (no real photos).
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="Leadership"
            title="The People Behind LaxRee"
            body="A founding team that still walks the factory floor every morning — and still signs off on every new SKU."
          />

          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {LEADERSHIP.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.07}>
                <GlassCard theme="charcoal" className="p-6 md:p-7 h-full">
                  {/* Avatar — initials in brass */}
                  <div className="w-20 h-20 rounded-full bg-brass/10 border border-brass/30 grid place-items-center">
                    <span className="font-display text-brass text-2xl font-medium">
                      {member.initials}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-ivory text-lg leading-snug">
                    {member.name}
                  </h3>
                  <div className="mt-1 data-label text-brass text-[10px]">
                    {member.role}
                  </div>

                  <div className="hairline-brass my-4" />

                  <p className="font-body text-sand text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 — Values (ivory)
          Grid of 6 value cards with staggered FadeIn.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="Our Values"
            title="What We Stand For"
            body="Six commitments that show up on the production floor, in the procurement meeting, and at 2 a.m. when a guest calls reception about a safe that won't open."
          />

          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {COMPANY_VALUES.map((value, i) => {
              const Icon = VALUE_ICONS[value.icon] ?? ShieldCheck;
              return (
                <FadeIn key={value.title} delay={i * 0.06}>
                  <GlassCard theme="ivory" className="p-6 md:p-7 h-full">
                    {/* Icon in a brass-tinted square */}
                    <div className="w-12 h-12 rounded-xl bg-brass/12 border border-brass/25 grid place-items-center">
                      <Icon className="h-5 w-5 text-brass" strokeWidth={1.75} />
                    </div>

                    <h3 className="mt-5 font-body text-ink text-base font-medium leading-snug">
                      {value.title}
                    </h3>
                    <p className="mt-2.5 font-body text-ink-muted text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </GlassCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — Certifications (charcoal)
          Static medallion row — same visual language as the homepage
          certifications wall, but without the hover flip.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="Certifications"
            title="Quality You Can Audit"
            body="Five global certifications covering quality, environment, occupational safety and product compliance — audited annually, not just framed."
          />

          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-10">
            {CERTIFICATIONS.map((cert, i) => (
              <FadeIn key={cert.code} delay={i * 0.08}>
                <div className="flex flex-col items-center text-center group">
                  {/* Static medallion */}
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-brass bg-gradient-to-b from-white/[0.06] to-transparent grid place-items-center transition-transform duration-300 group-hover:scale-105">
                    <div className="flex flex-col items-center justify-center px-2">
                      <span className="font-display text-[15px] md:text-[17px] font-medium leading-tight text-ivory text-center">
                        {cert.code}
                      </span>
                      <span className="data-label text-[9px] text-brass mt-1.5">
                        Certified
                      </span>
                    </div>
                  </div>
                  {/* Caption below */}
                  <span className="mt-4 font-body text-sand text-xs md:text-[13px] max-w-[140px] leading-snug">
                    {cert.fullName}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9 — PageCTA (emerald)
          ═══════════════════════════════════════════════════════════ */}
      <PageCTA />
    </>
  );
}

