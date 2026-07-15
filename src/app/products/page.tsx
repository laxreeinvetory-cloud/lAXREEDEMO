"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import {
  CATEGORIES,
} from "@/lib/laxree/site-data";
import {
  CATALOGUE_CATEGORIES,
  type CatalogueCategory,
} from "@/lib/laxree/catalogue-data";

/* ─────────────────────────────────────────────────────────────
   CategoryCard — large image card linking to category page
   ───────────────────────────────────────────────────────────── */
function CategoryCard({
  category,
  productCount,
  index,
}: {
  category: (typeof CATEGORIES)[0];
  productCount: number;
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.06}>
      <Link
        href={`/products/${category.slug}`}
        className="group relative block h-full w-full overflow-hidden rounded-24px border border-ink/0 transition-colors duration-500 hover:border-brass/40"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3
            className="font-display text-ivory leading-tight"
            style={{ fontSize: "24px" }}
          >
            {category.name}
          </h3>
          <p className="mt-1 font-mono text-[13px] tracking-wide text-brass">
            {productCount} Products
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-sand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Explore <ArrowRight size={12} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────────────────────
   Products overview page
   ───────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  return (
    <>
      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        eyebrow="WHAT WE SUPPLY"
        title="700+ SKUs. Five Categories. One Standard."
        subtitle="From minibars to geodesic domes — manufactured and supplied pan-India. Explore our full hospitality product range with detailed specifications."
      />

      {/* ── Category grid ── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="CATEGORIES"
            title="Explore by Category"
            body="Click any category to see all products with full specifications, model numbers, and images from our catalogue."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => {
              const catData = CATALOGUE_CATEGORIES.find(
                (c: CatalogueCategory) => c.slug === cat.slug
              );
              const productCount = catData?.products.length ?? cat.count;
              return (
                <CategoryCard
                  key={cat.slug}
                  category={cat}
                  productCount={productCount}
                  index={i}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── All products preview ── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="PRODUCT CATALOGUE"
            title="Browse All Products"
            body="Each category contains multiple products with detailed specifications. Click a product to view full details."
          />

          <div className="mt-12 grid grid-cols-1 gap-8">
            {CATALOGUE_CATEGORIES.map((cat, ci) => (
              <FadeIn key={cat.slug} delay={ci * 0.05}>
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <h3
                      className="font-display text-ivory"
                      style={{ fontSize: "1.75rem", fontWeight: 500 }}
                    >
                      {cat.name}
                    </h3>
                    <Link
                      href={`/products/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-brass hover:gap-2.5 transition-all"
                    >
                      View All {cat.name} <ArrowRight size={14} strokeWidth={1.5} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {cat.products.slice(0, 6).map((prod, pi) => (
                      <Link
                        key={prod.model}
                        href={`/products/${cat.slug}`}
                        className="group glass-on-charcoal rounded-20px overflow-hidden transition-all duration-300 hover:border-brass/40"
                      >
                        <div className="aspect-square w-full overflow-hidden bg-charcoal">
                          <img
                            src={prod.image}
                            alt={`${prod.name} — ${prod.model}`}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-mono text-[10px] text-brass">
                            {prod.model}
                          </p>
                          <p className="mt-0.5 font-body text-[11px] text-ivory leading-tight line-clamp-2">
                            {prod.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PageCTA ── */}
      <PageCTA
        title="Need a custom product?"
        subtitle="Our factory can manufacture to your specifications."
      />
    </>
  );
}

