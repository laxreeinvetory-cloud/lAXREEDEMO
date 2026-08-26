import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Become a Dealer | LaxRee Amenities" },
  description: "Find your nearest LaxRee hotel equipment supplier or dealer across India. Genuine amenities, furniture & fittings with pan-India delivery. LaxRee Amenities",
  keywords: ["hotel supplies dealership India", "become hotel amenities dealer", "LaxRee dealer program", "hotel products distributor", "hospitality supplies franchise"],
  alternates: { canonical: "https://www.laxree.com/dealers" },
  openGraph: {
    title: "Become a LaxRee Dealer — Hotel Supplies Dealership",
    description: "OEM pricing, protected territory, 700+ SKUs. Apply for dealership today.",
    url: "https://www.laxree.com/dealers",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function DealersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
