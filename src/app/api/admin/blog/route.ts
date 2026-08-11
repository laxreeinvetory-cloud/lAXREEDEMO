import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStaticBlogPosts } from "@/lib/admin/static-fallback";

export const runtime = "nodejs";

// GET — list all blog posts
// Merges static BLOG_POSTS data with DB posts so deleted static posts
// are restored on the next request. DB posts take priority (admin edits
// win), but any static post missing from the DB is re-seeded.
export async function GET() {
  try {
    let dbPosts: Awaited<ReturnType<typeof db.blogPost.findMany>> = [];

    try {
      dbPosts = await db.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.error("[ADMIN BLOG GET DB ERROR]", dbErr);
    }

    const staticPosts = getStaticBlogPosts();

    // Find which static posts are missing from the DB and seed them
    const dbSlugs = new Set(dbPosts.map((p: { slug: string }) => p.slug));
    const missingStatic = staticPosts.filter((p) => !dbSlugs.has(p.slug));

    if (missingStatic.length > 0) {
      try {
        for (const p of missingStatic) {
          await db.blogPost.upsert({
            where: { slug: p.slug },
            create: {
              slug: p.slug,
              title: p.title,
              category: p.category,
              excerpt: p.excerpt,
              content: p.content,
              image: p.image,
              author: p.author,
              authorRole: p.authorRole,
              date: p.date,
              readTime: p.readTime,
              published: p.published,
            },
            update: {},
          });
        }
        // Re-fetch with the newly seeded posts
        dbPosts = await db.blogPost.findMany({
          orderBy: { createdAt: "desc" },
        });
      } catch (seedErr) {
        console.error("[ADMIN BLOG SEED ERROR]", seedErr);
        // If seeding fails (e.g. DB not writable), merge static posts into
        // the response so the admin still sees all posts.
        const existingSlugs = new Set(dbPosts.map((p: { slug: string }) => p.slug));
        for (const p of staticPosts) {
          if (!existingSlugs.has(p.slug)) {
            dbPosts.push(p as unknown as (typeof dbPosts)[0]);
          }
        }
      }
    }

    return NextResponse.json({ ok: true, posts: dbPosts });
  } catch (err) {
    console.error("[ADMIN BLOG GET ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const post = await db.blogPost.create({
      data: {
        slug: body.slug,
        title: body.title,
        category: body.category,
        excerpt: body.excerpt,
        content: JSON.stringify(body.content || []),
        image: body.image || "/images/blog/blog-1.jpg",
        author: body.author || "LaxRee Editorial Team",
        authorRole: body.authorRole || "Hospitality Procurement Insights",
        date: body.date || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        readTime: body.readTime || "5 min",
        published: body.published !== false,
        // SEO fields — stored in content JSON as _seo object
      },
    });

    // Store SEO fields in a separate SiteContent entry
    if (body.seoTitle || body.metaDescription || body.keywords || body.faqJsonLd) {
      const seoKey = `blog:seo:${body.slug}`;
      const seoValue = {
        seoTitle: body.seoTitle || "",
        metaDescription: body.metaDescription || "",
        keywords: body.keywords || "",
        canonicalUrl: body.canonicalUrl || "",
        ogImage: body.ogImage || "",
        faqJsonLd: body.faqJsonLd || "",
      };
      try {
        await db.siteContent.upsert({
          where: { key: seoKey },
          update: { value: JSON.stringify(seoValue) },
          create: { key: seoKey, value: JSON.stringify(seoValue) },
        });
      } catch (e) {
        console.error("[BLOG SEO SAVE ERROR]", e);
      }
    }

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("[ADMIN BLOG CREATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();

    if (data.content && typeof data.content !== "string") {
      data.content = JSON.stringify(data.content);
    }

    // Extract SEO fields before updating blog post
    const { seoTitle, metaDescription, keywords, canonicalUrl, ogImage, faqJsonLd, ...postData } = data;

    const post = await db.blogPost.update({
      where: { id },
      data: postData,
    });

    // Save SEO fields to SiteContent
    if (post.slug && (seoTitle || metaDescription || keywords || faqJsonLd)) {
      const seoKey = `blog:seo:${post.slug}`;
      const seoValue = {
        seoTitle: seoTitle || "",
        metaDescription: metaDescription || "",
        keywords: keywords || "",
        canonicalUrl: canonicalUrl || "",
        ogImage: ogImage || "",
        faqJsonLd: faqJsonLd || "",
      };
      try {
        await db.siteContent.upsert({
          where: { key: seoKey },
          update: { value: JSON.stringify(seoValue) },
          create: { key: seoKey, value: JSON.stringify(seoValue) },
        });
      } catch (e) {
        console.error("[BLOG SEO UPDATE ERROR]", e);
      }
    }

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("[ADMIN BLOG UPDATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID required" }, { status: 400 });
    }

    // If the ID is a static-fallback ID (starts with "static-blog-"),
    // the post doesn't exist in the DB yet. Try to seed all static posts
    // first, then find and delete the one matching this slug.
    if (id.startsWith("static-blog-")) {
      const slug = id.replace("static-blog-", "");
      try {
        // Seed all static posts into the DB so they can be edited/deleted
        const staticPosts = getStaticBlogPosts();
        for (const p of staticPosts) {
          await db.blogPost.upsert({
            where: { slug: p.slug },
            create: {
              slug: p.slug,
              title: p.title,
              category: p.category,
              excerpt: p.excerpt,
              content: p.content,
              image: p.image,
              author: p.author,
              authorRole: p.authorRole,
              date: p.date,
              readTime: p.readTime,
              published: p.published,
            },
            update: {},
          });
        }
        // Now find the real DB post by slug and delete it
        const realPost = await db.blogPost.findUnique({ where: { slug } });
        if (realPost) {
          await db.blogPost.delete({ where: { id: realPost.id } });
          return NextResponse.json({ ok: true, message: "Post deleted" });
        }
        return NextResponse.json({ ok: false, message: "Post not found after seeding" }, { status: 404 });
      } catch (seedErr) {
        console.error("[ADMIN BLOG DELETE SEED ERROR]", seedErr);
        return NextResponse.json({
          ok: false,
          message: "Database is not writable. Check that the Neon Postgres DATABASE_URL is configured on Vercel and that 'prisma db push' has been run to create tables.",
          error: seedErr instanceof Error ? seedErr.message : String(seedErr),
        }, { status: 500 });
      }
    }

    // Normal delete — the ID is a real DB row ID
    try {
      await db.blogPost.delete({ where: { id } });
      return NextResponse.json({ ok: true, message: "Post deleted" });
    } catch (deleteErr) {
      // If the record doesn't exist, return 404 instead of 500
      const msg = deleteErr instanceof Error ? deleteErr.message : String(deleteErr);
      if (msg.includes("P2025") || msg.includes("not found")) {
        return NextResponse.json({ ok: false, message: "Post not found in database" }, { status: 404 });
      }
      throw deleteErr;
    }
  } catch (err) {
    console.error("[ADMIN BLOG DELETE ERROR]", err);
    return NextResponse.json({
      ok: false,
      message: "Database error. If this persists, check that the Neon Postgres DATABASE_URL is configured on Vercel.",
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
