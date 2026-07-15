import type { Metadata } from "next";

const BASE_URL = "https://l-axreedemo.vercel.app";

/**
 * Generate page-specific metadata for SEO.
 * Each page should call this with its own title, description, and keywords.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: opts.path ? `${BASE_URL}${opts.path}` : BASE_URL,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path ? `${BASE_URL}${opts.path}` : BASE_URL,
      siteName: "LaxRee Amenities",
      type: "website",
      locale: "en_IN",
      images: opts.image ? [{ url: opts.image, width: 1200, height: 630, alt: opts.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

export { BASE_URL };

/**
 * Product structured data (JSON-LD) for product pages
 */
export function productJsonLd(product: {
  name: string;
  model: string;
  category: string;
  image: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.model,
    category: product.category,
    image: `${BASE_URL}${product.image}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "LaxRee Amenities",
    },
    manufacturer: {
      "@type": "Organization",
      name: "LaxRee Amenities",
      url: BASE_URL,
    },
  };
}

/**
 * Breadcrumb structured data (JSON-LD)
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQ structured data (JSON-LD) for blog posts
 */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * LocalBusiness structured data (JSON-LD)
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "LaxRee Amenities",
    image: `${BASE_URL}/images/laxree-logo.png`,
    url: BASE_URL,
    telephone: "+91-92516-83662",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines",
      addressLocality: "Ajmer",
      addressRegion: "Rajasthan",
      postalCode: "305001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.4499,
      longitude: 74.6399,
    },
    openingHours: "Mo-Sa 09:30-18:30",
    areaServed: "IN",
  };
}
