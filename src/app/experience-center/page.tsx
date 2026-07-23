import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Play, Building2, Award } from "lucide-react";
import { PageHero, SectionHeading, PageCTA, FadeIn } from "@/components/site/page-primitives";

export const metadata: Metadata = {
  title: "Experience Center — LaxRee Amenities",
  description:
    "Visit India's largest hospitality supply experience centers in Ajmer, Jaipur, and Gurugram. See, touch, and experience our full product range in person.",
};

const CENTERS = [
  {
    id: "gurugram",
    name: "Gurugram Experience Center",
    tagline: "India's Largest Hospitality Supplier Experience Center",
    address: "Gurugram, Haryana, India",
    description:
      "Our flagship experience center in Gurugram is India's largest hospitality supplier showcase. Spread across a massive showroom floor, it features every product category — from minibars to furniture, bath tubs to dome structures. Walk through complete room setups, test products hands-on, and meet with our procurement experts.",
    highlight: true,
    stats: [
      { label: "Showroom Area", value: "50,000+ sq ft" },
      { label: "Product Categories", value: "8 Categories" },
      { label: "Products on Display", value: "700+ SKUs" },
    ],
  },
  {
    id: "ajmer",
    name: "Ajmer Experience Center",
    tagline: "Our Headquarters & Manufacturing Hub",
    address: "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
    description:
      "Located at our manufacturing headquarters in Ajmer, this experience center showcases our complete product range alongside the factory floor. See how products are made, meet our design team, and experience the quality firsthand.",
    highlight: false,
    stats: [
      { label: "Showroom Area", value: "20,000+ sq ft" },
      { label: "Factory Tour", value: "Available" },
      { label: "Products on Display", value: "500+ SKUs" },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur Experience Center",
    tagline: "Premium Showroom in Pink City",
    address: "Jaipur, Rajasthan, India",
    description:
      "Our Jaipur experience center brings the full LaxRee range to Rajasthan's capital. Explore room setups, test minibars, compare furniture finishes, and get expert consultation for your hospitality project.",
    highlight: false,
    stats: [
      { label: "Showroom Area", value: "15,000+ sq ft" },
      { label: "Room Setups", value: "5 Complete Rooms" },
      { label: "Products on Display", value: "400+ SKUs" },
    ],
  },
];

export default function ExperienceCenterPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Experience Center" },
        ]}
        eyebrow="EXPERIENCE CENTER"
        title="Experience LaxRee in Person"
        subtitle="Visit India's largest hospitality supply experience centers. See, touch, and test our complete product range — from minibars to dome structures."
      />

      {/* Demo Video Section */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="charcoal"
            eyebrow="VIRTUAL TOUR"
            title="Watch Our Experience Center Tour"
            body="Can't visit in person? Take a virtual tour of our Gurugram experience center — India's largest hospitality supplier showcase."
          />
          <FadeIn>
            <div className="mt-12 relative overflow-hidden rounded-24px aspect-video bg-charcoal border border-white/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brass/20 border-2 border-brass/40 cursor-pointer hover:bg-brass/30 transition-colors">
                  <Play className="h-8 w-8 text-brass ml-1" fill="currentColor" />
                </div>
                <p className="font-body text-sm text-sand text-center max-w-md">
                  Demo video will be placed here. Admin can upload the actual video
                  through the CMS panel.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Experience Centers */}
      {CENTERS.map((center, idx) => (
        <section
          key={center.id}
          className={idx % 2 === 0 ? "section section-ivory py-20 md:py-28" : "section section-charcoal py-20 md:py-28"}
        >
          <div className="container-laxree">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn delay={0.1}>
                <div className="relative overflow-hidden rounded-24px aspect-[4/3] bg-charcoal border border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-24 w-24 text-brass/30" />
                  </div>
                  {center.highlight && (
                    <div className="absolute top-4 right-4 rounded-full bg-brass px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-charcoal font-bold">
                      <Award className="inline h-3 w-3 mr-1" />
                      Flagship Center
                    </div>
                  )}
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div>
                  {center.highlight && (
                    <span className="eyebrow text-brass mb-3 block">
                      INDIA'S LARGEST
                    </span>
                  )}
                  <h2
                    className="font-display leading-tight mb-2"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                      fontWeight: 500,
                      color: idx % 2 === 0 ? "var(--ink)" : "var(--ivory)",
                    }}
                  >
                    {center.name}
                  </h2>
                  <p className="font-mono text-[12px] uppercase tracking-wider text-brass mb-4">
                    {center.tagline}
                  </p>
                  <p className="font-body text-[15px] leading-relaxed text-ink-muted mb-6">
                    {center.description}
                  </p>

                  <div className="flex items-start gap-2 mb-6">
                    <MapPin className="h-5 w-5 text-brass shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-ink-muted">{center.address}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {center.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="font-display text-lg font-bold text-brass">
                          {stat.value}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-sand mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact-us"
                    className="pill pill-brass px-6 py-3 text-[13px] inline-flex items-center gap-2"
                  >
                    Schedule a Visit <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* Why Visit Section */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <SectionHeading
            theme="ivory"
            eyebrow="WHY VISIT"
            title="Why Experience Our Centers?"
            body="Seeing is believing. Visit any of our 3 experience centers for a hands-on product experience."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Touch & Feel", desc: "Experience product quality, finishes, and materials firsthand before making procurement decisions." },
              { title: "Complete Room Setups", desc: "Walk through fully furnished hotel room replicas to visualize how products work together." },
              { title: "Expert Consultation", desc: "Meet our hospitality procurement experts who can guide you on product selection and project planning." },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="glass-on-ivory rounded-24px p-6">
                  <h3 className="font-display text-lg text-ink mb-2">{item.title}</h3>
                  <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title="Ready to visit?"
        subtitle="Book an appointment at any of our 3 experience centers."
      />
    </>
  );
}
