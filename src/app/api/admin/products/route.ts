import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// GET — list products (optionally filtered by ?category=slug) + all categories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const productWhere: Record<string, unknown> = {};
    if (category && category !== "all") productWhere.category = category;

    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: productWhere,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      db.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return NextResponse.json({ ok: true, products, categories });
  } catch (err) {
    console.error("[ADMIN PRODUCTS GET ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// POST — create a product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const specs =
      Array.isArray(body.specs) ? JSON.stringify(body.specs) : (body.specs || "[]");

    const product = await db.product.create({
      data: {
        model: body.model,
        name: body.name,
        category: body.category || "",
        image: body.image || "/images/product-catalogue/placeholder.jpg",
        description: body.description || "",
        specs,
        price: body.price || "",
        featured: !!body.featured,
        published: body.published !== false,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
    });

    return NextResponse.json({ ok: true, product });
  } catch (err) {
    console.error("[ADMIN PRODUCTS CREATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH — update a product by id
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID required" }, { status: 400 });
    }

    if (Array.isArray(data.specs)) {
      data.specs = JSON.stringify(data.specs);
    }

    if (data.sortOrder !== undefined) {
      data.sortOrder = Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0;
    }

    if (data.featured !== undefined) data.featured = !!data.featured;
    if (data.published !== undefined) data.published = !!data.published;

    const product = await db.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, product });
  } catch (err) {
    console.error("[ADMIN PRODUCTS UPDATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE — delete a product by ?id=
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID required" }, { status: 400 });
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ADMIN PRODUCTS DELETE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
