import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | LaxRee Amenities" },
<<<<<<< HEAD
  description: "Contact LaxRee Amenities for hotel supplies enquiries, quotations, after-sales support, and dealership. Phone: +91 92516 83662. Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001.",
=======
  description: "Get in touch with LaxRee for hotel amenities, furniture & supplies enquiries. Reach India's trusted hospitality supplier - response within 15 mins.",
>>>>>>> 8c22f8e (New Neon DB (ep-sweet-sea) + convert ALL images to WebP + cleanup unused files)
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
