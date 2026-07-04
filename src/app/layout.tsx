import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SiteToaster } from "@/components/ui/site-toaster";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { EnquiryProvider } from "@/components/providers/enquiry-provider";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaxRee Amenities — Hotel Supplies Redefined | OEM Manufacturer in Ajmer",
  description:
    "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee, Ajmer's largest hospitality exhibition centre. 11+ years, 700+ SKUs, 7+ certifications.",
  keywords: [
    "LaxRee Amenities",
    "hotel supplies India",
    "hotel amenities manufacturer",
    "minibar manufacturer",
    "safe locker manufacturer",
    "hospitality supplies Ajmer",
    "hotel furniture India",
    "resort amenities",
    "OEM hotel supplies",
  ],
  authors: [{ name: "LaxRee Amenities" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "LaxRee Amenities — Hotel Supplies Redefined",
    description:
      "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee.",
    siteName: "LaxRee Amenities",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaxRee Amenities — Hotel Supplies Redefined",
    description:
      "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India.",
  },
};

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
        <EnquiryProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <SiteToaster />
        </EnquiryProvider>
        <Toaster />
      </body>
    </html>
  );
}
