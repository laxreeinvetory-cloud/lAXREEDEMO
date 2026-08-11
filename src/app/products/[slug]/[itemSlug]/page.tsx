import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_PARENTS,
  getCategoriesByParent,
  type CatalogueProduct,
} from "@/lib/laxree/catalogue-data";
import { getSubcategoryImage, getProductImage, PARENT_FALLBACK_IMAGE } from "@/lib/laxree/product-images";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import { db } from "@/lib/db";
import { ProductPageWithSelector, SuggestionCard } from "@/components/site/product-detail-card";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  const params: { slug: string; itemSlug: string }[] = [];
  for (const parent of CATALOGUE_PARENTS) {
    const children = getCategoriesByParent(parent.slug);
    for (const child of children) {
      params.push({ slug: parent.slug, itemSlug: child.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}): Promise<Metadata> {
  const { slug, itemSlug } = await params;
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  const item = CATALOGUE_CATEGORIES.find((c) => c.slug === itemSlug);
  if (!parent || !item) return {};
  return {
    title: `${item.name} — All Models`,
    description: `Browse all ${item.name} models with full specifications, images, and model numbers.`,
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}) {
  const { slug, itemSlug } = await params;
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  const item = CATALOGUE_CATEGORIES.find((c) => c.slug === itemSlug);

  if (!item || !parent) notFound();

  // Load products from DB
  let allProducts: CatalogueProduct[] = [];
  try {
    const categoryFilters = [item.name];
    if (item.name === "Bath Tub Models") categoryFilters.push("Bath Tub");
    if (item.name === "Bath Tub") categoryFilters.push("Bath Tub Models");
    if (item.name === "Amenities Tray Sets") categoryFilters.push("Amenities Tray Set");
    if (item.name === "Amenities Tray Set") categoryFilters.push("Amenities Tray Sets");
    if (item.name === "Dome & Space POD Models") categoryFilters.push("Dome & Space POD");
    if (item.name === "Dome & Space POD") categoryFilters.push("Dome & Space POD Models");

    const dbItems = await db.product.findMany({
      where: { category: { in: categoryFilters } },
      orderBy: { sortOrder: "asc" },
    });
    const realProducts = dbItems.filter((p) => !p.model.startsWith("TBD"));
    if (realProducts.length > 0) {
      allProducts = realProducts.map((p) => ({
        model: p.model,
        name: p.name,
        category: p.category,
        image: getProductImage(p.model, p.image),
        description: p.description,
        specs: (() => { try { return JSON.parse(p.specs); } catch { return []; } })(),
      }));
    } else {
      allProducts = item.products;
    }
  } catch {
    allProducts = item.products;
  }

  const siblingItems = getCategoriesByParent(parent.slug).filter((c) => c.slug !== itemSlug);
  const otherParents = CATALOGUE_PARENTS.filter((p) => p.slug !== slug);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: parent.name, href: `/products/${parent.slug}` },
          { label: item.name },
        ]}
        eyebrow={parent.name.toUpperCase()}
        title={item.name}
        subtitle={`${allProducts.length} models available. Click any product to see full details, images, and specifications.`}
      />

      {/* SEO intro paragraph — descriptive text for search engines */}
      <section className="section section-ivory pt-8 md:pt-10 pb-0">
        <div className="container-laxree">
          <div className="mx-auto max-w-3xl">
            <p className="font-body text-[15px] leading-relaxed text-ink-muted">
              Browse our complete range of {item.name.toLowerCase()} for hotels and resorts. LaxRee Amenities manufactures and supplies premium {item.name.toLowerCase()} across India, with full OEM capabilities, custom branding options, and bulk pricing for hospitality procurement teams. {allProducts.length} models are listed below with full specifications, model numbers, and product images — request a quotation for volume pricing, sample units, or custom manufacturing specifications.
            </p>
          </div>
        </div>
      </section>

      {/* Product selector + single product detail */}
      <section className="section section-ivory py-8 md:py-12">
        <div className="container-laxree">
          <ProductPageWithSelector
            products={allProducts}
            categoryName={item.name}
            parentSlug={parent.slug}
            itemSlug={itemSlug}
          />

          {allProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-ink-muted">No products in this category yet.</p>
              <Link
                href={`/products/${parent.slug}`}
                className="mt-4 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-brass hover:text-brass-light transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                Back to {parent.name}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Suggestion models — other products in same category */}
      {allProducts.length > 1 && (
        <section className="section section-charcoal py-12 md:py-16">
          <div className="container-laxree">
            <SectionHeading theme="charcoal" eyebrow="YOU MAY ALSO LIKE" title="Other Models" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {allProducts.map((product, i) => (
                <SuggestionCard key={product.model} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other item types */}
      <section className="section section-ivory py-12 md:py-16">
        <div className="container-laxree">
          <SectionHeading theme="ivory" eyebrow="EXPLORE MORE" title={`Other ${parent.name} Item Types`} />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {siblingItems.map((other) => {
              const img = getSubcategoryImage(other.slug, other.products[0]?.image);
              return (
                <Link key={other.slug} href={`/products/${parent.slug}/${other.slug}`}
                  className="group glass-on-ivory rounded-[20px] overflow-hidden transition-all duration-300 hover:border-brass/40">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-white">
                    <img src={img} alt={other.name} loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-[14px] text-ink">{other.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Back to parent category */}
          <div className="mt-10 text-center">
            <Link
              href={`/products/${parent.slug}`}
              className="pill pill-ghost-brass px-6 py-3 text-[12px] inline-flex items-center gap-2"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Back to all {parent.name}
            </Link>
          </div>
        </div>
      </section>

      {/* Other Categories — internal links to every other parent category */}
      <section className="section section-charcoal py-12 md:py-16">
        <div className="container-laxree">
          <SectionHeading theme="charcoal" eyebrow="EXPLORE MORE" title="Other Categories" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {otherParents.map((p) => {
              const pChildren = getCategoriesByParent(p.slug);
              const otherImage =
                PARENT_FALLBACK_IMAGE[p.slug] ||
                "/images/product-catalogue/coming-soon.jpg";
              return (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group glass-on-charcoal rounded-[20px] overflow-hidden transition-all duration-300 hover:border-brass/40">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
                    <img src={otherImage} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-[16px] text-ivory">{p.name}</h3>
                    <p className="mt-1 font-mono text-[11px] text-brass">{pChildren.length} {pChildren.length === 1 ? "Category" : "Categories"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <PageCTA
        title={`Need a custom ${item.name.toLowerCase()} quote?`}
        subtitle="Our factory can manufacture to your specifications."
      />
    </>
  );
}
