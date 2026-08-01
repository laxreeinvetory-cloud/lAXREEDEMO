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
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";

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

/* ─────────────────────────────────────────────────────────────
   Sub-category slug → representative real product image.
   Every path below exists on disk, so the "Browse by Type" grid and
   the "Other Categories" rail never show the coming-soon placeholder
   even when the API has no real product image for that sub-category.
   ───────────────────────────────────────────────────────────── */
const SUBCATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  // ── Room Amenities ──
  "mini-bar": "/images/product-catalogue/mini-bar/LRMB-126.jpg",
  "tea-kettle": "/images/product-catalogue/tea-kettle/LRWT--143.jpg",
  "kettle-tray": "/images/product-catalogue/tray/LRWT-158.jpg",
  "safe-box": "/images/product-catalogue/safe-box/LRMR-252-10.jpg",
  "wooden-hangers": "/images/product-catalogue/hangers/LRRA-653.jpg",
  "rfid-locks": "/images/product-catalogue/door-lock/LRFD--613.jpg",
  "room-telephone": "/images/product-catalogue/telephone/LRDR--189.jpg",
  "docking-pod": "/images/product-catalogue/ssp-docking-pod/LRDR-177.jpg",
  "room-dustbin": "/images/product-catalogue/dustbin/LRRA--649.jpg",
  "desktop-accessories": "/images/product-catalogue/desktop-accessories/LRAT-370.jpg",
  "rollaway-bed": "/images/product-catalogue/rollaway-bed/LRMR-251.jpg",
  "mattress": "/images/product-catalogue/mattress/LRMR-251-8.jpg",
  "iron-iron-board": "/images/product-catalogue/excel-images/Ironing-Board.jpg",
  "emergency-torch": "/images/product-catalogue/emergency-torch/LRET-351.jpg",
  "luggage-rack": "/images/product-catalogue/furniture/LRGF---673---Luggage-Rack.jpg",
  // ── Washroom Amenities ──
  "hair-dryer": "/images/product-catalogue/hair-dryer/LRHD-276.jpg",
  "soap-dispenser": "/images/product-catalogue/soap-dispenser/LRWA--358.jpg",
  "magnifying-mirror": "/images/product-catalogue/magnifying-mirror/LRMM-302.jpg",
  "lobby-soap-dispenser": "/images/product-catalogue/lobby-soap-dispenser/LRWA-372.jpg",
  "weighing-scale": "/images/product-catalogue/weighing-scale/LRWA-327.jpg",
  "paper-dispenser": "/images/product-catalogue/paper-dispenser/LRWA-378.jpg",
  "hand-dryer": "/images/product-catalogue/hand-dryer/LRHD--285.jpg",
  "shower-mat": "/images/product-catalogue/shower-mat/LRWA-346.jpg",
  "cloth-line": "/images/product-catalogue/cloth-line/LRWA-350.jpg",
  "towel-rack": "/images/product-catalogue/towel-rack/LRWA-347.jpg",
  "toilet-paper-dispenser": "/images/product-catalogue/toilet-paper-dispenser/LRWA-355.jpg",
  "towel-rod": "/images/product-catalogue/towel-rod/LRWA-348.jpg",
  "washroom-tray": "/images/product-catalogue/washroom-tray/LRWA--372-Automatic.jpg",
  "handicap-grab-bar": "/images/product-catalogue/handicap-grab-bar/LRWA-349.jpg",
  // ── Lobby Items ──
  "luggage-trolley": "/images/product-catalogue/luggage-trolley-LT-801.jpg",
  "housekeeping-trolley": "/images/product-catalogue/housekeeping-trolley/LRHT--425.jpg",
  "lobby-dustbin": "/images/product-catalogue/ssp-lobby-dustbins/LRLI-445.jpg",
  "q-manager": "/images/product-catalogue/ssp-q-manager/LRLI-457B.jpg",
  "sign-board": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.jpg",
  "stand-pole": "/images/product-catalogue/ssp-sign-board/LRLI-458-Twisted.jpg",
  "digital-signage": "/images/product-catalogue/ssp-digital-signage/LRDS-43.jpg",
  // ── Furniture ──
  "outdoor-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "guest-room-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "restaurant-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "room-furniture": "/images/product-catalogue/furniture/3-Tab-Shingles.jpg",
  "garden-umbrella": "/images/product-catalogue/excel-images/Golf-Umbrella.jpg",
  // ── Linen ──
  "room-linen": "/images/product-catalogue/room-linen/bedsheet-plain.jpg",
  "bath-linen": "/images/product-catalogue/bath-linen/bath-towel-brown.jpg",
  // ── Bath Tub ──
  "bath-tub-models": "/images/product-catalogue/bath-tub/LRBT---311-Color-Body.jpg",
  // ── Amenities Tray Set ──
  "amenities-tray-set-models": "/images/product-catalogue/amenities-tray-set/LRAT-366.jpg",
  // ── Dome & Space POD ──
  "dome-models": "/images/product-catalogue/dome-space-pod/LRDO---2001--4-2-Mtr.jpg",
};

