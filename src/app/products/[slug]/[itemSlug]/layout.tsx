import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}): Promise<Metadata> {
  const { slug, itemSlug } = await params;
  const { CATALOGUE_PARENTS, getCategoriesByParent } = await import(
    "@/lib/laxree/catalogue-data"
  );
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  if (!parent) return {};

  const children = getCategoriesByParent(parent.slug);
  const child = children.find((c) => c.slug === itemSlug);
  if (!child) return {};

  const canonicalUrl = `https://www.laxree.com/products/${slug}/${itemSlug}`;
  return {
    title: `${child.name} — ${parent.name} | LaxRee Amenities`,
    description: `${child.name} products under ${parent.name}. Browse all models with full specifications.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${child.name} — ${parent.name} | LaxRee Amenities`,
      description: `${child.name} products under ${parent.name}. Browse all models with full specifications.`,
      url: canonicalUrl,
      siteName: "LaxRee Amenities",
      type: "website",
      locale: "en_IN",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
