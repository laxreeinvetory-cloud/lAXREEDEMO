import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Products & Supplies — 700+ SKUs | Minibars, Safes, Locks, Kettles",
  description: "Browse 700+ hotel supply products: minibars, safe lockers, RFID door locks, electric kettles, hair dryers, luggage trolleys, magnifying mirrors, hand dryers. OEM manufactured in India with full specifications and bulk pricing.",
  keywords: ["hotel products India", "hotel minibar price", "hotel safe locker", "RFID door lock hotel", "electric kettle hotel", "hotel supplies catalogue", "buy hotel amenities bulk India"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/products" },
  openGraph: {
    title: "Hotel Products & Supplies — 700+ SKUs | LaxRee Amenities",
    description: "Browse 700+ hotel supply products with full specifications. OEM manufactured in India.",
    url: "https://l-axreedemo.vercel.app/products",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