/* ─────────────────────────────────────────────────────────────
   Parent slug → category-level hero image (used in the "Other
   Categories" rail at the bottom of each /products/[slug] page).
   ───────────────────────────────────────────────────────────── */
const PARENT_FALLBACK_IMAGE: Record<string, string> = {
  "room-amenities": "/images/categories/amenities.jpg",
  "washroom-amenities": "/images/categories/washroom.jpg",
  "lobby-items": "/images/categories/lobby.jpg",
  "furniture": "/images/categories/furniture.jpg",
  "linen": "/images/categories/linen.jpg",
  "bath-tub": "/images/products/bath-tub.jpg",
  "amenities-tray-set": "/images/product-catalogue/amenities-tray-set/LRAT-366.jpg",
  "dome-space-pod": "/images/categories/dome.jpg",
};

function CategoryPageInner() {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";
  const [itemImages, setItemImages] = useState<Record<string, { image: string; count: number }>>({});
  const [otherImages, setOtherImages] = useState<Record<string, { image: string; count: number }>>({});

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
          const withImage = childProducts.find((p: { image: string }) => !p.image.includes("coming-soon"));
          // Use real product image when available; otherwise the
          // sub-category-level fallback (always on disk); only fall back
          // to coming-soon.jpg when no mapping exists.
          const fallback = SUBCATEGORY_FALLBACK_IMAGE[child.slug] || "/images/product-catalogue/coming-soon.jpg";
          images[child.slug] = { image: withImage?.image || fallback, count: childProducts.length };
        }
        setItemImages(images);
        const otherImgs: Record<string, { image: string; count: number }> = {};
        for (const other of otherParents) {
          const otherCatNames = PARENT_CATEGORY_MAP[other.slug] || [];
          const otherProducts = allProducts.filter((p: { category: string; image: string }) => otherCatNames.includes(p.category));
          const withImage = otherProducts.find((p: { image: string }) => !p.image.includes("coming-soon"));
          const fallback = PARENT_FALLBACK_IMAGE[other.slug] || "/images/product-catalogue/coming-soon.jpg";
          otherImgs[other.slug] = { image: withImage?.image || fallback, count: otherProducts.length };
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
                return (
                  <FadeIn key={item.slug} delay={i * 0.06}>
                    <Link
                      href={`/products/${parent.slug}/${item.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-ink/10 bg-white transition-all duration-300 hover:border-brass/40 hover:shadow-2xl hover:shadow-brass/10"
                    >
                      {/* Image area — white bg, object-contain, subtle zoom on hover */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-white to-ivory/50">
                        <img
                          src={preview?.image || "/images/product-catalogue/coming-soon.jpg"}
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
              return (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group glass-on-charcoal rounded-[20px] overflow-hidden transition-all duration-300 hover:border-brass/40">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
                    <img src={preview?.image || "/images/product-catalogue/coming-soon.jpg"} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
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
