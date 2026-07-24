import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB after compression
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

/* POST /api/admin/upload
   Body: FormData with `file` (Blob) and optional `model` (string used to
   derive a clean filename). Stores the image as a base64 data URL in
   SiteContent under key `image:<filename>` and returns the public URL
   `/api/admin/upload/<filename>` that the front-end can use directly. */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const model = (form.get("model") as string | null) || "";

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { ok: false, message: "No file provided" },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { ok: false, message: "File is empty" },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, message: "File too large (max 8 MB)" },
        { status: 413 },
      );
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { ok: false, message: `Unsupported file type: ${file.type}` },
        { status: 415 },
      );
    }

    // Build a clean, unique filename
    const ext = file.type.split("/")[1]?.replace("svg+xml", "svg") || "jpg";
    const base = (model || file.name || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "upload";
    const filename = `${base}.${ext}`;

    // Read file bytes -> base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Persist to SiteContent (upsert by key)
    const key = `image:${filename}`;
    await db.siteContent.upsert({
      where: { key },
      create: { key, value: dataUrl },
      update: { value: dataUrl },
    });

    return NextResponse.json({
      ok: true,
      imageUrl: `/api/admin/upload/${filename}`,
      filename,
      size: file.size,
    });
  } catch (err) {
    console.error("[UPLOAD POST ERROR]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { ok: false, message: `Upload failed: ${message}` },
      { status: 500 },
    );
  }
}
