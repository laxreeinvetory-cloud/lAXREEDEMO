import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
  Share2,
} from "lucide-react";
import { PageCTA, GlassCard, FadeIn } from "@/components/site/page-primitives";
import { BLOG_POSTS_FULL } from "@/lib/laxree/blog-content";
import { SITE } from "@/lib/laxree/site-data";

/* Pre-generate the 3 known slugs */
export function generateStaticParams() {
  return BLOG_POSTS_FULL.map((p) => ({ slug: p.slug }));
}

/* SEO metadata */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS_FULL.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — LaxRee Amenities Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: "article",
    },
  };
}

/* Build author initials for avatar */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS_FULL.find((p) => p.slug === slug);
  if (!post) notFound();

  // Related = the other posts (exclude current)
  const related = BLOG_POSTS_FULL.filter((p) => p.slug !== post.slug);

  // SEO: Canonical + share URL
  const shareUrl = `https://l-axreedemo.vercel.app/blog/${post.slug}`;

  // SEO: Article structured data (JSON-LD)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `https://l-axreedemo.vercel.app${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "LaxRee Amenities",
      logo: {
        "@type": "ImageObject",
        url: "https://l-axreedemo.vercel.app/images/laxree-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
  };

  // SEO: Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://l-axreedemo.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://l-axreedemo.vercel.app/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: shareUrl },
    ],
  };
  const shareLinks = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      Icon: Facebook,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
      Icon: Twitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      Icon: Linkedin,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`,
      Icon: MessageCircle,
    },
  ];

  return (
    <>
      {/* SEO: Article + Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ─────────────────────────────────────────────────────
          Section 1 — Article hero (charcoal)
          ───────────────────────────────────────────────────── */}
      <section className="section section-charcoal relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(198,161,91,0.10), transparent 55%)",
          }}
        />
        <div className="container-laxree">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-sand/60">
              <li className="flex items-center gap-2">
                <Link href="/" className="transition-colors hover:text-brass">
                  Home
                </Link>
                <span className="text-sand/40">/</span>
              </li>
              <li className="flex items-center gap-2">
                <Link
                  href="/blog"
                  className="transition-colors hover:text-brass"
                >
                  Blog
                </Link>
                <span className="text-sand/40">/</span>
              </li>
              <li className="text-brass">{post.category}</li>
            </ol>
          </nav>

          {/* Back to blog link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-sand/70 hover:text-brass transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Articles
          </Link>

          <div className="max-w-4xl">
            <span className="eyebrow text-brass block mb-5">
              {post.category}
            </span>
            <h1
              className="font-display text-ivory leading-[1.08]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 600,
              }}
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-wider">
              <span className="font-body text-[14px] text-sand normal-case tracking-normal">
                {post.author}
              </span>
              <span className="text-brass">•</span>
              <span className="text-brass text-[11px]">{post.authorRole}</span>
              <span className="text-brass">•</span>
              <span className="inline-flex items-center gap-1.5 text-sand">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="text-brass">•</span>
              <span className="inline-flex items-center gap-1.5 text-sand">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          Section 2 — Cover image (charcoal, continues)
          ───────────────────────────────────────────────────── */}
      <section className="section section-charcoal pb-16 md:pb-24">
        <div className="container-laxree">
          <div className="overflow-hidden" style={{ borderRadius: "24px" }}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          Section 3 — Article body (ivory)
          ───────────────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <article
            className="mx-auto max-w-[720px]
                       [&_p:first-of-type]:first-letter:font-display
                       [&_p:first-of-type]:first-letter:text-brass
                       [&_p:first-of-type]:first-letter:text-[3.5em]
                       [&_p:first-of-type]:first-letter:float-left
                       [&_p:first-of-type]:first-letter:mr-2
                       [&_p:first-of-type]:first-letter:mt-1
                       [&_p:first-of-type]:first-letter:leading-[0.8]"
          >
            <div>
              {post.content.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <h2
                      className="font-display text-ink mt-12 mb-4 leading-tight"
                      style={{ fontSize: "28px", fontWeight: 500 }}
                    >
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((para, j) => (
                    <p
                      key={j}
                      className="font-body text-ink mb-5 leading-relaxed"
                      style={{ fontSize: "17px" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          Section 4 — Author bio (charcoal)
          ───────────────────────────────────────────────────── */}
      <section className="section section-charcoal py-20 md:py-28">
        <div className="container-laxree">
          <FadeIn>
            <GlassCard
              theme="charcoal"
              radius="24px"
              className="p-8 md:p-10"
            >
              <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center shrink-0 rounded-full font-display text-brass"
                  style={{
                    width: "88px",
                    height: "88px",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(198,161,91,0.18), rgba(198,161,91,0.06))",
                    border: "1px solid rgba(198,161,91,0.35)",
                    fontSize: "32px",
                    fontWeight: 600,
                  }}
                  aria-hidden
                >
                  {getInitials(post.author)}
                </div>

                {/* Bio */}
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-sand">
                    Written by
                  </span>
                  <h3
                    className="font-display text-ivory mt-2 leading-tight"
                    style={{ fontSize: "20px", fontWeight: 500 }}
                  >
                    {post.author}
                  </h3>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-wider text-brass">
                    {post.authorRole}
                  </p>
                  <p className="mt-4 font-body text-[14px] text-sand leading-relaxed max-w-2xl">
                    {post.author} is part of the LaxRee Amenities factory team
                    in Ajmer, working directly with hospitality procurement
                    teams across India to specify, manufacture, and deliver
                    hotel amenities that balance guest experience with
                    lifecycle cost.
                  </p>
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          Section 5 — Share + related (ivory)
          ───────────────────────────────────────────────────── */}
      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Share */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Share2 className="h-4 w-4 text-brass" />
                <span className="eyebrow text-ink-muted">Share</span>
              </div>
              <h3
                className="font-display text-ink leading-tight"
                style={{ fontSize: "22px", fontWeight: 500 }}
              >
                Share this article
              </h3>
              <p className="mt-2 font-body text-[14px] text-ink-muted leading-relaxed">
                Pass it along to a colleague who specifies hospitality
                amenities.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {shareLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-ink/15 text-ink-muted transition-all hover:border-brass hover:text-brass hover:-translate-y-0.5"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-ink/10">
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-brass hover:text-brass-light transition-colors"
                >
                  Or talk to our team on WhatsApp
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Keep reading */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <ArrowRight className="h-4 w-4 text-brass" />
                <span className="eyebrow text-ink-muted">Related</span>
              </div>
              <h3
                className="font-display text-ink leading-tight"
                style={{ fontSize: "22px", fontWeight: 500 }}
              >
                Keep reading
              </h3>

              <div className="mt-6 flex flex-col gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group glass-on-ivory p-5 transition-all hover:-translate-y-0.5 hover:border-brass"
                    style={{ borderRadius: "16px" }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-brass">
                      {r.category}
                    </span>
                    <h4
                      className="font-display text-ink mt-2 leading-snug"
                      style={{ fontSize: "16px", fontWeight: 500 }}
                    >
                      {r.title}
                    </h4>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                        {r.date} · {r.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-brass group-hover:gap-2.5 transition-all">
                        Read
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          Section 6 — PageCTA (emerald)
          ───────────────────────────────────────────────────── */}
      <PageCTA
        title="Need help implementing these ideas?"
        subtitle="Our factory team can manufacture to your spec."
        primaryLabel="Get a Quotation"
        secondaryLabel="Call 1800 120 7001"
      />
    </>
  );
}
