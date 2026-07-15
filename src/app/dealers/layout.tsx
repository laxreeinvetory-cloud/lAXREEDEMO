import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a LaxRee Dealer — Hotel Supplies Dealership in India",
  description: "Partner with LaxRee Amenities as a dealer. Protected territory, OEM factory-direct pricing, 700+ SKUs, 7-day stock replenishment, co-marketing support. Apply for dealership across 22+ Indian cities.",
  keywords: ["hotel supplies dealership India", "become hotel amenities dealer", "LaxRee dealer program", "hotel products distributor", "hospitality supplies franchise"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/dealers" },
  openGraph: {
    title: "Become a LaxRee Dealer — Hotel Supplies Dealership",
    description: "OEM pricing, protected territory, 700+ SKUs. Apply for dealership today.",
    url: "https://l-axreedemo.vercel.app/dealers",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function DealersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
