import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers to common questions about LaxRee Amenities hotel supplies, ordering, delivery, warranty, and dealer partnerships.",
  alternates: {
    canonical: "https://www.laxree.com/faq",
    languages: {
      "en-IN": "https://www.laxree.com/faq",
      "en": "https://www.laxree.com/faq",
      "x-default": "https://www.laxree.com/faq",
    },
  },
  openGraph: {
    title: "FAQ — Frequently Asked Questions",
    description:
      "Answers to common questions about LaxRee Amenities hotel supplies, ordering, delivery, warranty, and dealer partnerships.",
    url: "https://www.laxree.com/faq",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
