import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Hotel Supplies Catalogue 2026 — PDF | LaxRee Amenities",
  description: "Download the complete LaxRee hotel supplies catalogue 2026. 700+ SKUs across amenities, furniture, linen, roofing and dome. Full specifications, pricing tiers, and lead times. PDF download available.",
  keywords: ["hotel supplies catalogue PDF", "hotel amenities catalogue download", "LaxRee catalogue 2026", "hotel products brochure India", "hospitality supplies catalog"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/catalogue" },
  openGraph: {
    title: "Download Hotel Supplies Catalogue 2026 — LaxRee Amenities",
    description: "700+ SKUs catalogue with full specifications. Download PDF instantly.",
    url: "https://l-axreedemo.vercel.app/catalogue",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
