import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  CATEGORIES,
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
   Pre-generate the category slugs at build time.
   ───────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  // Generate params for all catalogue categories + all CATEGORIES slugs
  const slugs = new Set<string>();
  CATEGORIES.forEach((c) => slugs.add(c.slug));
  CATALOGUE_CATEGORIES.forEach((c) => slugs.add(c.slug));
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} — LaxRee Amenities Products`,
    description: `${category.name} category: ${category.count} products with full specifications. ${category.blurb}`,
  };
}

/* ─────────────────────────────────────────────────────────────
   ProductCard — individual product with image + specs
   ───────────────────────────────────────────────────────────── */
function ProductCard({ product, index }: { product: CatalogueProduct; index: number }) {
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
   Category page — server component
   ───────────────────────────────────────────────────────────── */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  // For "amenities" category, show ALL products from all catalogue categories
  // For other categories (furniture, linen, roofing, dome), show coming soon
  let products: CatalogueProduct[] = [];
  if (slug === "amenities") {
    // Flatten all catalogue categories' products
    products = CATALOGUE_CATEGORIES.flatMap((c) => c.products);
  } else {
    const catalogueCategory = CATALOGUE_CATEGORIES.find((c) => c.slug === slug);
    products = catalogueCategory?.products ?? [];
  }

  const otherCategories = CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <>
      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
        eyebrow={category.name.toUpperCase()}
        title={category.name}
        subtitle={`${category.blurb} — ${products.length > 0 ? `${products.length} products` : `${category.count} products`} available with full specifications.`}
      >
        {products.length > 0 && (
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                {products.length} Models Available
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
        )}
      </PageHero>

      {/* ── Category hero banner ── */}
      <section className="section section-charcoal pb-8">
        <div className="container-laxree">
          <div className="relative overflow-hidden rounded-24px aspect-[21/9]">
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="data-label text-[11px] text-brass">
                {category.name} Collection
              </span>
              <h2
                className="mt-2 font-display text-ivory"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 500 }}
              >
                {products.length > 0
                  ? `${products.length} Products with Full Specs`
                  : `${category.count} Products Available`}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products grid ── */}
      {products.length > 0 ? (
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree">
            <SectionHeading
              theme="ivory"
              eyebrow="PRODUCT CATALOGUE"
              title={`${category.name} Collection`}
              body={`All ${products.length} products in the ${category.name} category, with model numbers, specifications, and real catalogue images.`}
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((prod, i) => (
                <ProductCard key={prod.model} product={prod} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree max-w-2xl text-center">
            <SectionHeading
              theme="ivory"
              eyebrow="COMING SOON"
              title={`${category.name} Catalogue`}
              body={`The detailed product catalogue for ${category.name} is being finalised. Contact us for custom quotes and specifications.`}
            />
            <div className="mt-8">
              <Link
                href="/contact-us"
                className="pill pill-brass px-6 py-3 text-[13px] inline-flex items-center gap-2"
              >
                Request Custom Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Other categories ── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="EXPLORE MORE"
            title="Other Categories"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group glass-on-charcoal rounded-20px overflow-hidden transition-all duration-300 hover:border-brass/40"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-[16px] text-ivory">
                    {cat.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-brass">
                    {cat.count} Products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PageCTA ── */}
      <PageCTA
        title={`Need a custom ${category.name.toLowerCase()} quote?`}
        subtitle="Our factory can manufacture to your specifications."
      />
    </>
  );
}
