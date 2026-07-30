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
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
} from "@/components/site/page-primitives";
import { db } from "@/lib/db";
import { ProductDetailCard } from "@/components/site/product-detail-card";

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
        image: p.image,
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

      {/* Amazon-style product detail cards */}
      <section className="section section-ivory py-12 md:py-16">
        <div className="container-laxree">
          <div className="flex flex-col gap-12">
            {allProducts.map((product, i) => (
              <FadeIn key={product.model} delay={i * 0.05}>
                <div className="pb-12 border-b border-ink/10 last:border-0">
                  <ProductDetailCard product={product} index={i} />
                </div>
              </FadeIn>
            ))}
          </div>

          {allProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-ink-muted">No products in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Other item types */}
      <section className="section section-charcoal py-16 md:py-20">
        <div className="container-laxree">
          <SectionHeading theme="charcoal" eyebrow="EXPLORE MORE" title="Other Item Types" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {siblingItems.map((other) => {
              const img = other.products[0]?.image || "/images/product-catalogue/coming-soon.jpg";
              return (
                <Link key={other.slug} href={`/products/${parent.slug}/${other.slug}`}
                  className="group glass-on-charcoal rounded-[20px] overflow-hidden transition-all duration-300 hover:border-brass/40">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
                    <img src={img} alt={other.name} loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-[14px] text-ivory">{other.name}</h3>
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
