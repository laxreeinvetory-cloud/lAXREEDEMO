"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_PARENTS,
  getCategoriesByParent,
} from "@/lib/laxree/catalogue-data";
import {
  SUBCATEGORY_FALLBACK_IMAGE,
  PARENT_FALLBACK_IMAGE,
} from "@/lib/laxree/product-images";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import { useImageOverrides } from "@/hooks/use-image-overrides";

const PARENT_CATEGORY_MAP: Record<string, string[]> = {
  "room-amenities": ["Mini Bar", "Tea Kettle", "Kettle Tray", "Safe Box", "Wooden Hangers", "RFID Locks", "Room Telephone", "Docking Pod", "Room Dustbin", "Desktop Accessories", "Rollaway Bed", "Mattress", "Iron & Iron Board", "Baby Cot", "Coat Stand", "Luggage Rack", "Emergency Torch"],
  "washroom-amenities": ["Hair Dryer", "Soap Dispenser", "Magnifying Mirror", "Lobby Soap Dispenser", "Weighing Scale", "Paper Dispenser", "Hand Dryer", "Shower Mat", "Cloth Line", "Towel Rack", "Toilet Paper Dispenser", "Towel Rod", "Washroom Tray", "Handicap Grab Bar"],
  "lobby-items": ["Luggage Trolley", "Housekeeping Trolley", "Lobby Dustbin", "Q Manager", "Sign Board", "Stand Pole", "Digital Signage", "Newspaper Stand", "Shoe Shine", "Umbrella Stand"],
  "bath-tub": ["Bath Tub", "Bath Tub Models"],
  "furniture": ["Outdoor Furniture", "Guest Room Loose Furniture", "Restaurant Furniture", "Pool Lounger", "Garden Umbrella", "FRP Flower Pots", "Room Furniture", "Banquet Furniture"],
  "linen": ["Room Linen", "Bath Linen"],
  "amenities-tray-set": ["Amenities Tray Set", "Amenities Tray Sets"],
  "dome-space-pod": ["Dome & Space POD", "Dome & Space POD Models"],
};

