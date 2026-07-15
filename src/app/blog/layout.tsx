import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitality Trends Blog — Hotel Supplies Procurement Guides | LaxRee",
  description: "Expert procurement guides for hotel supplies in India: minibar buying guide, safe locker specs, RFID door lock comparison, kettle selection, soap dispenser guide, steam iron specs. Bulk pricing benchmarks included.",
  keywords: ["hotel supplies blog India", "hotel amenities procurement guide", "hotel minibar buying guide", "hotel safe locker guide", "RFID door lock guide", "hotel supplies blog", "hospitality trends 2026"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/blog" },
  openGraph: {
    title: "Hospitality Trends Blog — Hotel Supplies Guides | LaxRee",
    description: "Expert procurement guides for hotel supplies in India with bulk pricing benchmarks.",
    url: "https://l-axreedemo.vercel.app/blog",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
