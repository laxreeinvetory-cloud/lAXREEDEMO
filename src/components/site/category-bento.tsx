"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES, type Category } from "@/lib/laxree/site-data";
import {
  useTilt,
  usePrefersReducedMotion,
} from "@/hooks/laxree/use-laxree-motion";

type CategoryCardProps = {
  category: Category;
  large?: boolean;
  index: number;
};

function CategoryCard({ category, large = false, index }: CategoryCardProps) {
  const reduced = usePrefersReducedMotion();
  const tilt = useTilt(6);

  const spanClasses = large
    ? "md:col-span-2 lg:col-span-6 lg:row-span-2"
    : "lg:col-span-3";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={reduced ? undefined : tilt.handleMove}
      onMouseLeave={reduced ? undefined : tilt.handleLeave}
      style={reduced ? undefined : { ...tilt.style, display: "block" }}
      className={`${spanClasses} ${large ? "min-h-[480px]" : "min-h-[280px]"}`}
    >
      <Link
        href={`/products/${category.slug}`}
        aria-label={`${category.name} — ${category.count} products`}
        className="group relative block h-full w-full overflow-hidden rounded-24px border border-brass/0 transition-colors duration-500 hover:border-brass/40 focus-visible:border-brass/60"
      >
        {/* Background image */}
        <img
          src={category.image}
          alt={category.name}
          width={large ? 1200 : 800}
          height={large ? 1200 : 560}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Charcoal → transparent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

        {/* Subtle top sheen for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-transparent opacity-60" />

        {/* Bottom-left content */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3
            className="font-display text-ivory leading-tight"
            style={{ fontSize: "28px" }}
          >
            {category.name}
          </h3>
          <p className="mt-1.5 font-mono text-[13px] tracking-wide text-brass">
            {category.count} Products
          </p>
          {large && (
            <p className="mt-3 max-w-sm font-sans text-[13px] leading-relaxed text-sand">
              {category.blurb}
            </p>
          )}
        </div>

        {/* Corner accent — brass dot that brightens on hover */}
        <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-brass/30 bg-charcoal/30 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
          <span className="block h-1.5 w-1.5 rounded-full bg-brass" />
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryBento() {
  return (
    <section
      id="categories"
      className="section section-ivory py-24 md:py-32"
    >
      <div className="container-laxree">
        {/* Section header */}
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="eyebrow text-ink-muted">What We Supply</span>
          <h2
            className="mt-4 font-display text-ink leading-[1.05]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Five Categories. One Standard.
          </h2>
          <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-ink-muted">
            From a single minibar to a full resort build-out — one supplier,
            one quality bar, one invoice.
          </p>
        </div>

        {/* Bento grid
            - Mobile: 1-col stack
            - Tablet (md): 2-col, Amenities spans both
            - Desktop (lg): 12-col / 2-row bento — Amenities 6×2, others 3×1 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
          {CATEGORIES.map((category: Category, i: number) => (
            <CategoryCard
              key={category.slug}
              category={category}
              large={category.span === "large"}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryBento;
