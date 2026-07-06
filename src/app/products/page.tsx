"use client";

/**
 * Products overview page — LaxRee Amenities
 * Task ID: P-2
 *
 * A "corridor of lit rooms" walk through the full LaxRee product range:
 *   1. PageHero (charcoal) — breadcrumbs + headline
 *   2. Category grid (ivory) — 5 large image cards, one per category
 *   3. All-products grid (charcoal) — filterable by sub-category
 *   4. Room solutions teaser (ivory) — first 3 room packages
 *   5. PageCTA (emerald)
 *
 * This page is a client component because Section 3 implements a
 * client-side category filter via useState.
 */

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  ShowerHead,
  ConciergeBell,
  Armchair,
  Layers,
  Warehouse,
  Globe,
  type LucideIcon,
} from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import { CATEGORIES, ALL_PRODUCTS, ROOM_SOLUTIONS } from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Filter chips — "All" + the three amenity sub-categories that
   actually appear in ALL_PRODUCTS (Amenities / Washroom / Lobby).
   ───────────────────────────────────────────────────────────── */
const FILTERS = ["All", "Amenities", "Washroom", "Lobby"] as const;
type Filter = (typeof FILTERS)[number];

/* Room-solution icon lookup — same map as the homepage explorer. */
const ICONS: Record<string, LucideIcon> = {
  BedDouble,
  ShowerHead,
  ConciergeBell,
  Armchair,
  Layers,
  Warehouse,
  Globe,
};

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filteredProducts =
    activeFilter === "All"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — PageHero (charcoal)
          ═══════════════════════════════════════════════════════════ */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        eyebrow="What We Supply"
        title="700+ SKUs. Five Categories. One Standard."
        subtitle="From minibars to geodesic domes — manufactured and supplied pan-India. Explore our full hospitality product range."
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — Category grid (ivory)
          5 large image cards. Each links to /products/{slug}.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="Categories"
            title="Explore by Category"
            body="Five focused product lines, each manufactured in-house and shipped pan-India. Tap any card to dive into the collection."
          />

          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={cat.slug} delay={i * 0.06}>
                <Link
                  href={`/products/${cat.slug}`}
                  aria-label={`Browse the ${cat.name} category`}
                  className="group block relative overflow-hidden rounded-[24px] border border-transparent transition-colors duration-500 hover:border-brass/40 focus-visible:border-brass"
                  style={{ minHeight: 320 }}
                >
                  {/* Background image — scales 1.04 on hover */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    width={640}
                    height={480}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Charcoal gradient overlay */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(18,16,13,0.92) 0%, rgba(18,16,13,0.55) 45%, rgba(18,16,13,0.25) 100%)",
                    }}
                  />
                  {/* Bottom-left text block */}
                  <div className="relative p-6 md:p-7 flex flex-col justify-end h-full min-h-[320px]">
                    <h3
                      className="font-display text-ivory"
                      style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.1 }}
                    >
                      {cat.name}
                    </h3>
                    <div
                      className="font-mono text-brass mt-1.5"
                      style={{
                        fontSize: 13,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {cat.count} Products
                    </div>
                    <p
                      className="text-sand mt-2"
                      style={{ fontSize: 13, lineHeight: 1.5 }}
                    >
                      {cat.blurb}
                    </p>
                    {/* Brass arrow that slides in on hover */}
                    <div
                      className="mt-4 inline-flex items-center gap-1.5 font-mono text-brass uppercase opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ fontSize: 11, letterSpacing: "0.15em" }}
                    >
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — All products grid (charcoal)
          Client-side filter by sub-category. Glass-on-charcoal cards.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="Product Catalogue"
            title="Our Latest Offerings"
            body="A curated cross-section of our 700+ SKU range. Filter by room to find what you need — every item is manufactured, QC'd and shipped from Ajmer."
          />

          {/* Filter chips */}
          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            role="tablist"
            aria-label="Filter products by category"
          >
            <span
              className="font-mono text-sand/60 uppercase mr-1"
              style={{ fontSize: 11, letterSpacing: "0.15em" }}
            >
              Filter:
            </span>
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(f)}
                  className={`pill text-[12px] px-5 py-2.5 cursor-pointer transition-colors duration-300 ${
                    isActive ? "pill-brass" : "pill-ghost-brass"
                  }`}
                >
                  {f}
                  {isActive && (
                    <span className="ml-2 font-mono text-[10px] opacity-70">
                      {f === "All"
                        ? ALL_PRODUCTS.length
                        : ALL_PRODUCTS.filter((p) => p.category === f).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Product cards */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p, i) => (
              <FadeIn key={p.slug} delay={(i % 3) * 0.05}>
                <GlassCard
                  theme="charcoal"
                  radius="20px"
                  className="overflow-hidden h-full flex flex-col group/card"
                >
                  {/* Image — charcoal bg, object-cover */}
                  <div className="relative aspect-[4/3] bg-charcoal overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
                    />
                  </div>
                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div
                      className="font-mono text-brass uppercase"
                      style={{ fontSize: 11, letterSpacing: "0.15em" }}
                    >
                      {p.category}
                    </div>
                    <h3
                      className="font-display text-ivory mt-2"
                      style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="text-sand/80 mt-2 flex-1"
                      style={{ fontSize: 13, lineHeight: 1.5 }}
                    >
                      {p.description}
                    </p>
                    <Link
                      href="/products/amenities"
                      className="mt-4 inline-flex items-center gap-1.5 font-mono text-brass uppercase transition-colors hover:text-brass-light"
                      style={{ fontSize: 12, letterSpacing: "0.1em" }}
                    >
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>

          {/* Empty state — defensive, shouldn't fire with current data */}
          {filteredProducts.length === 0 && (
            <div className="mt-10 glass-on-charcoal rounded-[20px] p-10 text-center">
              <p className="font-mono text-sand text-sm uppercase tracking-wider">
                No products in this filter yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — Room solutions teaser (ivory)
          3-column preview of the first 3 ROOM_SOLUTIONS.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="By Room"
            title="Solutions for Every Space"
            body="Complete procurement packages organised by where they live in the property — from the guest room to the lobby entrance."
          />

          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOM_SOLUTIONS.slice(0, 3).map((sol, i) => {
              const Icon = ICONS[sol.icon] ?? ConciergeBell;
              return (
                <FadeIn key={sol.slug} delay={i * 0.06}>
                  <div className="glass-on-ivory rounded-[20px] p-6 md:p-7 h-full flex flex-col group">
                    {/* Icon in a brass-tinted square */}
                    <div className="w-12 h-12 rounded-xl bg-brass/12 border border-brass/25 grid place-items-center">
                      <Icon
                        className="h-5 w-5 text-brass"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>

                    <h3
                      className="font-display text-ink mt-5"
                      style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.1 }}
                    >
                      {sol.name}
                    </h3>
                    <p
                      className="text-ink-muted mt-2 flex-1"
                      style={{ fontSize: 14, lineHeight: 1.5 }}
                    >
                      {sol.oneLine}
                    </p>

                    {/* Item count chip */}
                    <div
                      className="mt-4 font-mono text-ink-muted uppercase"
                      style={{ fontSize: 11, letterSpacing: "0.12em" }}
                    >
                      {sol.items.length} items included
                    </div>

                    <Link
                      href="/products"
                      className="mt-4 inline-flex items-center gap-1.5 font-mono text-brass uppercase transition-colors hover:text-ink"
                      style={{ fontSize: 12, letterSpacing: "0.1em" }}
                    >
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — PageCTA (emerald)
          ═══════════════════════════════════════════════════════════ */}
      <PageCTA />
    </>
  );
}
