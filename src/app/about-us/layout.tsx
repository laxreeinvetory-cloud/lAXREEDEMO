import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — OEM Hotel Supplies Manufacturer in Ajmer, Rajasthan",
  description: "LaxRee Amenities is an 11-year-old OEM manufacturer of hotel minibars, safe lockers, furniture, linen, roofing and dome structures. India's largest Hotel Supplier Experience Center. 1,347+ projects delivered across 28 states.",
  keywords: ["LaxRee Amenities about", "hotel supplies manufacturer India", "OEM minibar manufacturer", "hotel amenities factory Ajmer", "Hotel Supplier Experience Center Rajasthan"],
  alternates: { canonical: "https://www.laxree.com/about-us" },
  openGraph: {
    title: "About LaxRee Amenities — OEM Hotel Supplies Manufacturer",
    description: "11+ years of manufacturing hotel minibars, safes, furniture. India's largest Hotel Supplier Experience Center.",
    url: "https://www.laxree.com/about-us",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
