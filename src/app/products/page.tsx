"use client";

import { useState, useEffect } from "react";
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
   Parent slug → category-level hero image.
   These always exist on disk, so the "Explore by Category" grid
   never shows the coming-soon placeholder even before the API
   resolves a representative product image.
   ───────────────────────────────────────────────────────────── */
const PARENT_FALLBACK_IMAGE: Record<string, string> = {
  "room-amenities": "/images/categories/amenities.jpg",
  "washroom-amenities": "/images/categories/washroom.jpg",
  "lobby-items": "/images/categories/lobby.jpg",
  furniture: "/images/categories/furniture.jpg",
  linen: "/images/categories/linen.jpg",
  "bath-tub": "/images/products/bath-tub.jpg",
  "amenities-tray-set": "/images/product-catalogue/amenities-tray-set/LRAT-366.jpg",
  "dome-space-pod": "/images/categories/dome.jpg",
};

/* ─────────────────────────────────────────────────────────────
   ParentCategoryCard — large card for each of the 8 main categories.
   Links to /products/[parentSlug] which shows sub-categories.
   Fetches a representative real product image from the API; falls
   back to the category-level hero image so it never shows
   "coming-soon.jpg".
   ───────────────────────────────────────────────────────────── */
function ParentCategoryCard({
  parent,
  index,
  imageMap,
}: {
  parent: (typeof CATALOGUE_PARENTS)[0];
  index: number;
  imageMap: Record<string, string>;
}) {
  const children = getCategoriesByParent(parent.slug);
  // Get product count across all sub-categories
  const productCount = children.reduce(
    (sum, cat) => sum + cat.products.length,
    0,
  );

  // Resolve the best available image:
  //   1. API-provided representative product image (real photo)
  //   2. Category-level hero image (always on disk)
  //   3. First product's image (only if it isn't the coming-soon placeholder)
  const apiImage = imageMap[parent.slug];
  const fallback = PARENT_FALLBACK_IMAGE[parent.slug] || "/images/categories/amenities.jpg";
  const firstProduct = children[0]?.products[0];
  const firstProductImage =
    firstProduct?.image && !firstProduct.image.includes("coming-soon")
      ? firstProduct.image
      : null;
  const image = apiImage || firstProductImage || fallback;

  return (
    <FadeIn delay={index * 0.06}>
      <Link
        href={`/products/${parent.slug}`}
        className="group relative block h-full w-full overflow-hidden rounded-[24px] border border-ink/0 transition-colors duration-500 hover:border-brass/40"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
          <img
            src={image}
            alt={parent.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
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
  // imageMap[parentSlug] = a real product image URL picked from the API.
  // Empty until the fetch resolves; the category-level hero image is the
  // immediate fallback so the grid never shows coming-soon.jpg.
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/products", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.ok || !Array.isArray(data.products)) return;
        const products: Array<{ category: string; image: string }> = data.products;
        const next: Record<string, string> = {};

        // For each parent, pick the first non-coming-soon product image
        // across all of its child sub-categories.
        for (const parent of CATALOGUE_PARENTS) {
          const childCats = CATALOGUE_CATEGORIES.filter((c) =>
            parent.children.includes(c.slug),
          );
          const childNames = new Set(childCats.map((c) => c.name));
          // Some sub-categories share names with their siblings (e.g. "Bath Tub"
          // vs "Bath Tub Models") — include the parent name too so we still
          // find a representative image.
          childCats.forEach((c) => childNames.add(c.name));

          const found = products.find(
            (p) =>
              childNames.has(p.category) &&
              typeof p.image === "string" &&
              p.image &&
              !p.image.includes("coming-soon"),
          );
          if (found) {
            next[parent.slug] = found.image;
          }
        }

        if (Object.keys(next).length > 0) {
          setImageMap(next);
        }
      })
      .catch(() => {
        /* keep fallback images */
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
                imageMap={imageMap}
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
