"use client";

import { ArrowRight } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/lib/laxree/site-data";

export function HospitalityTrends() {
  return (
    <section id="blog" className="section section-ivory py-28 md:py-36">
      <div className="container-laxree">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <span className="eyebrow text-ink-muted">Explore Trends</span>
          <h2
            className="mt-4 font-display text-ink leading-[1.05]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Hospitality Trends
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post: BlogPost) => (
            <article
              key={post.slug}
              className="rounded-[20px] bg-white overflow-hidden border border-ink/5 hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-ink/5">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block px-3 py-1 rounded-full bg-brass/10 text-brass text-[10px] uppercase tracking-wider font-mono">
                    {post.category}
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider">
                    {post.date} · {post.readTime}
                  </span>
                </div>
                <h3 className="font-display text-ink text-xl leading-snug min-h-[3.5rem]">
                  {post.title}
                </h3>
                <p className="font-body text-sm text-ink-muted leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <a
                  href={`#blog-${post.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-brass hover:gap-2.5 transition-all"
                >
                  Read More
                  <ArrowRight size={14} strokeWidth={1.5} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#blog"
            className="pill pill-ghost-brass px-6 py-2.5 text-xs inline-flex items-center gap-2"
          >
            View All Articles
            <ArrowRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default HospitalityTrends;
