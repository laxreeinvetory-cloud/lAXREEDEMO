import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SiteToaster } from "@/components/ui/site-toaster";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { EnquiryProvider } from "@/components/providers/enquiry-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { Navbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingRoot } from "@/components/floating/floating-root";

// ScrollProgress uses framer-motion — keep it eager since it's tiny
import { ScrollProgress } from "@/components/site/scroll-progress";

/* ─────────────────────────────────────────────────────────────
   Fonts — display: "swap" for fast text render
   ───────────────────────────────────────────────────────────── */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee, Ajmer's largest hospitality exhibition centre. 11+ years, 700+ SKUs, 7+ certifications.",
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
  },
};

export const viewport: Viewport = {
  themeColor: "#C6A15B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ─────────────────────────────────────────────────────────────
   Root Layout
   ───────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} antialiased bg-charcoal text-ivory font-body`}
      >
        {/* SEO: Preconnect to external domains */}
        <link rel="preconnect" href="https://sketchfab.com" />
        <link rel="dns-prefetch" href="https://sketchfab.com" />

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
              description: "OEM manufacturer of hotel amenities, furniture, linen, roofing and dome structures. Ajmer's largest hospitality exhibition centre. 11+ years, 700+ SKUs, 7+ certifications.",
              foundingDate: "2015",
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
              openingHours: "Mo-Sa 09:30-18:30",
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
            <SmoothScrollProvider>
              <div className="relative flex min-h-screen flex-col bg-charcoal">
                <ScrollProgress />
                <Navbar />
                <main className="flex-1 flex flex-col">{children}</main>
                <SiteFooter />
              </div>
              <FloatingRoot />
              <SiteToaster />
            </SmoothScrollProvider>
          </EnquiryProvider>
        </CartProvider>
      </body>
    </html>
  );
}
