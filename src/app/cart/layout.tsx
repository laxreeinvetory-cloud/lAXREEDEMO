import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Your Cart | LaxRee Amenities" },
  description: "Review your selected hotel amenities & supplies before checkout with LaxRee, India's trusted hotel products supplier.",
  keywords: ["hotel supplies quotation", "LaxRee cart", "hotel products quote request"],
  alternates: { canonical: "https://www.laxree.com/cart" },
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