function CategoryPageInner() {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";
  const [itemImages, setItemImages] = useState<Record<string, { image: string; count: number }>>({});
  const [otherImages, setOtherImages] = useState<Record<string, { image: string; count: number }>>({});
  const cmsOverrides = useImageOverrides();

  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  const children = parent ? getCategoriesByParent(parent.slug) : [];
  const otherParents = CATALOGUE_PARENTS.filter((p) => p.slug !== slug);

  useEffect(() => {
    if (!slug || !parent) return;
    fetch("/api/admin/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok || !data.products) return;
        const allProducts = data.products;
        const images: Record<string, { image: string; count: number }> = {};
        for (const child of children) {
          const catFilters = [child.name];
          if (child.name === "Bath Tub Models") catFilters.push("Bath Tub");
          if (child.name === "Bath Tub") catFilters.push("Bath Tub Models");
          if (child.name === "Amenities Tray Sets") catFilters.push("Amenities Tray Set");
          if (child.name === "Amenities Tray Set") catFilters.push("Amenities Tray Sets");
          if (child.name === "Dome & Space POD Models") catFilters.push("Dome & Space POD");
          if (child.name === "Dome & Space POD") catFilters.push("Dome & Space POD Models");
          const childProducts = allProducts.filter((p: { category: string; image: string }) => catFilters.includes(p.category));
          // ALWAYS use the premium sub-category fallback image first.
          // This is a hand-picked Lux/Premium tier product photo that
          // best represents the sub-category. Only fall back to a random
          // DB product image if no fallback mapping exists.
          const fallback = SUBCATEGORY_FALLBACK_IMAGE[child.slug];
          const withImage = fallback
            ? null  // fallback takes priority — don't use DB image
            : childProducts.find((p: { image: string }) => !p.image.includes("coming-soon"));
          images[child.slug] = { image: fallback || withImage?.image || "/images/product-catalogue/coming-soon.jpg", count: childProducts.length };
        }
        setItemImages(images);
        const otherImgs: Record<string, { image: string; count: number }> = {};
        for (const other of otherParents) {
          const otherCatNames = PARENT_CATEGORY_MAP[other.slug] || [];
          const otherProducts = allProducts.filter((p: { category: string; image: string }) => otherCatNames.includes(p.category));
          // ALWAYS use the premium parent fallback image first.
          const fallback = PARENT_FALLBACK_IMAGE[other.slug];
          const withImage = fallback
            ? null
            : otherProducts.find((p: { image: string }) => !p.image.includes("coming-soon"));
          otherImgs[other.slug] = { image: fallback || withImage?.image || "/images/product-catalogue/coming-soon.jpg", count: otherProducts.length };
        }
        setOtherImages(otherImgs);
      })
      .catch(() => {});
  }, [slug, parent]);

  const totalProducts = Object.values(itemImages).reduce((sum, v) => sum + (v?.count || 0), 0);
  if (!parent) return null;

  return (
    <>
      <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: parent.name }]} eyebrow={parent.name.toUpperCase()} title={parent.name} subtitle={parent.description}>
        {children.length > 0 && (
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-brass" /><span className="data-label text-[11px] text-sand">{children.length} Item Types</span></div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-brass" /><span className="data-label text-[11px] text-sand">{totalProducts} Models</span></div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-brass" /><span className="data-label text-[11px] text-sand">Full Specifications</span></div>
          </div>
        )}
      </PageHero>

      {children.length > 0 ? (
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree">
            <SectionHeading theme="ivory" eyebrow="ITEM TYPES" title={`Browse ${parent.name} by Type`} body={`Click any item type below to see all available models with full specifications, images, and model numbers.`} />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((item, i) => {
                const preview = itemImages[item.slug];
                // CMS override (from /admin/images) takes priority, then DB-fetched image, then static fallback
                const itemImage =
                  cmsOverrides[`subcategory:${item.slug}`] ||
                  preview?.image ||
                  SUBCATEGORY_FALLBACK_IMAGE[item.slug] ||
                  "/images/product-catalogue/coming-soon.jpg";
                return (
                  <FadeIn key={item.slug} delay={i * 0.06}>
                    <Link
                      href={`/products/${parent.slug}/${item.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-ink/10 bg-white transition-all duration-300 hover:border-brass/40 hover:shadow-2xl hover:shadow-brass/10"
                    >
                      {/* Image area — white bg, object-contain, subtle zoom on hover */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-white to-ivory/50">
                        <img
                          src={itemImage}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Model count badge */}
                        <span className="absolute right-3 top-3 rounded-full bg-charcoal/85 px-3 py-1 font-mono text-[10px] text-brass backdrop-blur-sm transition-colors duration-300 group-hover:bg-brass group-hover:text-charcoal">
                          {preview?.count || 0} Models
                        </span>
                        {/* Brass top accent on hover */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-[20px] font-medium text-ink leading-tight transition-colors duration-300 group-hover:text-brass">
                          {item.name}
                        </h3>
                        <p className="mt-2 font-body text-[13px] leading-relaxed text-ink-muted line-clamp-2">
                          {item.products[0]?.description}
                        </p>
                        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-brass">
                          View All Models
                          <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree max-w-2xl text-center">
            <SectionHeading theme="ivory" eyebrow="COMING SOON" title={`${parent.name} Catalogue`} body={`The detailed product catalogue for ${parent.name} is being finalised.`} />
            <div className="mt-8"><Link href="/contact-us" className="pill pill-brass px-6 py-3 text-[13px] inline-flex items-center gap-2">Request Custom Quote <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>
      )}

      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading theme="charcoal" eyebrow="EXPLORE MORE" title="Other Categories" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {otherParents.map((p) => {
              const preview = otherImages[p.slug];
              const pChildren = getCategoriesByParent(p.slug);
              const otherImage =
                cmsOverrides[`parent:${p.slug}`] ||
                preview?.image ||
                PARENT_FALLBACK_IMAGE[p.slug] ||
                "/images/product-catalogue/coming-soon.jpg";
              return (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group glass-on-charcoal rounded-[20px] overflow-hidden transition-all duration-300 hover:border-brass/40">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
                    <img src={otherImage} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-[16px] text-ivory">{p.name}</h3>
                    <p className="mt-1 font-mono text-[11px] text-brass">{pChildren.length} {pChildren.length === 1 ? "Category" : "Categories"}{preview ? ` · ${preview.count} Products` : ""}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <PageCTA title={`Need a custom ${parent.name.toLowerCase()} quote?`} subtitle="Our factory can manufacture to your specifications." />
    </>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" /></div>}>
      <CategoryPageInner />
    </Suspense>
  );
}
