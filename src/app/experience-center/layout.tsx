import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Experience Center | LaxRee Amenities" },
  description:
    "Visit India's largest hospitality supply experience centers in Ajmer, Jaipur, and Gurugram. See, touch, and experience our full product range in person.",
  alternates: {
    canonical: "https://www.laxree.com/experience-center",
    languages: {
      "en-IN": "https://www.laxree.com/experience-center",
      "en": "https://www.laxree.com/experience-center",
      "x-default": "https://www.laxree.com/experience-center",
    },
  },
  openGraph: {
    title: "Experience Center — LaxRee Amenities",
    description:
      "Visit India's largest hospitality supply experience centers in Ajmer, Jaipur, and Gurugram.",
    url: "https://www.laxree.com/experience-center",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function ExperienceCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
