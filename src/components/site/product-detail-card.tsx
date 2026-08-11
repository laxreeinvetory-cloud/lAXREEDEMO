"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Crown, Star, Gem, ShoppingBag, Play, ChevronDown, ArrowRight } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import type { CatalogueProduct } from "@/lib/laxree/catalogue-data";

const TIER_STYLES: Record<string, { icon: typeof Crown; label: string; bg: string; text: string }> = {
  Essential: { icon: Check, label: "Essential", bg: "bg-emerald-600", text: "text-white" },
  Premium: { icon: Star, label: "Premium", bg: "bg-amber-600", text: "text-white" },
  Lux: { icon: Gem, label: "Lux", bg: "bg-purple-700", text: "text-white" },
};

/* ─────────────────────────────────────────────────────────────
   ProductPageWithSelector — shows ONE product at a time with
   a dropdown to switch between models. Amazon-style detail.
   ───────────────────────────────────────────────────────────── */
export function ProductPageWithSelector({
  products,
  categoryName,
}: {
  products: CatalogueProduct[];
  categoryName: string;
  parentSlug: string;
  itemSlug: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [justAdded, setJustAdded] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const { addItem } = useCart();
  const { openModal } = useEnquiry();

  const product = products[selectedIdx];

  useEffect(() => {
    if (!product) return;
    setActiveImage(0);
    setShowAllSpecs(false);
    setImages([product.image]);
    setVideoUrl("");

    // Fetch additional images from CMS
    fetch(`/api/admin/cms?key=product-images:${product.model}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.value) {
          const imgs: string[] = [product.image];
          if (data.value.images && Array.isArray(data.value.images)) {
            for (const img of data.value.images) {
              if (img && !imgs.includes(img)) imgs.push(img);
            }
          }
          if (data.value.video) setVideoUrl(data.value.video);
          setImages(imgs);
        }
      })
      .catch(() => {});
  }, [selectedIdx, product]);

  if (!product) return null;

  const tier = (product as any).tier || "";
  const tierStyle = TIER_STYLES[tier];
  const specs = product.specs || [];
  const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 6);
  const showVideo = activeImage === -1;

  const handleAddToCart = () => {
    addItem({
      model: product.model,
      name: product.name,
      category: product.category,
      image: images[0],
      specs: [],
      description: product.description || "",
      link: "",
      slug: product.model,
    } as any);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Model selector dropdown */}
      <div className="mb-6 relative">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
          Select Model ({products.length} available)
        </label>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full max-w-md flex items-center justify-between rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink hover:bg-ink/5 cursor-pointer"
        >
          <span className="font-medium">{product.model} — {product.name}</span>
          <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute z-50 mt-1 w-full max-w-md rounded-xl border border-ink/15 bg-white shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
            {products.map((p, i) => (
              <button
                key={p.model}
                onClick={() => { setSelectedIdx(i); setDropdownOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                  i === selectedIdx ? "bg-brass/10 text-brass" : "text-ink hover:bg-ink/5"
                }`}
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={p.image} alt={p.model} className="h-full w-full object-contain" style={{ filter: "brightness(0.92) contrast(1.08)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-brass">{p.model}</p>
                  <p className="font-body text-sm text-ink truncate">{p.name}</p>
                </div>
                {i === selectedIdx && <Check className="h-4 w-4 text-brass shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Amazon-style product detail — 2 column layout (Dolphy-inspired) */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main image / video — large, shadowed */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-ink/10 shadow-lg">
            {showVideo && videoUrl ? (
              <video src={videoUrl} controls autoPlay className="h-full w-full object-contain" />
            ) : (
              <img
                src={images[Math.max(0, activeImage)] || images[0]}
                alt={product.name}
                className="h-full w-full object-contain p-8"
                style={{ filter: "brightness(0.95) contrast(1.05)" }}
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === i ? "border-brass ring-2 ring-brass/20" : "border-ink/10 hover:border-brass/50"
                }`}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-contain" style={{ filter: "brightness(0.95) contrast(1.05)" }} />
              </button>
            ))}
            {videoUrl && (
              <button
                onClick={() => setActiveImage(-1)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 relative grid place-items-center bg-charcoal ${
                  showVideo ? "border-brass ring-2 ring-brass/20" : "border-ink/10 hover:border-brass/50"
                }`}
              >
                <Play className="h-6 w-6 text-brass" fill="currentColor" />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
              {images.length} images{videoUrl ? " + 1 video" : ""}
            </p>
          )}
        </div>

        {/* RIGHT: Product Info (Dolphy-style) */}
        <div className="flex flex-col gap-5">
          {/* Tier badge */}
          {tierStyle && (
            <div className={`inline-flex items-center gap-1.5 rounded-full ${tierStyle.bg} ${tierStyle.text} px-3 py-1 text-xs font-semibold w-fit`}>
              <tierStyle.icon className="h-3 w-3" />
              {tierStyle.label} Tier
            </div>
          )}

          {/* Title — h2 (PageHero already has the page h1) */}
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight font-medium">
            {product.name}
          </h2>

          {/* Model badge (Dolphy-style pill) */}
          <div className="inline-flex items-center rounded-full bg-ink/5 px-4 py-1.5 w-fit">
            <span className="font-mono text-sm text-ink-muted">
              Model: <span className="font-semibold text-ink">{product.model}</span>
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="font-body text-[15px] text-ink-muted leading-relaxed">
              {product.description}
            </p>
          )}

          {/* SEO description block — additional descriptive text for crawlers */}
          <div className="mt-2 rounded-2xl border border-ink/10 bg-white/40 p-5">
            <p className="font-body text-[14px] leading-relaxed text-ink-muted">
              The <strong className="text-ink">{product.name}</strong> ({product.model}) is part of LaxRee Amenities&rsquo; {categoryName} range for hotels, resorts, and serviced apartments. Manufactured in our Ajmer factory with ISO-certified quality control, every unit ships with a 2-year warranty and 7-year spare-parts guarantee. Bulk pricing is available for hospitality procurement teams ordering 50+ units &mdash; request a quotation for tiered pricing, custom branding, branded packaging, and tender-ready documentation. LaxRee Amenities is an OEM hotel supplies manufacturer pan-India, with delivery to all 28 states and 1,347+ projects delivered.
            </p>
          </div>

          {/* CTA Buttons (Dolphy-style: orange + green) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => openModal("enquiry")}
              className="flex-1 rounded-full bg-brass text-charcoal px-6 py-3.5 text-sm font-semibold hover:bg-brass-light transition-colors inline-flex items-center justify-center gap-2"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full border-2 border-charcoal text-charcoal px-6 py-3.5 text-sm font-semibold hover:bg-charcoal hover:text-ivory transition-colors inline-flex items-center justify-center gap-2"
            >
              {justAdded ? (
                <><Check className="h-4 w-4" /> Added!</>
              ) : (
                <><ShoppingBag className="h-4 w-4" /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Table (Dolphy-style zebra striping, full width below) */}
      {specs.length > 0 && (
        <div className="mt-10 rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
          {/* Table header — charcoal green bar */}
          <div className="bg-charcoal px-6 py-4">
            <h3 className="font-display text-lg font-medium text-ivory">
              Product Specifications
            </h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {visibleSpecs.map((spec, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-ivory/40"}
                >
                  <td className="px-6 py-3.5 font-mono text-xs text-ink-muted uppercase tracking-wider w-1/3 align-top border-r border-ink/5">
                    {spec.label}
                  </td>
                  <td className="px-6 py-3.5 font-body text-[14px] text-ink">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {specs.length > 6 && (
            <button
              onClick={() => setShowAllSpecs(!showAllSpecs)}
              className="w-full px-6 py-3 text-xs font-semibold text-brass hover:bg-ink/5 transition-colors border-t border-ink/10"
            >
              {showAllSpecs ? "▲ Show Less" : `▼ Show ${specs.length - 6} More Specifications`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SuggestionCard — small card showing another model in the
   same category. Click to switch to that product.
   ───────────────────────────────────────────────────────────── */
export function SuggestionCard({
  product,
  index,
}: {
  product: CatalogueProduct;
  index: number;
}) {
  return (
    <div className="glass-on-charcoal rounded-[20px] overflow-hidden transition-all duration-300 hover:border-brass/40">
      <div className="aspect-square w-full overflow-hidden bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-105"
          style={{ filter: "brightness(0.92) contrast(1.08)" }}
        />
      </div>
      <div className="p-3">
        <p className="font-mono text-[10px] text-brass truncate">{product.model}</p>
        <p className="font-body text-[12px] text-ivory line-clamp-2 mt-0.5">{product.name}</p>
      </div>
    </div>
  );
}
