"use client";

import { useState, useEffect } from "react";
import { Check, Crown, Star, Gem, ShoppingBag, Play, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import type { CatalogueProduct } from "@/lib/laxree/catalogue-data";

const TIER_STYLES: Record<string, { icon: typeof Crown; label: string; bg: string; text: string }> = {
  Essential: { icon: Check, label: "Essential", bg: "bg-emerald-600", text: "text-white" },
  Premium: { icon: Star, label: "Premium", bg: "bg-amber-600", text: "text-white" },
  Lux: { icon: Gem, label: "Lux", bg: "bg-purple-700", text: "text-white" },
};

/**
 * ProductDetailCard — Amazon-style product detail card.
 * Left: image gallery with thumbnails + video support
 * Right: title, model, description, specs table, add to cart button
 *
 * Multiple images and video URL are fetched from CMS:
 *   key: `product-images:<model>`
 *   value: { images: ["url1", "url2", ...], video: "url" }
 */
export function ProductDetailCard({
  product,
  index,
}: {
  product: CatalogueProduct;
  index: number;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [images, setImages] = useState<string[]>([product.image]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [justAdded, setJustAdded] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const { addItem } = useCart();
  const { openModal } = useEnquiry();

  useEffect(() => {
    // Fetch additional images + video from CMS
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
  }, [product.model, product.image]);

  const tier = (product as any).tier || "";
  const tierStyle = TIER_STYLES[tier];
  const specs = product.specs || [];
  const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 5);

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

  const showVideo = activeImage === -1;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* LEFT: Image Gallery (Amazon-style) */}
      <div className="flex flex-col gap-4">
        {/* Main image / video display */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-ink/10">
          {showVideo && videoUrl ? (
            <video src={videoUrl} controls autoPlay className="h-full w-full object-contain" />
          ) : (
            <img
              src={images[Math.max(0, activeImage)] || images[0]}
              alt={product.name}
              className="h-full w-full object-contain p-4"
            />
          )}
        </div>

        {/* Thumbnail gallery — clickable to change main image */}
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                activeImage === i ? "border-brass ring-2 ring-brass/20" : "border-ink/10 hover:border-brass/50"
              }`}
            >
              <img src={img} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-contain" />
            </button>
          ))}
          {/* Video thumbnail */}
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

        {/* Image count indicator */}
        {images.length > 1 && (
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            {images.length} images{videoUrl ? " + 1 video" : ""}
          </p>
        )}
      </div>

      {/* RIGHT: Product Details (Amazon-style) */}
      <div className="flex flex-col gap-5">
        {/* Tier badge */}
        {tierStyle && (
          <div className={`inline-flex items-center gap-1.5 rounded-full ${tierStyle.bg} ${tierStyle.text} px-3 py-1 text-xs font-semibold w-fit`}>
            <tierStyle.icon className="h-3 w-3" />
            {tierStyle.label} Tier
          </div>
        )}

        {/* Title + model */}
        <div>
          <h2 className="font-display text-xl md:text-2xl text-ink leading-tight">{product.name}</h2>
          <p className="mt-1 font-mono text-sm text-brass">Model: {product.model}</p>
        </div>

        {/* Description */}
        {product.description && (
          <p className="font-body text-sm text-ink-muted leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Specs table */}
        {specs.length > 0 && (
          <div className="rounded-xl border border-ink/10 overflow-hidden">
            <div className="bg-ink/5 px-4 py-2.5">
              <h3 className="font-display text-sm font-semibold text-ink">Product Specifications</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {visibleSpecs.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-ink/[0.02]"}>
                    <td className="px-4 py-2.5 font-mono text-xs text-ink-muted uppercase tracking-wider w-1/3 align-top">
                      {spec.label}
                    </td>
                    <td className="px-4 py-2.5 font-body text-ink">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {specs.length > 5 && (
              <button
                onClick={() => setShowAllSpecs(!showAllSpecs)}
                className="w-full px-4 py-2 text-xs font-semibold text-brass hover:bg-ink/5 transition-colors"
              >
                {showAllSpecs ? "Show Less" : `Show ${specs.length - 5} More Specs`}
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-yellow-600 text-black px-6 py-3 text-sm font-semibold hover:bg-yellow-500 transition-colors inline-flex items-center justify-center gap-2"
          >
            {justAdded ? (
              <><Check className="h-4 w-4" /> Added!</>
            ) : (
              <><ShoppingBag className="h-4 w-4" /> Add to Cart</>
            )}
          </button>
          <button
            onClick={() => openModal("enquiry")}
            className="flex-1 rounded-xl border border-ink/15 bg-white text-ink px-6 py-3 text-sm font-semibold hover:bg-ink/5 transition-colors inline-flex items-center justify-center gap-2"
          >
            Request Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
