import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at LaxRee Amenities — Jobs in Hospitality Manufacturing",
  description: "Join LaxRee Amenities — OEM manufacturer of hotel supplies in Ajmer, Rajasthan. Open positions in sales, manufacturing, design, quality control, and field service. Competitive salary, health insurance, growth opportunities.",
  keywords: ["hotel supplies jobs India", "LaxRee careers", "hospitality manufacturing jobs Ajmer", "hotel amenities sales jobs", "OEM factory jobs Rajasthan"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/career" },
  openGraph: {
    title: "Careers at LaxRee Amenities — Hospitality Manufacturing Jobs",
    description: "Open positions in sales, manufacturing, design, quality. Join India's OEM hotel supplies manufacturer.",
    url: "https://l-axreedemo.vercel.app/career",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
