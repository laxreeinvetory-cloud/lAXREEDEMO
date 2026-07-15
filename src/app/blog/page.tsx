"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import {
  PageHero,
  SectionHeading,
  PageCTA,
  FadeIn,
  GlassCard,
} from "@/components/site/page-primitives";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import { BLOG_POSTS } from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Section 2 — Featured post
   ───────────────────────────────────────────────────────────── */
function FeaturedPost() {
  const post = BLOG_POSTS[0];
  return (
    <section className="section section-ivory py-20 md:py-28">
      <div className="container-laxree">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Cover image */}
            <Link
              href={`/blog/${post.slug}`}
              className="block overflow-hidden card-20 group"
              aria-label={post.title}
            >
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover aspect-[16/10] transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>

            {/* Body */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-brass/10 text-brass">
                {post.category}
              </span>
              <h2
                className="font-display text-ink mt-5 leading-tight"
                style={{ fontSize: "28px", fontWeight: 500 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-brass"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 font-body text-[15px] text-ink-muted leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-5 flex items-center gap-4 font-mono text-[12px] text-ink-muted uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-wider text-brass transition-colors hover:text-brass-light group"
              >
                Read Article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 3 — All posts grid (charcoal)
   ───────────────────────────────────────────────────────────── */
function AllPostsGrid() {
  return (
    <section className="section section-charcoal py-20 md:py-28">
      <div className="container-laxree">
        <SectionHeading
          eyebrow="ALL ARTICLES"
          title="Latest from the Blog"
          theme="charcoal"
        />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                className="block glass-on-charcoal overflow-hidden card-20 group transition-all duration-300 hover:-translate-y-1 hover:border-brass"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                {/* Cover image */}
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>

                {/* Body */}
                <div className="p-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-brass/10 text-brass">
                    {post.category}
                  </span>
                  <h3
                    className="font-display text-ivory mt-4 leading-snug"
                    style={{ fontSize: "20px", fontWeight: 500 }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-3 font-body text-[14px] text-sand leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-sand uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="text-brass">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="mt-5 pt-5 border-t border-white/10">
                    <span className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-brass group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 4 — Topics (ivory)
   ───────────────────────────────────────────────────────────── */
function TopicsRow() {
  const topics = ["Sustainability", "Design", "Trends", "Manufacturing"];
  return (
    <section className="section section-ivory py-20 md:py-28">
      <div className="container-laxree">
        <SectionHeading
          eyebrow="TOPICS"
          title="What We Write About"
          theme="ivory"
          align="center"
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {topics.map((topic) => (
            <span
              key={topic}
              className="glass-on-ivory rounded-full px-6 py-3 font-body text-[14px] text-ink"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 5 — Newsletter signup (charcoal)
   ───────────────────────────────────────────────────────────── */
function NewsletterSignup() {
  const { notify } = useEnquiry();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulate async submit
    setTimeout(() => {
      notify("success", "Subscribed! Check your inbox.");
      setEmail("");
      setSubmitting(false);
    }, 400);
  }

  return (
    <section className="section section-charcoal py-20 md:py-28">
      <div className="container-laxree">
        <FadeIn>
          <GlassCard
            theme="charcoal"
            radius="24px"
            className="max-w-2xl mx-auto p-8 md:p-10 text-center"
          >
            <h3
              className="font-display text-ivory leading-tight"
              style={{ fontSize: "24px", fontWeight: 500 }}
            >
              Get the LaxRee newsletter
            </h3>
            <p className="mt-3 font-body text-[14px] text-sand leading-relaxed">
              Monthly insights for hospitality procurement. No spam, unsubscribe
              anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hotel.com"
                className="flex-1 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-ivory placeholder:text-sand/50 font-body text-[14px] focus:outline-none focus:border-brass transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="pill pill-brass text-[12px] px-6 py-3 cursor-pointer disabled:opacity-60"
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Blog listing page
   ───────────────────────────────────────────────────────────── */
export default function BlogListingPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        eyebrow="HOSPITALITY TRENDS"
        title="Insights for Hospitality Procurement"
        subtitle="Sustainability, design psychology, amenity trends — practical insights for hotel procurement teams, from the LaxRee factory floor."
      />

      <FeaturedPost />
      <AllPostsGrid />
      <TopicsRow />
      <NewsletterSignup />

      <PageCTA
        title="Have a topic suggestion?"
        subtitle="We'd love to hear what procurement topics matter to you."
        primaryLabel="Get a Quotation"
        secondaryLabel="Call 1800 120 7001"
      />
    </>
  );
}

export const metadata = {
  title: "Hospitality Trends Blog — Hotel Supplies Procurement Guides | LaxRee",
  description: "Expert procurement guides for hotel supplies in India: minibar buying guide, safe locker specs, RFID door lock comparison, kettle selection, soap dispenser guide, steam iron specs. Bulk pricing benchmarks included.",
  keywords: ["hotel supplies blog India", "hotel amenities procurement guide", "hotel minibar buying guide", "hotel safe locker guide", "RFID door lock guide", "hotel supplies blog", "hospitality trends 2026"],
  alternates: { canonical: "https://l-axreedemo.vercel.app/blog" },
  openGraph: {
    title: "Hospitality Trends Blog — Hotel Supplies Guides | LaxRee",
    description: "Expert procurement guides for hotel supplies in India with bulk pricing benchmarks.",
    url: "https://l-axreedemo.vercel.app/blog",
    siteName: "LaxRee Amenities",
    type: "website",
    locale: "en_IN",
  },
};
