import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart & Quotation Request — LaxRee Amenities",
  description: "Review your selected hotel supply products and submit for quotation. Get professional PDF and Excel quotation sent directly to our sales team via WhatsApp.",
  keywords: ["hotel supplies quotation", "LaxRee cart", "hotel products quote request"],
  alternates: { canonical: "https://www.laxree.com/cart" },
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
