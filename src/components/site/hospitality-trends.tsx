"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/lib/laxree/site-data";

export function HospitalityTrends() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    fetch("/api/admin/blog", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.posts && data.posts.length > 0) {
          // Show up to 3 posts from DB
          const dbPosts = data.posts.slice(0, 3).map((p: any) => ({
            slug: p.slug,
            title: p.title,
            category: p.category || "Blog",
            excerpt: p.excerpt || "",
            image: p.image || "/images/blog/blog-1.webp",
            date: p.date || "",
            readTime: p.readTime || "5 min",
          }));
          setPosts(dbPosts);
        }
      })
      .catch(() => {});
  }, []);

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
          {posts.slice(0, 3).map((post: BlogPost) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[20px] bg-white overflow-hidden border border-ink/5 hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-ink/5">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy" decoding="async"
                  width={800} height={600} className="w-full h-full object-cover"
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
                <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-brass group-hover:gap-2.5 transition-all">
                  Read More
                  <ArrowRight size={14} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="pill pill-ghost-brass px-6 py-2.5 text-xs inline-flex items-center gap-2"
          >
            View All Articles
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HospitalityTrends;
