import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/* Serve an image previously stored as a base64 data URL in SiteContent.
   The upload POST route stores it under key `image:<filename>`.
   This route decodes the data URL and returns raw image bytes with a
   long-lived cache header so browsers/CDNs cache it efficiently. */
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
      // Return a 1x1 transparent pixel instead of a 404 so <img> tags
      // don't show a broken-image icon; the alt text remains accessible.
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
    // Value is stored as `data:image/jpeg;base64,<data>` OR raw base64.
    let mime = "image/jpeg";
    let base64Data = value;

    if (value.startsWith("data:")) {
      // Parse data URL: data:<mime>;base64,<data>
      const commaIdx = value.indexOf(",");
      if (commaIdx > -1) {
        const meta = value.substring(5, commaIdx); // "image/jpeg;base64"
        mime = meta.split(";")[0] || "image/jpeg";
        base64Data = value.substring(commaIdx + 1);
      }
    } else {
      // Guess mime from extension
      const ext = filename.split(".").pop()?.toLowerCase();
      if (ext === "png") mime = "image/png";
      else if (ext === "webp") mime = "image/webp";
      else if (ext === "gif") mime = "image/gif";
      else if (ext === "svg") mime = "image/svg+xml";
      else mime = "image/jpeg";
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, "base64");
    } catch {
      return new NextResponse("Invalid image data", { status: 500 });
    }

    // Convert Buffer to Uint8Array — NextResponse's body type accepts
    // Uint8Array but not Node's Buffer directly (TS strict mode).
    const body = new Uint8Array(buffer);

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
