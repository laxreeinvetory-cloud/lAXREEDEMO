import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   Pre-generate the parent slugs at build time.
   ───────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  return CATALOGUE_PARENTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  if (!parent) return {};
  return {
    title: `${parent.name} — LaxRee Amenities Products`,
    description: parent.description,
  };
}

/* ─────────────────────────────────────────────────────────────
   ItemTypeCard — card for each item type within a parent category
   Links to /products/[parentSlug]/[itemSlug]
   ───────────────────────────────────────────────────────────── */
function ItemTypeCard({
  item,
  parentSlug,
  index,
  dbImage,
}: {
  item: (typeof CATALOGUE_CATEGORIES)[0];
  parentSlug: string;
  index: number;
  dbImage?: string;
}) {
  const image = dbImage || item.products[0]?.image || "/images/product-catalogue/coming-soon.jpg";
  return (
    <FadeIn delay={index * 0.06}>
      <Link
        href={`/products/${parentSlug}/${item.slug}`}
        className="group glass-on-ivory rounded-24px overflow-hidden transition-all duration-300 hover:border-brass/40 hover:shadow-xl flex flex-col h-full"
      >
        {/* Product image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
          <img
            src={image}
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
   Parent category page — shows all item types within a parent
   ───────────────────────────────────────────────────────────── */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  if (!parent) notFound();

  const children = getCategoriesByParent(parent.slug);
  const totalProducts = children.reduce((sum, c) => sum + c.products.length, 0);
  const otherParents = CATALOGUE_PARENTS.filter((p) => p.slug !== slug);

  // Fetch first product image from DB for each item type
  const itemImages: Record<string, string> = {};
  try {
    for (const child of children) {
      const dbProduct = await db.product.findFirst({
        where: { category: child.name },
        orderBy: { sortOrder: "asc" },
        select: { image: true },
      });
      if (dbProduct && !dbProduct.image.includes("coming-soon")) {
        itemImages[child.slug] = dbProduct.image;
      }
    }
  } catch {
    // DB unavailable — use static images
  }

  return (
    <>
      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: parent.name },
        ]}
        eyebrow={parent.name.toUpperCase()}
        title={parent.name}
        subtitle={parent.description}
      >
        {children.length > 0 && (
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                {children.length} Item Types
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                {totalProducts} Models
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

      {/* ── Item types grid ── */}
      {children.length > 0 ? (
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree">
            <SectionHeading
              theme="ivory"
              eyebrow="ITEM TYPES"
              title={`Browse ${parent.name} by Type`}
              body={`Click any item type below to see all available models with full specifications, images, and model numbers.`}
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((item, i) => (
                <ItemTypeCard
                  key={item.slug}
                  item={item}
                  parentSlug={parent.slug}
                  index={i}
                  dbImage={itemImages[item.slug]}
                />
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
              title={`${parent.name} Catalogue`}
              body={`The detailed product catalogue for ${parent.name} is being finalised. Contact us for custom quotes and specifications.`}
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
            {otherParents.map((p) => {
              const pChildren = getCategoriesByParent(p.slug);
              const img = pChildren[0]?.products[0]?.image || "/images/product-catalogue/coming-soon.jpg";
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group glass-on-charcoal rounded-20px overflow-hidden transition-all duration-300 hover:border-brass/40"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
                    <img
                      src={img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-[16px] text-ivory">
                      {p.name}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] text-brass">
                      {pChildren.length} {pChildren.length === 1 ? "Category" : "Categories"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PageCTA ── */}
      <PageCTA
        title={`Need a custom ${parent.name.toLowerCase()} quote?`}
        subtitle="Our factory can manufacture to your specifications."
      />
    </>
  );
}
