import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST — upload a product image
// Saves image as base64 in SiteContent table (persists on Vercel)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const model = (formData.get("model") as string) || "product";

    if (!file) {
      return NextResponse.json(
        { ok: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif", "image/svg+xml"];
    const mime = file.type || "";
    if (mime && !allowedTypes.includes(mime)) {
      return NextResponse.json(
        { ok: false, message: `Unsupported file type: ${mime}. Use JPEG, PNG, or WebP.` },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB — base64 in DB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, message: "File too large. Max 5MB. Please compress before uploading." },
        { status: 400 }
      );
    }

    // Read file buffer and convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = mime || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Determine extension for filename
    const ext = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : mimeType === "image/gif" ? "gif" : mimeType === "image/svg+xml" ? "svg" : "jpg";
    const safeModel = (model || "product").replace(/[^a-zA-Z0-9-_]/g, "-");
    const filename = `${safeModel}.${ext}`;

    // Save to database (SiteContent table) — persists on Vercel
    const key = `image:${filename}`;
    let savedToDb = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await db.siteContent.upsert({
          where: { key },
          update: { value: dataUrl },
          create: { key, value: dataUrl },
        });
        savedToDb = true;
        console.log(`[UPLOAD] Saved to DB (attempt ${attempt}):`, key, "size:", file.size);
        break;
      } catch (dbErr) {
        console.error(`[UPLOAD DB ERROR attempt ${attempt}]`, dbErr);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      }
    }

    if (!savedToDb) {
      // If DB fails, return the data URL directly — image still displays
      console.error("[UPLOAD] All DB attempts failed, returning data URL directly");
      return NextResponse.json({
        ok: true,
        imageUrl: dataUrl,
        filename,
        size: file.size,
        savedToDb: false,
      });
    }

    // Return the serve URL
    const imageUrl = `/api/admin/upload/${filename}`;

    return NextResponse.json({
      ok: true,
      imageUrl,
      filename,
      size: file.size,
      savedToDb: true,
    });
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
