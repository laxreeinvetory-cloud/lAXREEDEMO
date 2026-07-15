import dynamic from "next/dynamic";
import { Hero } from "@/components/site/hero";
import { TrustMarquee } from "@/components/site/trust-marquee";
import { CategoryBento } from "@/components/site/category-bento";

// Lazy-load below-the-fold sections to reduce initial JS payload
// These sections are below the first viewport and don't need to load immediately
const AboutUs = dynamic(() => import("@/components/site/about-us").then(m => m.AboutUs));
const OwnerMessage = dynamic(() => import("@/components/site/owner-message").then(m => m.OwnerMessage));
const ProductSpotlight = dynamic(() => import("@/components/site/product-spotlight").then(m => m.ProductSpotlight));
const CategoryExplorer = dynamic(() => import("@/components/site/category-explorer").then(m => m.CategoryExplorer));
const ClientsTestimonials = dynamic(() => import("@/components/site/clients-testimonials"));
const OurPresence = dynamic(() => import("@/components/site/our-presence"));
const Certifications = dynamic(() => import("@/components/site/certifications"));
const WhyChoose = dynamic(() => import("@/components/site/why-choose").then(m => m.WhyChoose));
const HospitalityTrends = dynamic(() => import("@/components/site/hospitality-trends").then(m => m.HospitalityTrends));
const LeadCtaBanner = dynamic(() => import("@/components/site/lead-cta-banner").then(m => m.LeadCtaBanner));

export default function Home() {
  return (
    <>
      {/* 2. HERO — charcoal (eager loaded) */}
      <Hero />

      {/* 3. TRUST / CERTIFICATION MARQUEE — emerald (eager loaded, CSS only) */}
      <TrustMarquee />

      {/* 4. CATEGORY BENTO GRID — ivory (eager loaded, above fold) */}
      <CategoryBento />

      {/* 5. ABOUT US — charcoal split parallax (lazy) */}
      <AboutUs />

      {/* 5b. OWNER'S MESSAGE — charcoal (lazy) */}
      <OwnerMessage />

      {/* 6. PRODUCT SPOTLIGHT — ivory coverflow (lazy) */}
      <ProductSpotlight />

      {/* 7. DEEP CATEGORY EXPLORER — charcoal accordion (lazy) */}
      <CategoryExplorer />

      {/* 8. CLIENTS & TESTIMONIALS — ivory (lazy, CSS only) */}
      <ClientsTestimonials />

      {/* 9. OUR PRESENCE — charcoal coverflow gallery (lazy) */}
      <OurPresence />

      {/* 10. CERTIFICATIONS — ivory badge wall (lazy, CSS only) */}
      <Certifications />

      {/* 11. WHY CHOOSE LAXREE — charcoal bento (lazy) */}
      <WhyChoose />

      {/* 12. HOSPITALITY TRENDS — ivory blog grid (lazy, CSS only) */}
      <HospitalityTrends />

      {/* 13. LEAD CAPTURE CTA — emerald (lazy) */}
      <LeadCtaBanner />
    </>
  );
}
