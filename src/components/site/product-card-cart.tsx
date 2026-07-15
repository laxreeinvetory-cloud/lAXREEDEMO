"use client";

import { useState } from "react";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import type { CatalogueProduct } from "@/lib/laxree/site-data";
import { FadeIn, GlassCard } from "@/components/site/page-primitives";

/**
 * ProductCardWithCart — product card with "Add to Cart" button.
 * Shows product image, model number, name, specs, and an add-to-cart button.
 * When clicked, adds the product to the cart and shows a success state.
 */
export function ProductCardWithCart({
  product,
  index,
}: {
  product: CatalogueProduct;
  index: number;
}) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.some((i) => i.model === product.model);

  const handleAdd = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <FadeIn delay={index * 0.04}>
      <GlassCard
        theme="ivory"
        radius="20px"
        className="flex h-full flex-col overflow-hidden"
      >
        {/* Product image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
          <img
            src={product.image}
            alt={`${product.name} — ${product.model}`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
          {/* Model number badge */}
          <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 font-mono text-[10px] text-brass backdrop-blur-sm">
            {product.model}
          </span>
          {/* In-cart indicator */}
          {inCart && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald/90 px-2.5 py-1 font-mono text-[9px] text-ivory backdrop-blur-sm">
              <Check size={10} strokeWidth={2.5} />
              IN CART
            </span>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-[18px] font-medium text-ink leading-tight">
            {product.name}
          </h3>
          <p className="mt-2 font-body text-[13px] leading-relaxed text-ink-muted">
            {product.description}
          </p>

          {/* Specifications */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {product.specs.slice(0, 6).map((spec) => (
              <div key={spec.label} className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted/60">
                  {spec.label}
                </span>
                <span className="font-body text-[12px] font-medium text-ink">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={justAdded}
            className={`mt-5 flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-medium uppercase tracking-wider transition-all duration-300 ${
              justAdded
                ? "bg-emerald text-ivory"
                : inCart
                  ? "border border-brass/40 bg-brass/10 text-brass hover:bg-brass hover:text-charcoal"
                  : "pill pill-brass cursor-pointer"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                Added!
              </>
            ) : inCart ? (
              <>
                <Plus size={14} strokeWidth={2.5} />
                Add Another
              </>
            ) : (
              <>
                <ShoppingBag size={14} strokeWidth={2} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </FadeIn>
  );
}
