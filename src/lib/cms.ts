import { db } from "@/lib/db";

/**
 * CMS Data Loader — fetches content from SiteContent table.
 * Falls back to defaults if DB is unavailable or key doesn't exist.
 */

export type CMSContent = Record<string, any>;

// Default CMS data — used when DB has no data yet
export const CMS_DEFAULTS: CMSContent = {
  "homepage:categories": {
    items: [
      { id: "cat-1", title: "Room Amenities", image: "", description: "Mini bars, kettles, safes, locks, hangers", link: "/products/room-amenities", order: 1, visible: true },
      { id: "cat-2", title: "Washroom Amenities", image: "", description: "Hair dryers, dispensers, mirrors, dryers", link: "/products/washroom-amenities", order: 2, visible: true },
      { id: "cat-3", title: "Lobby Items", image: "", description: "Trolleys, dustbins, Q managers, signage", link: "/products/lobby-items", order: 3, visible: true },
      { id: "cat-4", title: "Furniture", image: "", description: "Outdoor, guest room, restaurant furniture", link: "/products/furniture", order: 4, visible: true },
      { id: "cat-5", title: "Linen", image: "", description: "Room linen and bath linen", link: "/products/linen", order: 5, visible: true },
      { id: "cat-6", title: "Bath Tub", image: "", description: "Freestanding bath tubs", link: "/products/bath-tub", order: 6, visible: true },
      { id: "cat-7", title: "Amenities Tray Set", image: "", description: "Premium tray sets", link: "/products/amenities-tray-set", order: 7, visible: true },
      { id: "cat-8", title: "Space Pod", image: "", description: "Space pod structures", link: "/products/dome-space-pod", order: 8, visible: true },
      { id: "cat-9", title: "Dome", image: "", description: "Geodesic domes", link: "/products/dome-space-pod", order: 9, visible: true },
    ],
  },
  "homepage:brands": {
    items: [
      { id: "b1", name: "Radisson", logo: "", order: 1, visible: true },
      { id: "b2", name: "Holiday Inn", logo: "", order: 2, visible: true },
      { id: "b3", name: "Fairmont", logo: "", order: 3, visible: true },
      { id: "b4", name: "Sayaji Hotels", logo: "", order: 4, visible: true },
      { id: "b5", name: "Ramada Group", logo: "", order: 5, visible: true },
      { id: "b6", name: "Sunday Hotels", logo: "", order: 6, visible: true },
      { id: "b7", name: "7 Apple Hotels", logo: "", order: 7, visible: true },
      { id: "b8", name: "Club Mahindra", logo: "", order: 8, visible: true },
      { id: "b9", name: "Taj", logo: "", order: 9, visible: true },
      { id: "b10", name: "Ananta Hotels", logo: "", order: 10, visible: true },
      { id: "b11", name: "The Lords Inn", logo: "", order: 11, visible: true },
      { id: "b12", name: "The Derns Hotels & Resorts", logo: "", order: 12, visible: true },
      { id: "b13", name: "Swosti Group", logo: "", order: 13, visible: true },
    ],
  },
  "homepage:certifications": { items: [] },
  "homepage:hero3d": {
    heading: "LaxRee Amenities",
    subtitle: "India's most comprehensive hospitality procurement partner",
    primaryButtonText: "Request Quotation",
    primaryButtonLink: "/contact-us",
    secondaryButtonText: "Download Catalogue",
    secondaryButtonLink: "/catalogue",
    modelUrl: "",
    background: "",
    visible: true,
  },
  "homepage:whatWeSupply": {
    heading: "What We Supply",
    subtitle: "Five Categories. One Standard.",
    items: [
      { id: "w1", title: "Room Amenities", image: "", description: "", order: 1, visible: true },
      { id: "w2", title: "Washroom Amenities", image: "", description: "", order: 2, visible: true },
      { id: "w3", title: "Lobby Items", image: "", description: "", order: 3, visible: true },
      { id: "w4", title: "Furniture", image: "", description: "", order: 4, visible: true },
      { id: "w5", title: "Linen", image: "", description: "", order: 5, visible: true },
    ],
  },
  "homepage:aboutUs": {
    heading: "About LaxRee",
    subHeading: "11 years of hospitality craftsmanship",
    description: "Founded in Ajmer, Rajasthan, LaxRee Amenities has grown into India's most comprehensive hospitality procurement partner.",
    ownerImage: "",
    ownerName: "",
    ownerDesignation: "",
    ownerMessage: "",
    backgroundImage: "",
    buttonText: "Learn More",
    buttonLink: "/about-us",
    visible: true,
  },
  "homepage:gallery": {
    heading: "Connecting with Hospitality",
    description: "Our presence across India's hospitality landscape",
    images: [],
  },
  "homepage:quality": {
    heading: "Commitment to Quality",
    description: "Seven certifications. Zero compromises.",
    cards: [],
  },
  "header:nav": {
    logo: "/images/laxree-logo.png",
    topBar: "Hotel Supplies Redefined",
    menus: [
      { id: "m1", label: "Home", link: "/", order: 1, visible: true, dropdown: [] },
      { id: "m2", label: "About Us", link: "/about-us", order: 2, visible: true, dropdown: [] },
      { id: "m3", label: "Products", link: "/products", order: 3, visible: true, dropdown: [] },
      { id: "m4", label: "Catalogue", link: "/catalogue", order: 4, visible: true, dropdown: [] },
      { id: "m5", label: "Career", link: "/career", order: 5, visible: true, dropdown: [] },
      { id: "m6", label: "Contact Us", link: "/contact-us", order: 6, visible: true, dropdown: [] },
    ],
    ctaButton: { text: "Enquire Now", visible: true },
  },
  "footer:config": {
    companyLinks: [
      { id: "fl1", label: "About Us", link: "/about-us", order: 1, visible: true },
      { id: "fl2", label: "Clients", link: "/clients", order: 2, visible: true },
      { id: "fl3", label: "Dealers", link: "/dealers", order: 3, visible: true },
      { id: "fl4", label: "Catalogue", link: "/catalogue", order: 4, visible: true },
      { id: "fl5", label: "Career", link: "/career", order: 5, visible: true },
      { id: "fl6", label: "Contact", link: "/contact-us", order: 6, visible: true },
    ],
    quickLinks: [
      { id: "ql1", label: "FAQ", link: "/faq", order: 1, visible: true },
      { id: "ql2", label: "Privacy Policy", link: "/privacy", order: 2, visible: true },
    ],
    faqs: [],
    social: {
      facebook: "https://facebook.com",
      x: "https://x.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    },
    contact: {
      phone: "+91-92516 83662",
      email: "contactus@laxree.com",
      address: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
    },
    copyright: "© 2026 LaxRee Amenities. All rights reserved.",
    newsletter: { enabled: true, title: "Subscribe to our newsletter" },
  },
  "career:page": {
    banner: "",
    heading: "Build Your Career in Hospitality Procurement",
    description: "Join LaxRee Amenities — where craftsmanship meets scale.",
    jobs: [],
    applyButtonText: "Apply Now",
    seo: { title: "Career — LaxRee Amenities", description: "Join our team" },
  },
  "contact:page": {
    banner: "",
    heading: "Get in Touch",
    description: "Have a question? We're here to help.",
    address: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
    phone: "+91-92516 83662",
    email: "contactus@laxree.com",
    mapEmbed: "",
    workingHours: "Mon-Sat: 9:30 AM - 6:30 PM",
    formText: "Fill out the form below and our team will reach out within 24 hours.",
    social: { facebook: "", x: "", youtube: "", linkedin: "" },
  },
  "homepage:sections": {
    sections: [
      { id: "hero", name: "3D Hero", order: 1, visible: true },
      { id: "trustMarquee", name: "Trust Marquee", order: 2, visible: true },
      { id: "categoryBento", name: "Categories", order: 3, visible: true },
      { id: "aboutUs", name: "About Us", order: 4, visible: true },
      { id: "ownerMessage", name: "Owner Message", order: 5, visible: true },
      { id: "productSpotlight", name: "Product Spotlight", order: 6, visible: true },
      { id: "categoryExplorer", name: "Category Explorer", order: 7, visible: true },
      { id: "clientsTestimonials", name: "Clients & Testimonials", order: 8, visible: true },
      { id: "ourPresence", name: "Our Presence", order: 9, visible: true },
      { id: "certifications", name: "Certifications", order: 10, visible: true },
      { id: "whyChoose", name: "Why Choose LaxRee", order: 11, visible: true },
      { id: "hospitalityTrends", name: "Hospitality Trends", order: 12, visible: true },
      { id: "leadCta", name: "Lead CTA", order: 13, visible: true },
    ],
  },
};

/**
 * Load all CMS content from the database.
 * Merges with defaults so every key is always present.
 * Call this from server components.
 */
export async function loadCMS(): Promise<CMSContent> {
  try {
    const rows = await db.siteContent.findMany();
    const content: CMSContent = { ...CMS_DEFAULTS };
    for (const row of rows) {
      // Skip image: keys (they're uploaded images, not CMS config)
      if (row.key.startsWith("image:")) continue;
      // Skip theme/homepage/seo/company/page: keys (handled by other systems)
      if (["theme", "homepage", "seo", "company", "page:career", "page:dealers", "page:catalogue", "page:contact-us", "faq"].includes(row.key)) continue;
      try {
        content[row.key] = JSON.parse(row.value);
      } catch {
        content[row.key] = row.value;
      }
    }
    return content;
  } catch {
    // DB unavailable — return defaults
    return CMS_DEFAULTS;
  }
}

/**
 * Load a single CMS section by key.
 * Returns the default if not found in DB.
 */
export async function loadCMSSection<T = any>(key: string): Promise<T> {
  try {
    const row = await db.siteContent.findUnique({ where: { key } });
    if (row) {
      try {
        return JSON.parse(row.value) as T;
      } catch {
        return row.value as T;
      }
    }
  } catch {
    // DB error
  }
  return CMS_DEFAULTS[key] as T;
}
