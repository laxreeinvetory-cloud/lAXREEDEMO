import { Hero } from "@/components/site/hero";
import { TrustMarquee } from "@/components/site/trust-marquee";
import { CategoryBento } from "@/components/site/category-bento";
import { AboutUs } from "@/components/site/about-us";
import { OwnerMessage } from "@/components/site/owner-message";
import { ProductSpotlight } from "@/components/site/product-spotlight";
import { CategoryExplorer } from "@/components/site/category-explorer";
import ClientsTestimonials from "@/components/site/clients-testimonials";
import OurPresence from "@/components/site/our-presence";
import Certifications from "@/components/site/certifications";
import { WhyChoose } from "@/components/site/why-choose";
import { HospitalityTrends } from "@/components/site/hospitality-trends";
import { LeadCtaBanner } from "@/components/site/lead-cta-banner";

export default function Home() {
  return (
    <>
      {/* 2. HERO — charcoal */}
      <Hero />

      {/* 3. TRUST / CERTIFICATION MARQUEE — emerald */}
      <TrustMarquee />

      {/* 4. CATEGORY BENTO GRID — ivory */}
      <CategoryBento />

      {/* 5. ABOUT US — charcoal split parallax */}
      <AboutUs />

      {/* 5b. OWNER'S MESSAGE — charcoal */}
      <OwnerMessage />

      {/* 6. PRODUCT SPOTLIGHT — ivory coverflow */}
      <ProductSpotlight />

      {/* 7. DEEP CATEGORY EXPLORER — charcoal accordion */}
      <CategoryExplorer />

      {/* 8. CLIENTS & TESTIMONIALS — ivory */}
      <ClientsTestimonials />

      {/* 9. OUR PRESENCE — charcoal coverflow gallery */}
      <OurPresence />

      {/* 10. CERTIFICATIONS — ivory badge wall */}
      <Certifications />

      {/* 11. WHY CHOOSE LAXREE — charcoal bento */}
      <WhyChoose />

      {/* 12. HOSPITALITY TRENDS — ivory blog grid */}
      <HospitalityTrends />

      {/* 13. LEAD CAPTURE CTA — emerald */}
      <LeadCtaBanner />
    </>
  );
}
