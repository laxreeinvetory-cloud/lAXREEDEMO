import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Crown, Star, Gem } from "lucide-react";
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
  GlassCard,
} from "@/components/site/page-primitives";
import { ProductCardWithCart } from "@/components/site/product-card-cart";
import { db } from "@/lib/db";

/* ─────────────────────────────────────────────────────────────
   Tier configuration
   ───────────────────────────────────────────────────────────── */
const TIER_CONFIG: Record<
  string,
  { label: string; icon: typeof Crown; color: string; bgColor: string; borderColor: string; desc: string }
> = {
  Essential: {
    label: "Essential",
    icon: Check,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    desc: "Reliable quality at the best value. Ideal for standard hotel rooms and budget-conscious projects.",
  },
  Premium: {
    label: "Premium",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    desc: "Enhanced features and superior build. Perfect for upscale properties and guest satisfaction.",
  },
  Lux: {
    label: "Lux",
    icon: Gem,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    desc: "Luxury tier with premium materials and finishes. For 5-star properties and luxury suites.",
  },
};

// Dynamic rendering — reads from database for live product data
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   Pre-generate all [slug]/[itemSlug] combinations at build time.
   ───────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  // Generate all parent-slug / item-slug combinations
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
  const { itemSlug } = await params;
  const item = CATALOGUE_CATEGORIES.find((c) => c.slug === itemSlug);
  if (!item) return {};
  return {
    title: `${item.name} — All Models`,
    description: `All ${item.products.length} ${item.name} models with full specifications. ${item.products[0]?.description}`,
  };
}

/* ─────────────────────────────────────────────────────────────
   Item type page — shows all models of a specific item type
   grouped by tier (Essential, Premium, Lux)
   ───────────────────────────────────────────────────────────── */
