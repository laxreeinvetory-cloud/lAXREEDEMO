import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB hard cap (images should be compressed client-side first)

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

function sanitizeName(name: string): string {
  // Keep the extension, strip anything unsafe from the base name
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = path.basename(name, path.extname(name));
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${safeBase || "image"}${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { ok: false, message: "File is empty" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          message: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max ${MAX_BYTES / (1024 * 1024)}MB.`,
        },
        { status: 413 }
      );
    }

    // Validate MIME type when known; SVG may arrive as image/svg+xml
    const mime = file.type || "";
    if (mime && !ALLOWED_MIME.has(mime)) {
      return NextResponse.json(
        { ok: false, message: `Unsupported file type: ${mime}` },
        { status: 415 }
      );
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Build a unique filename: <short-hash>-<timestamp>-<sanitized>
    const buf = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 8);
    const stamp = Date.now();
    const safeName = sanitizeName(file.name || "image");
    const uniqueName = `${hash}-${stamp}-${safeName}`;

    const dest = path.join(UPLOAD_DIR, uniqueName);
    await writeFile(dest, buf);

    const imageUrl = `${PUBLIC_PREFIX}/${uniqueName}`;

    return NextResponse.json({
      ok: true,
      imageUrl,
      filename: file.name || uniqueName,
      size: file.size,
    });
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error ? err.message : "Upload failed — server error",
      },
      { status: 500 }
    );
  }
}
