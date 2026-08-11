import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { EnquiryProvider } from "@/components/providers/enquiry-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ConditionalChrome } from "@/components/providers/conditional-chrome";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import { db } from "@/lib/db";

/* ─────────────────────────────────────────────────────────────
   Fonts — display: "swap" for fast text render
   ───────────────────────────────────────────────────────────── */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

/* ─────────────────────────────────────────────────────────────
   SEO Metadata
   ───────────────────────────────────────────────────────────── */
const BASE_URL = "https://l-axreedemo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "LaxRee Amenities — Hotel Supplies Redefined | OEM Manufacturer in Ajmer",
    template: "%s | LaxRee Amenities",
  },
  description:
    "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee, India's largest Hotel Supplier Experience Center. 11+ years, 700+ SKUs, 7+ certifications.",
  keywords: [
    "hotel supplies India",
    "hotel amenities manufacturer India",
    "hotel minibar manufacturer",
    "hotel minibar price India",
    "hotel safe locker manufacturer",
    "hotel safe box price India",
    "RFID hotel door lock India",
    "hotel door lock system price",
    "electric kettle for hotel rooms",
    "hotel hair dryer wall mounted",
    "hotel luggage trolley price",
    "hotel supplies manufacturer Ajmer",
    "OEM hotel supplies manufacturer India",
    "hotel amenities supplier India",
    "hotel products wholesale India",
    "hospitality supplies India",
    "hotel furniture manufacturer India",
    "hotel linen supplier India",
    "geodesic dome resort India",
    "metal roofing sheets India",
    "hotel supplies company India",
    "best hotel amenities supplier",
    "hotel renovation supplies India",
    "hotel procurement India",
    "minibar fridge for hotel",
    "digital safe locker for hotel",
    "automatic soap dispenser hotel",
    "hand dryer for hotel bathroom",
    "magnifying mirror hotel bathroom",
    "hotel room amenities list",
    "hotel supplies Delhi Mumbai Bangalore",
    "LaxRee Amenities",
  ],
  authors: [{ name: "LaxRee Amenities" }],
  creator: "LaxRee Amenities",
  publisher: "LaxRee Amenities",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "en": BASE_URL,
    },
  },
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "LaxRee Amenities — Hotel Supplies Redefined",
    description:
      "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee. 11+ years, 700+ SKUs, 7+ certifications.",
    url: BASE_URL,
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/laxree-logo.png",
        width: 2560,
        height: 614,
        alt: "LaxRee Amenities — Hotel Supplies Redefined",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaxRee Amenities — Hotel Supplies Redefined",
    description:
      "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee.",
    images: ["/images/laxree-logo.png"],
  },
  category: "business",
  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Ajmer, Rajasthan, India",
    "geo.position": "26.4499;74.6399",
    "ICBM": "26.4499, 74.6399",
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { "google-site-verification": process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#C6A15B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Fetch analytics config (GA ID + GSC token) from the CMS database.
 * Returns { gaId, gscToken } or empty strings if not configured.
 * The admin sets these from /admin/analytics → saved to CMS key "analytics-config".
 */
// Force dynamic rendering so the analytics config is fetched on every request
// (not cached at build time). This ensures GA/GSC tags reflect the latest
// admin-saved config.
export const dynamic = "force-dynamic";

async function getAnalyticsConfig(): Promise<{ gaId: string; gscToken: string }> {
  // During build, skip DB fetch — use env vars only.
  // At runtime (on Vercel), fetch from DB so admin can configure without redeploy.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return {
      gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
      gscToken: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
    };
  }
  try {
    const row = await db.siteContent.findUnique({
      where: { key: "analytics-config" },
      select: { value: true },
    });
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      return {
        gaId: typeof parsed.gaId === "string" ? parsed.gaId : "",
        gscToken: typeof parsed.gscToken === "string" ? parsed.gscToken : "",
      };
    }
  } catch {
    // DB might not be available — fall through to env vars
  }
  return {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    gscToken: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  };
}

/* ─────────────────────────────────────────────────────────────
   Root Layout — async so it can fetch analytics config from DB
   ───────────────────────────────────────────────────────────── */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gaId, gscToken } = await getAnalyticsConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console verification meta tag */}
        {gscToken && (
          <meta name="google-site-verification" content={gscToken} />
        )}
      </head>
      <body
        className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} antialiased bg-charcoal text-ivory font-body`}
      >
        {/* Google Analytics 4 — GA ID from CMS (admin/analytics) or env var */}
        <GoogleAnalytics gaId={gaId} />

        {/* SEO: Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* SEO: Structured data — Organization + LocalBusiness + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "LaxRee Amenities",
              url: BASE_URL,
              logo: `${BASE_URL}/images/laxree-logo.png`,
              description: "OEM manufacturer of hotel amenities, furniture, linen, roofing and dome structures. India's largest Hotel Supplier Experience Center. 11+ years, 700+ SKUs, 7+ certifications.",
              foundingDate: "2020",
              numberOfEmployees: "50+",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines",
                addressLocality: "Ajmer",
                addressRegion: "Rajasthan",
                postalCode: "305001",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-92516-83662",
                contactType: "sales",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://facebook.com",
                "https://linkedin.com",
                "https://youtube.com",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              openingHours: "Mo-Sa 10:00-19:00",
              areaServed: "IN",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LaxRee Amenities",
              url: BASE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/products?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <CartProvider>
          <EnquiryProvider>
            <ConditionalChrome>{children}</ConditionalChrome>
          </EnquiryProvider>
        </CartProvider>
      </body>
    </html>
  );
}
