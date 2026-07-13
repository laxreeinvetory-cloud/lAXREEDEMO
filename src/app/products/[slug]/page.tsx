import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  CATEGORIES,
  CATALOGUE_CATEGORIES,
} from "@/lib/laxree/site-data";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";

/* ─────────────────────────────────────────────────────────────
   Pre-generate the category slugs at build time.
   ───────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  const slugs = new Set<string>();
  CATEGORIES.forEach((c) => slugs.add(c.slug));
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
   ItemTypeCard — card for each item type (Minibar, Kettle, etc.)
   Links to /products/[category]/[itemSlug]
   ───────────────────────────────────────────────────────────── */
function ItemTypeCard({
  item,
  index,
}: {
  item: (typeof CATALOGUE_CATEGORIES)[0];
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.06}>
      <Link
        href={`/products/amenities/${item.slug}`}
        className="group glass-on-ivory rounded-24px overflow-hidden transition-all duration-300 hover:border-brass/40 hover:shadow-xl flex flex-col h-full"
      >
        {/* Product image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
          <img
            src={item.products[0]?.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {/* Model count badge */}
          <span className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 font-mono text-[10px] text-brass backdrop-blur-sm">
            {item.products.length} Models
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-[20px] font-medium text-ink leading-tight">
            {item.name}
          </h3>
          <p className="mt-2 font-body text-[13px] leading-relaxed text-ink-muted line-clamp-2">
            {item.products[0]?.description}
          </p>
          <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-brass">
            View All Models
            <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────────────────────
   Category page — server component
   For "amenities": shows item type cards (Minibar, Kettle, etc.)
   For other categories: shows coming soon
   ───────────────────────────────────────────────────────────── */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const otherCategories = CATEGORIES.filter((c) => c.slug !== slug);
  const hasProducts = slug === "amenities" && CATALOGUE_CATEGORIES.length > 0;

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
        subtitle={`${category.blurb} — ${category.count} products available with full specifications.`}
      >
        {hasProducts && (
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                {CATALOGUE_CATEGORIES.length} Item Types
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                {CATALOGUE_CATEGORIES.reduce((sum, c) => sum + c.products.length, 0)} Models
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                Full Specifications
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
                {hasProducts
                  ? `${CATALOGUE_CATEGORIES.length} Item Types, ${CATALOGUE_CATEGORIES.reduce((sum, c) => sum + c.products.length, 0)} Models`
                  : `${category.count} Products Available`}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── Item types grid (amenities) ── */}
      {hasProducts ? (
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree">
            <SectionHeading
              theme="ivory"
              eyebrow="ITEM TYPES"
              title={`Browse ${category.name} by Type`}
              body={`Click any item type below to see all available models with full specifications, images, and model numbers.`}
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CATALOGUE_CATEGORIES.map((item, i) => (
                <ItemTypeCard key={item.slug} item={item} index={i} />
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
