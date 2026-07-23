import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — retrieve all CMS content or a specific section
// Usage: GET /api/admin/cms (returns all)
//        GET /api/admin/cms?key=homepage (returns specific section)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      const row = await db.siteContent.findUnique({ where: { key } });
      if (row) {
        try {
          return NextResponse.json({ ok: true, key, value: JSON.parse(row.value) });
        } catch {
          return NextResponse.json({ ok: true, key, value: row.value });
        }
      }
      return NextResponse.json({ ok: true, key, value: null });
    }

    // Return all CMS content
    const rows = await db.siteContent.findMany();
    const content: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        content[row.key] = JSON.parse(row.value);
      } catch {
        content[row.key] = row.value;
      }
    }
    return NextResponse.json({ ok: true, content });
  } catch (err) {
    console.error("[CMS GET ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// PUT — save CMS content for a section
// Body: { key: "homepage:categories", value: {...} }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ ok: false, message: "Key is required" }, { status: 400 });
    }

    const serialized = typeof value === "string" ? value : JSON.stringify(value);

    await db.siteContent.upsert({
      where: { key },
      update: { value: serialized },
      create: { key, value: serialized },
    });

    return NextResponse.json({ ok: true, key });
  } catch (err) {
    console.error("[CMS PUT ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE — remove a CMS section
// Usage: DELETE /api/admin/cms?key=homepage:categories
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ ok: false, message: "Key is required" }, { status: 400 });
    }

    await db.siteContent.deleteMany({ where: { key } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CMS DELETE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
