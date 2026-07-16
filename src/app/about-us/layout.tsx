import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — OEM Hotel Supplies Manufacturer in Ajmer, Rajasthan",
  description: "LaxRee Amenities is an 11-year-old OEM manufacturer of hotel minibars, safe lockers, furniture, linen, roofing and dome structures. Ajmer's largest hospitality exhibition centre. 1,347+ projects delivered across 28 states.",
  keywords: ["LaxRee Amenities about", "hotel supplies manufacturer India", "OEM minibar manufacturer", "hotel amenities factory Ajmer", "hospitality exhibition centre Rajasthan"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/about-us" },
  openGraph: {
    title: "About LaxRee Amenities — OEM Hotel Supplies Manufacturer",
    description: "11+ years of manufacturing hotel minibars, safes, furniture. Ajmer's largest hospitality exhibition centre.",
    url: "https://l-axreedemo.vercel.app/about-us",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
