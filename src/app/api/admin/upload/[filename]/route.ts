import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  try {
    const row = await db.siteContent.findUnique({
      where: { key: `image:${filename}` },
      select: { value: true },
    });

    if (!row || !row.value) {
      const transparentPixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
        "base64",
      );
      return new NextResponse(transparentPixel, {
        status: 404,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
        },
      });
    }

    const value = row.value;
    let mime = "image/jpeg";
    let base64Data = value;

    if (value.startsWith("data:")) {
      const commaIdx = value.indexOf(",");
      if (commaIdx > -1) {
        const meta = value.substring(5, commaIdx);
        mime = meta.split(";")[0] || "image/jpeg";
        base64Data = value.substring(commaIdx + 1);
      }
    } else {
      const ext = filename.split(".").pop()?.toLowerCase();
      if (ext === "png") mime = "image/png";
      else if (ext === "webp") mime = "image/webp";
      else if (ext === "gif") mime = "image/gif";
      else if (ext === "svg") mime = "image/svg+xml";
      else mime = "image/jpeg";
    }

    const body = new Uint8Array(Buffer.from(base64Data, "base64"));

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[upload/serve] error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
