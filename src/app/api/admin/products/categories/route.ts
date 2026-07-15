import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// GET — list all categories ordered by sortOrder asc
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    console.error("[ADMIN CATEGORIES GET ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// POST — create a category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const category = await db.category.create({
      data: {
        slug: body.slug,
        name: body.name,
        count: Number.isFinite(Number(body.count)) ? Number(body.count) : 0,
        blurb: body.blurb || "",
        image: body.image || "/images/categories/placeholder.jpg",
        span: body.span || "default",
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
    });

    return NextResponse.json({ ok: true, category });
  } catch (err) {
    console.error("[ADMIN CATEGORIES CREATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH — update a category by id
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID required" }, { status: 400 });
    }

    if (data.count !== undefined) {
      data.count = Number.isFinite(Number(data.count)) ? Number(data.count) : 0;
    }
    if (data.sortOrder !== undefined) {
      data.sortOrder = Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0;
    }

    const category = await db.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, category });
  } catch (err) {
    console.error("[ADMIN CATEGORIES UPDATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE — delete a category by ?id=
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID required" }, { status: 400 });
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ADMIN CATEGORIES DELETE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
