import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact LaxRee Amenities — Hotel Supplies Manufacturer in Ajmer",
  description: "Contact LaxRee Amenities for hotel supplies enquiries, quotations, after-sales support, and dealership. Phone: +91-92516 83662, Toll Free: 1800 120 7001. Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001.",
  keywords: ["contact LaxRee Amenities", "hotel supplies contact India", "hotel minibar manufacturer contact", "hospitality supplies phone number", "hotel amenities enquiry Ajmer"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/contact-us" },
  openGraph: {
    title: "Contact LaxRee Amenities — Hotel Supplies Manufacturer",
    description: "Phone: +91-92516 83662 | Email: contactus@laxree.com | Ajmer, Rajasthan",
    url: "https://l-axreedemo.vercel.app/contact-us",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
