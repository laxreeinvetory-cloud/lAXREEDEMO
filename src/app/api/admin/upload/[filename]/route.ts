import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  try {
    const row = await db.siteContent.findUnique({ where: { key: `image:${filename}` }, select: { value: true } });
    if (!row || !row.value) {
      const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC", "base64");
      return new NextResponse(pixel, { status: 404, headers: { "Content-Type": "image/png", "Cache-Control": "no-store" } });
    }
    let mime = "image/jpeg";
    let base64Data = row.value;
    if (row.value.startsWith("data:")) {
      const commaIdx = row.value.indexOf(",");
      if (commaIdx > -1) { mime = row.value.substring(5, commaIdx).split(";")[0] || "image/jpeg"; base64Data = row.value.substring(commaIdx + 1); }
    }
    const body = new Uint8Array(Buffer.from(base64Data, "base64"));
    return new NextResponse(body, { status: 200, headers: { "Content-Type": mime, "Cache-Control": "no-cache, no-store, must-revalidate", "X-Content-Type-Options": "nosniff" } });
  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
}