export default async function ItemTypePage({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}) {
  const { slug, itemSlug } = await params;
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  const item = CATALOGUE_CATEGORIES.find((c) => c.slug === itemSlug);

  if (!item || !parent) notFound();

  // Load products from DB (live data — includes uploaded images)
  let dbProducts: Array<{
    model: string;
    name: string;
    category: string;
    image: string;
    description: string;
    specs: string;
    tier?: string;
  }> = [];
  try {
    const dbItems = await db.product.findMany({
      where: { category: item.name },
      orderBy: { sortOrder: "asc" },
    });
    dbProducts = dbItems.map((p) => ({
      model: p.model,
      name: p.name,
      category: p.category,
      image: p.image,
      description: p.description,
      specs: p.specs,
      tier: (() => {
        try {
          const specs = JSON.parse(p.specs);
          return undefined; // tier is not stored in specs; use from static data
        } catch {
          return undefined;
        }
      })(),
    }));
  } catch {
    // DB unavailable — use static data
  }

  // Merge: use DB products if available, otherwise static
  // For each static product, check if DB has an updated version
  const allProducts: CatalogueProduct[] = item.products.map((staticP) => {
    const dbP = dbProducts.find((p) => p.model === staticP.model);
    if (dbP) {
      // Use DB data (may have updated image, description, etc.)
      return {
        ...staticP,
        image: dbP.image || staticP.image,
        description: dbP.description || staticP.description,
        name: dbP.name || staticP.name,
      };
    }
    return staticP;
  });

  // Also add any DB products not in static data
  for (const dbP of dbProducts) {
    if (!allProducts.find((p) => p.model === dbP.model)) {
      allProducts.push({
        model: dbP.model,
        name: dbP.name,
        category: dbP.category,
        image: dbP.image,
        description: dbP.description,
        specs: (() => {
          try { return JSON.parse(dbP.specs); } catch { return []; }
        })(),
      });
    }
  }

  // Other items within the same parent
  const siblingItems = getCategoriesByParent(parent.slug).filter(
    (c) => c.slug !== itemSlug,
  );

  // Group products by tier
  const tierOrder = ["Essential", "Premium", "Lux"];
  const productsWithTier = allProducts.filter((p) => p.tier);
  const productsWithoutTier = allProducts.filter((p) => !p.tier);
  const tierGroups: Record<string, CatalogueProduct[]> = {};
  for (const tier of tierOrder) {
    tierGroups[tier] = productsWithTier.filter((p) => p.tier === tier);
  }
  const hasTiers = productsWithTier.length > 0;

  // SEO: Breadcrumb + ProductCollection structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://l-axreedemo.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://l-axreedemo.vercel.app/products" },
      { "@type": "ListItem", position: 3, name: "Amenities", item: "https://l-axreedemo.vercel.app/products/amenities" },
      { "@type": "ListItem", position: 4, name: item.name, item: `https://l-axreedemo.vercel.app/products/amenities/${itemSlug}` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${item.name} Collection`,
    numberOfItems: item.products.length,
    itemListElement: item.products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        sku: p.model,
        category: p.category,
        brand: { "@type": "Brand", name: "LaxRee Amenities" },
        manufacturer: { "@type": "Organization", name: "LaxRee Amenities" },
      },
    })),
  };

  return (
    <>
      {/* SEO: Breadcrumb + ItemList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* ── PageHero ── */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: parent.name, href: `/products/${slug}` },
          { label: item.name },
        ]}
        eyebrow={item.name.toUpperCase()}
        title={item.name}
        subtitle={`${item.products.length} models available across ${hasTiers ? "Essential, Premium & Lux tiers." : "all variants."} Add your preferred models to cart and submit for quotation.`}
      >
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">
              {item.products.length} Models
            </span>
          </div>
          {hasTiers && (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brass" />
              <span className="data-label text-[11px] text-sand">
                3 Tiers Available
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">
              Add to Cart
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brass" />
            <span className="data-label text-[11px] text-sand">
              Submit for Quotation
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
                {item.products.length} Models — Add to Cart
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products grouped by Tier ── */}
      {hasTiers ? (
        <>
          {tierOrder.map((tier) => {
            const tierProducts = tierGroups[tier];
            if (!tierProducts || tierProducts.length === 0) return null;
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;

            return (
              <section
                key={tier}
                className="section section-ivory py-16 md:py-20"
              >
                <div className="container-laxree">
                  {/* Tier header */}
                  <FadeIn>
                    <div
                      className={`mb-10 rounded-24px border-2 ${config.borderColor} ${config.bgColor} p-6 md:p-8`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${config.bgColor} ${config.color}`}
                        >
                          <Icon className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
                            Tier
                          </span>
                          <h2 className="font-display text-2xl md:text-3xl font-medium text-ink">
                            {config.label} Series
                          </h2>
                        </div>
                        <span className="ml-auto rounded-full bg-charcoal px-4 py-2 font-mono text-[11px] text-brass">
                          {tierProducts.length} {tierProducts.length === 1 ? "Model" : "Models"}
                        </span>
                      </div>
                      <p className="font-body text-[14px] leading-relaxed text-ink-muted max-w-3xl">
                        {config.desc}
                      </p>
                    </div>
                  </FadeIn>

                  {/* Product grid — larger cards for better image visibility */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tierProducts.map((prod, i) => (
                      <ProductCardWithCart
                        key={prod.model}
                        product={prod}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          {/* Products without tier (if any) */}
          {productsWithoutTier.length > 0 && (
            <section className="section section-ivory py-16 md:py-20">
              <div className="container-laxree">
                <SectionHeading
                  theme="ivory"
                  eyebrow="ALL MODELS"
                  title="All Variants"
                  body={`Browse all ${productsWithoutTier.length} models. Click "Add to Cart" on any model to add it to your quotation request.`}
                />
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productsWithoutTier.map((prod, i) => (
                    <ProductCardWithCart
                      key={prod.model}
                      product={prod}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* ── No tiers — show all products in a single grid ── */
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree">
            <SectionHeading
              theme="ivory"
              eyebrow="ALL MODELS"
              title={`All ${item.name} Models`}
              body={`Browse all ${item.products.length} models. Click "Add to Cart" on any model to add it to your quotation request.`}
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {item.products.map((prod, i) => (
                <ProductCardWithCart key={prod.model} product={prod} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Other item types ── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="EXPLORE MORE"
            title="Other Item Types"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {siblingItems.map((other) => (
              <Link
                key={other.slug}
                href={`/products/${parent.slug}/${other.slug}`}
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
            Back to All {parent.name}
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
