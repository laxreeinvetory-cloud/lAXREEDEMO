import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (source) where.source = source;

    let leads: Array<Record<string, unknown>> = [];
    let total = 0;

    try {
      [leads, total] = await Promise.all([
        db.lead.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.lead.count({ where }),
      ]);
    } catch (dbErr) {
      // DB unavailable (Vercel serverless ephemeral FS) — return empty gracefully
      console.error("[ADMIN LEADS DB ERROR]", dbErr);
    }

    return NextResponse.json({
      ok: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[ADMIN LEADS ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    const lead = await db.lead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    console.error("[ADMIN LEADS UPDATE ERROR]", err);
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

    await db.lead.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Lead deleted" });
  } catch (err) {
    console.error("[ADMIN LEADS DELETE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
