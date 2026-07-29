import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

function sanitiseFilename(raw: string): string {
  const lower = raw.toLowerCase();
  const base = lower.split(/[\\/]/).pop() || lower;
  const cleaned = base.replace(/[^a-z0-9._-]+/g, "-");
  const trimmed = cleaned.replace(/^-+|-+$/g, "");
  return (trimmed || "upload").slice(0, 60);
}

function uniqueName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot) : "";
  const rand = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36);
  return `${stem}-${ts}-${rand}${ext}`;
}

/**
 * POST /api/admin/upload
 * Accepts FormData with `file` (Blob) and optional `model` (string).
 * Stores the image as a base64 data URL in SiteContent under
 * key `image:<filename>` and returns the serve URL.
 *
 * Vercel's filesystem is READ-ONLY, so we cannot write to public/uploads/.
 * Instead, images are stored in the DB and served via /api/admin/upload/[filename].
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const model = (formData.get("model") as string | null) || "";

    if (!file || !(file instanceof File)) {
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

    if (!ALLOWED_TYPES.has(file.type)) {
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
    const filename = uniqueName(`${base}.${ext}`);

    // Read file bytes → base64 data URL
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
