import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStaticBlogPosts } from "@/lib/admin/static-fallback";

export const runtime = "nodejs";

// GET — list all blog posts
// Falls back to static BLOG_POSTS data when DB is empty (Vercel serverless).
// On local dev (JSON file-based DB), the first call seeds the DB with the
// static posts so the admin can edit/delete them and the changes persist.
export async function GET() {
  try {
    let posts: Awaited<ReturnType<typeof db.blogPost.findMany>> = [];

    try {
      posts = await db.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.error("[ADMIN BLOG GET DB ERROR]", dbErr);
    }

    if (posts.length === 0) {
      // Seed the local DB with the static posts so subsequent edits/deletes
      // actually persist. On production (Vercel serverless), the static
      // fallback is returned directly (no persistence across cold starts).
      const staticPosts = getStaticBlogPosts();
      try {
        for (const p of staticPosts) {
          // Use upsert to avoid duplicate-key errors if a partial seed exists.
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
        posts = await db.blogPost.findMany({
          orderBy: { createdAt: "desc" },
        });
      } catch (seedErr) {
        console.error("[ADMIN BLOG SEED ERROR]", seedErr);
      }

      if (posts.length === 0) {
        // Final fallback — return static data directly (non-persistent).
        posts = staticPosts as unknown as typeof posts;
      }
    }

    return NextResponse.json({ ok: true, posts });
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
