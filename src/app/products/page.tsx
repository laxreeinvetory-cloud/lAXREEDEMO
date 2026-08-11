"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Check, Globe } from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import {
  CATALOGUE_PARENTS,
  getCategoriesByParent,
} from "@/lib/laxree/catalogue-data";
import { PARENT_FALLBACK_IMAGE } from "@/lib/laxree/product-images";
import { useImageOverrides } from "@/hooks/use-image-overrides";

/* ─────────────────────────────────────────────────────────────
   Parent slug → category-level hero image.
   ───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   Industry filter tabs (Dolphy-style category bar)
   ───────────────────────────────────────────────────────────── */
const INDUSTRY_FILTERS = [
  { label: "All Categories", value: "all" },
  { label: "Room Amenities", value: "room-amenities" },
  { label: "Washroom", value: "washroom-amenities" },
  { label: "Lobby", value: "lobby-items" },
  { label: "Furniture", value: "furniture" },
  { label: "Linen", value: "linen" },
  { label: "Bath Tub", value: "bath-tub" },
  { label: "Tray Set", value: "amenities-tray-set" },
  { label: "Dome & POD", value: "dome-space-pod" },
];

/* ─────────────────────────────────────────────────────────────
   Stats dashboard (Dolphy-style "Our Strength")
   ───────────────────────────────────────────────────────────── */
const STRENGTH_STATS = [
  { value: "1,347+", label: "Projects Delivered" },
  { value: "700+", label: "Product SKUs" },
  { value: "28", label: "States Covered" },
  { value: "11+", label: "Years Experience" },
];

/* ─────────────────────────────────────────────────────────────
   ParentCategoryCard — Dolphy-style premium card
   ───────────────────────────────────────────────────────────── */
function ParentCategoryCard({
  parent,
  index,
  imageOverride,
  overridesLoaded = true,
}: {
  parent: (typeof CATALOGUE_PARENTS)[0];
  index: number;
  imageOverride?: string;
  overridesLoaded?: boolean;
}) {
  const children = getCategoriesByParent(parent.slug);
  const productCount = children.reduce(
    (sum, cat) => sum + cat.products.length,
    0,
  );
  const image = imageOverride || PARENT_FALLBACK_IMAGE[parent.slug] || "/images/categories/room-amenities.webp";

  return (
    <FadeIn delay={index * 0.06}>
      <Link
        href={`/products/${parent.slug}`}
        className="group relative block h-full overflow-hidden rounded-[16px] border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brass/10 hover:-translate-y-1"
      >
        {/* Image area — 4:3 aspect, object-cover for lifestyle look */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
          {overridesLoaded ? (
            <img
              src={image}
              alt={parent.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-charcoal animate-pulse" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
          {/* Model count badge */}
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] font-medium text-ink backdrop-blur-sm">
            {children.length} Types
          </div>
          {/* Category name on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display text-[20px] font-medium leading-tight text-ivory">
              {parent.name}
            </h3>
          </div>
        </div>
        {/* Content */}
        <div className="p-4">
          <p className="font-body text-[12px] leading-relaxed text-ink-muted line-clamp-2">
            {parent.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-brass">
              {productCount} Products
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors group-hover:text-brass">
              Explore
              <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────────────────────
   Products overview page — Dolphy-style
   ───────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { overrides: cmsOverrides, loaded } = useImageOverrides();

  const filteredParents = activeFilter === "all"
    ? CATALOGUE_PARENTS
    : CATALOGUE_PARENTS.filter((p) => p.slug === activeFilter);

  return (
    <>
      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        eyebrow="WHAT WE SUPPLY"
        title="700+ SKUs. Eight Categories. One Standard."
        subtitle="From minibars to bath tubs, geodesic domes to amenities tray sets — manufactured and supplied pan-India. Explore our full hospitality product range."
      />

      {/* ── Strength Stats (Dolphy-style dashboard) ── */}
      <section className="section section-charcoal py-12 md:py-16">
        <div className="container-laxree">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {STRENGTH_STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="rounded-[16px] border border-brass/20 bg-charcoal/60 p-6 text-center transition-all duration-300 hover:border-brass/40 hover:bg-charcoal/40">
                  <div
                    className="font-mono font-medium leading-none text-brass"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sand">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industry Filter Bar (Dolphy-style green bar) ── */}
      <section className="sticky top-[64px] z-30 border-b border-ink/10 bg-ivory/95 backdrop-blur-md">
        <div className="container-laxree">
          <div className="flex flex-wrap items-center gap-2 py-3">
            {INDUSTRY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filter.value
                    ? "bg-charcoal text-ivory"
                    : "bg-white text-ink-muted hover:bg-charcoal/10 hover:text-ink"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Category Grid (Dolphy-style "The Collection") ── */}
      <section className="section section-ivory py-16 md:py-24">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="OUR CATALOGUE"
            title="The LaxRee Collection"
            body="Eight complete procurement categories — from room amenities to dome structures. One supplier, one quality bar, one invoice."
          />

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredParents.map((parent, i) => (
              <ParentCategoryCard
                key={parent.slug}
                parent={parent}
                index={i}
                imageOverride={cmsOverrides[`parent:${parent.slug}`]}
                overridesLoaded={loaded}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose LaxRee strip ── */}
      <section className="section section-charcoal py-16 md:py-20">
        <div className="container-laxree">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Building2, title: "OEM Manufacturer", desc: "Factory-direct pricing. No middlemen. You deal directly with the manufacturer." },
              { icon: Check, title: "Pan-India Delivery", desc: "28 states covered. On-time delivery to 1,347+ hotel projects across India." },
              { icon: Globe, title: "700+ Product SKUs", desc: "Eight complete categories — minibars, safes, locks, furniture, linen, domes and more." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.title} delay={i * 0.1}>
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/30 bg-brass/10">
                      <Icon className="h-5 w-5 text-brass" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-[20px] font-medium text-ivory">
                      {item.title}
                    </h3>
                    <p className="font-body text-[14px] leading-relaxed text-sand">
                      {item.desc}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PageCTA ── */}
      <PageCTA
        title="Ready to elevate your Guest Experience?"
        subtitle="Get a custom quotation within 24 hours. No obligation."
      />
    </>
  );
}
