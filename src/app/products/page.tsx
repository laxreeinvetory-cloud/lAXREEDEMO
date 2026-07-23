"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import {
  CATALOGUE_PARENTS,
  CATALOGUE_CATEGORIES,
  getCategoriesByParent,
} from "@/lib/laxree/catalogue-data";

/* ─────────────────────────────────────────────────────────────
   ParentCategoryCard — large card for each of the 8 main categories
   Links to /products/[parentSlug] which shows sub-categories
   ───────────────────────────────────────────────────────────── */
function ParentCategoryCard({
  parent,
  index,
}: {
  parent: (typeof CATALOGUE_PARENTS)[0];
  index: number;
}) {
  const children = getCategoriesByParent(parent.slug);
  // Get product count across all sub-categories
  const productCount = children.reduce(
    (sum, cat) => sum + cat.products.length,
    0,
  );
  // Get a representative image from the first sub-category's first product
  const firstProduct = children[0]?.products[0];
  const image = firstProduct?.image || "/images/product-catalogue/coming-soon.jpg";

  return (
    <FadeIn delay={index * 0.06}>
      <Link
        href={`/products/${parent.slug}`}
        className="group relative block h-full w-full overflow-hidden rounded-24px border border-ink/0 transition-colors duration-500 hover:border-brass/40"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
          <img
            src={image}
            alt={parent.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3
            className="font-display text-ivory leading-tight"
            style={{ fontSize: "22px", fontWeight: 500 }}
          >
            {parent.name}
          </h3>
          <p className="mt-1 font-mono text-[12px] tracking-wide text-brass">
            {children.length} {children.length === 1 ? "Category" : "Categories"} · {productCount} Products
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
   Products overview page — shows 8 main categories
   ───────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  return (
    <>
      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        eyebrow="WHAT WE SUPPLY"
        title="700+ SKUs. Eight Categories. One Standard."
        subtitle="From minibars to bath tubs, geodesic domes to amenities tray sets — manufactured and supplied pan-India. Explore our full hospitality product range."
      />

      {/* ── 8 Main Category Cards ── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="MAIN CATEGORIES"
            title="Explore by Category"
            body="Click any category below to see all item types and products within it."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATALOGUE_PARENTS.map((parent, i) => (
              <ParentCategoryCard
                key={parent.slug}
                parent={parent}
                index={i}
              />
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
