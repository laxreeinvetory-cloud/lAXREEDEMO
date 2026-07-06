/**
 * Category detail page — LaxRee Amenities
 * Task ID: P-2
 *
 * Dynamic route /products/[slug] for each of the 5 categories.
 * Server component — async, awaits `params` (Next.js 16).
 *
 * Five sections:
 *   1. PageHero (charcoal) — breadcrumbs + headline
 *   2. Category hero banner (charcoal continues) — 21/9 image with overlay
 *   3. Products in this category (ivory):
 *        - amenities → render all 9 ALL_PRODUCTS as glass-on-ivory cards
 *        - furniture / linen / roofing / dome → <ComingSoonSection />
 *   4. Other categories (charcoal) — row of the other 4 categories
 *   5. PageCTA (emerald) — custom title per category
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  CATEGORIES,
  ALL_PRODUCTS,
} from "@/lib/laxree/site-data";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import { ComingSoonSection } from "./coming-soon-section";

/* ─────────────────────────────────────────────────────────────
   Pre-generate the 5 category slugs at build time.
   ───────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

/* ─────────────────────────────────────────────────────────────
   Per-category metadata. Next.js 16: `params` is a Promise.
   ───────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    return {
      title: "Category not found — LaxRee Amenities",
    };
  }
  return {
    title: `${category.name} — LaxRee Amenities`,
    description: `${category.blurb} ${category.count} products available, manufactured in Ajmer and shipped pan-India.`,
    openGraph: {
      title: `${category.name} — LaxRee Amenities`,
      description: category.blurb,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 16: params is a Promise — must be awaited.
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const otherCategories = CATEGORIES.filter((c) => c.slug !== slug);
  const showAllProducts = slug === "amenities";
  const products = showAllProducts ? ALL_PRODUCTS : [];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — PageHero (charcoal)
          Breadcrumbs: Home / Products / {Category Name}
          ═══════════════════════════════════════════════════════════ */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
        eyebrow={category.name.toUpperCase()}
        title={category.name}
        subtitle={`${category.blurb} — ${category.count} products available.`}
      >
        <Link
          href="/products"
          className="inline-flex items-center gap-2 font-mono text-sand/80 hover:text-brass transition-colors text-[12px] uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all products
        </Link>
      </PageHero>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — Category hero banner (charcoal continues)
          Full-width 21/9 image with charcoal gradient overlay.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-charcoal pb-20 md:pb-28">
        <div className="container-laxree">
          <div className="relative overflow-hidden rounded-[24px] aspect-[21/9]">
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Charcoal gradient overlay — heavier on the left so the
                caption text reads cleanly. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(18,16,13,0.88) 0%, rgba(18,16,13,0.45) 50%, rgba(18,16,13,0.7) 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-end p-6 md:p-10">
              <div className="max-w-xl">
                <div
                  className="font-mono text-brass uppercase mb-3"
                  style={{ fontSize: 11, letterSpacing: "0.2em" }}
                >
                  {category.count} Products Available
                </div>
                <h2
                  className="font-display text-ivory"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 500,
                    lineHeight: 1.15,
                  }}
                >
                  {category.blurb}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — Products in this category (ivory)
          Amenities → 9 ALL_PRODUCTS cards.
          Other categories → <ComingSoonSection />.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="Products"
            title={`${category.name} Collection`}
            body={
              showAllProducts
                ? "Room, washroom and lobby essentials — minibars to magnifying mirrors. Every item is manufactured, QC'd and shipped from our Ajmer facility."
                : `Custom ${category.name.toLowerCase()} solutions, manufactured to your project specifications. Request a tailored quotation and our factory team will respond within 24 hours.`
            }
          />

          {showAllProducts ? (
            <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <FadeIn key={p.slug} delay={(i % 3) * 0.05}>
                  <div className="glass-on-ivory rounded-[20px] overflow-hidden h-full flex flex-col group">
                    {/* Image — ivory bg, object-cover */}
                    <div className="relative aspect-[4/3] bg-ivory overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
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
                        className="font-display text-ink mt-2"
                        style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}
                      >
                        {p.name}
                      </h3>
                      <p
                        className="text-ink-muted mt-2 flex-1"
                        style={{ fontSize: 13, lineHeight: 1.5 }}
                      >
                        {p.description}
                      </p>
                      <Link
                        href="/products/amenities"
                        className="mt-4 inline-flex items-center gap-1.5 font-mono text-brass uppercase transition-colors hover:text-ink"
                        style={{ fontSize: 12, letterSpacing: "0.1em" }}
                      >
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <ComingSoonSection
              categoryName={category.name}
              categorySlug={category.slug}
            />
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — Other categories (charcoal)
          Row of the OTHER 4 categories as smaller image cards.
          ═══════════════════════════════════════════════════════════ */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="Explore More"
            title="Other Categories"
            body="Browse the rest of our hospitality product lines — each manufactured in-house under the same ISO 9001 QC protocol."
          />

          <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {otherCategories.map((c, i) => (
              <FadeIn key={c.slug} delay={i * 0.06}>
                <Link
                  href={`/products/${c.slug}`}
                  aria-label={`Browse the ${c.name} category`}
                  className="group block relative overflow-hidden rounded-[20px] border border-white/10 transition-colors duration-500 hover:border-brass/40 focus-visible:border-brass"
                  style={{ minHeight: 220 }}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(18,16,13,0.92) 0%, rgba(18,16,13,0.5) 50%, rgba(18,16,13,0.2) 100%)",
                    }}
                  />
                  <div className="relative p-5 flex flex-col justify-end h-full min-h-[220px]">
                    <h3
                      className="font-display text-ivory"
                      style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}
                    >
                      {c.name}
                    </h3>
                    <div
                      className="font-mono text-brass mt-1"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {c.count} Products
                    </div>
                    <div
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-brass uppercase opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ fontSize: 11, letterSpacing: "0.15em" }}
                    >
                      View <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — PageCTA (emerald)
          Per-category custom title.
          ═══════════════════════════════════════════════════════════ */}
      <PageCTA
        title={`Need a custom ${category.name} quote?`}
        subtitle="Our factory can manufacture to your specifications."
      />
    </>
  );
}
