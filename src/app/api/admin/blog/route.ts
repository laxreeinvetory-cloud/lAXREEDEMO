import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

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
      },
    });

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

    const post = await db.blogPost.update({
      where: { id },
      data: data,
    });

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

    await db.blogPost.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Post deleted" });
  } catch (err) {
    console.error("[ADMIN BLOG DELETE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
