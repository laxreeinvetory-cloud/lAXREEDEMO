import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { CATALOGUE_PARENTS } = await import("@/lib/laxree/catalogue-data");
  const parent = CATALOGUE_PARENTS.find((p) => p.slug === slug);
  if (!parent) return {};

  const canonicalUrl = `https://www.laxree.com/products/${slug}`;
  return {
    title: `${parent.name} — LaxRee Amenities Products`,
    description: parent.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${parent.name} — LaxRee Amenities Products`,
      description: parent.description,
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
