import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Clients & Case Studies | LaxRee Amenities" },
  description:
    "1,347+ projects delivered across 28 states. Trusted by 13+ national hotel chains including Taj, Radisson, Fairmont, Holiday Inn and more. See case studies and testimonials.",
  alternates: {
    canonical: "https://www.laxree.com/clients",
    languages: {
      "en-IN": "https://www.laxree.com/clients",
      "en": "https://www.laxree.com/clients",
      "x-default": "https://www.laxree.com/clients",
    },
  },
  openGraph: {
    title: "Clients & Case Studies | LaxRee Amenities",
    description:
      "1,347+ projects delivered across 28 states. Trusted by 13+ national hotel chains.",
    url: "https://www.laxree.com/clients",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
