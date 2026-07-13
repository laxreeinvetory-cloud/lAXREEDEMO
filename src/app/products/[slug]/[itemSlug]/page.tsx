import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  CATALOGUE_CATEGORIES,
  type CatalogueProduct,
} from "@/lib/laxree/site-data";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";

/* ─────────────────────────────────────────────────────────────
   Pre-generate all [slug]/[itemSlug] combinations at build time.
   ───────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  // Only amenities has item types for now
  return CATALOGUE_CATEGORIES.map((item) => ({
    slug: "amenities",
    itemSlug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}): Promise<Metadata> {
  const { itemSlug } = await params;
  const item = CATALOGUE_CATEGORIES.find((c) => c.slug === itemSlug);
  if (!item) return {};
  return {
    title: `${item.name} — All Models | LaxRee Amenities`,
    description: `All ${item.products.length} ${item.name} models with full specifications. ${item.products[0]?.description}`,
  };
}

/* ─────────────────────────────────────────────────────────────
   ProductCard — individual product model with image + specs
   ───────────────────────────────────────────────────────────── */
function ProductCard({
  product,
  index,
}: {
  product: CatalogueProduct;
  index: number;
}) {
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
            {product.specs.map((spec) => (
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
        </div>
      </GlassCard>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────────────────────
   Item type page — shows all models of a specific item type
   e.g. /products/amenities/mini-bar → all minibar models
   ───────────────────────────────────────────────────────────── */
export default async function ItemTypePage({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}) {
  const { slug, itemSlug } = await params;
  const item = CATALOGUE_CATEGORIES.find((c) => c.slug === itemSlug);

  if (!item) notFound();

  // Get other item types for navigation
  const otherItems = CATALOGUE_CATEGORIES.filter((c) => c.slug !== itemSlug);

  return (
    <>
      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Amenities", href: `/products/${slug}` },
          { label: item.name },
        ]}
        eyebrow={item.name.toUpperCase()}
        title={item.name}
        subtitle={`${item.products.length} models available with full specifications, images, and model numbers.`}
      >
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">
              {item.products.length} Models
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">
              Full Specifications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">
              OEM Manufactured
            </span>
          </div>
        </div>
      </PageHero>

      {/* ── Category hero banner ── */}
      <section className="section section-charcoal pb-8">
        <div className="container-laxree">
          <div className="relative overflow-hidden rounded-24px aspect-[21/9]">
            <img
              src={item.products[0]?.image}
              alt={item.name}
              className="absolute inset-0 h-full w-full object-contain opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="data-label text-[11px] text-brass">
                {item.name} Collection
              </span>
              <h2
                className="mt-2 font-display text-ivory"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 500 }}
              >
                {item.products.length} Models with Full Specs
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products grid ── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="ALL MODELS"
            title={`All ${item.name} Models`}
            body={`Browse all ${item.products.length} models below. Each product includes model number, specifications, and a real catalogue image.`}
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {item.products.map((prod, i) => (
              <ProductCard key={prod.model} product={prod} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Other item types ── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="EXPLORE MORE"
            title="Other Item Types"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {otherItems.map((other) => (
              <Link
                key={other.slug}
                href={`/products/amenities/${other.slug}`}
                className="group glass-on-charcoal rounded-20px overflow-hidden transition-all duration-300 hover:border-brass/40"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
                  <img
                    src={other.products[0]?.image}
                    alt={other.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-[16px] text-ivory">
                    {other.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-brass">
                    {other.products.length} Models
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back to Amenities link ── */}
      <section className="section section-ivory py-12">
        <div className="container-laxree text-center">
          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-brass hover:gap-3 transition-all"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to All Amenities
          </Link>
        </div>
      </section>

      {/* ── PageCTA ── */}
      <PageCTA
        title={`Need a custom ${item.name.toLowerCase()} quote?`}
        subtitle="Our factory can manufacture to your specifications."
      />
    </>
  );
}
