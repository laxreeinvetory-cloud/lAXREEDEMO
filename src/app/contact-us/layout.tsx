import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | LaxRee Amenities" },
  description: "Get in touch with LaxRee for hotel amenities, furniture & supplies enquiries. Reach India's trusted hospitality supplier - response within 15 mins.",
  keywords: ["contact LaxRee Amenities", "hotel supplies contact India", "hotel minibar manufacturer contact", "hospitality supplies phone number", "hotel amenities enquiry Ajmer"],
  alternates: { canonical: "https://www.laxree.com/contact-us" },
  openGraph: {
    title: "Contact LaxRee Amenities — Hotel Supplies Manufacturer",
    description: "Phone: +91-92516 83662 | Email: contactus@laxree.com | Ajmer, Rajasthan",
    url: "https://www.laxree.com/contact-us",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
