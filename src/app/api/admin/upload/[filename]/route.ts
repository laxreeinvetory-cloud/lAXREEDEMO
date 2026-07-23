import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — serve an uploaded image by filename from DB
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename) {
    return NextResponse.json({ ok: false, message: "Filename required" }, { status: 400 });
  }

  // Try DB first (persists on Vercel)
  try {
    const key = `image:${filename}`;
    const row = await db.siteContent.findUnique({ where: { key } });
    if (row && row.value.startsWith("data:")) {
      const match = row.value.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
      if (match) {
        const [, mimeType, base64Data] = match;
        const buffer = Buffer.from(base64Data, "base64");
        const uint8 = new Uint8Array(buffer);
        return new NextResponse(uint8, {
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }
  } catch {
    // DB error
  }

  // Not found — redirect to placeholder
  return NextResponse.redirect(new URL("/images/product-catalogue/coming-soon.jpg", req.url), 302);
}
