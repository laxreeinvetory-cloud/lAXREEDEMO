import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Image upload endpoint — accepts a multipart/form-data POST with a `file`
 * field (and optional `model` field used only to namespace the filename).
 *
 * Writes the file to `public/uploads/<sanitised-name>` and returns:
 *   { ok: true, imageUrl: "/uploads/<name>", filename, size }
 *
 * The `imageUrl` is what admin pages read and store in CMS / product rows.
 *
 * Constraints:
 *   - Max 8 MB (413 on overflow)
 *   - MIME allow-list: jpeg / png / webp / gif / avif / svg+xml (415 otherwise)
 *   - Filenames are lower-cased and stripped of any non [a-z0-9._-] char
 *     so they're safe to serve from the static folder on any OS.
 */

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
  // Take last path segment if a full path is sent
  const base = lower.split(/[\\/]/).pop() || lower;
  // Replace any char that isn't a-z, 0-9, ., _, - with a dash
  const cleaned = base.replace(/[^a-z0-9._-]+/g, "-");
  // Trim leading/trailing dashes
  const trimmed = cleaned.replace(/^-+|-+$/g, "");
  // Cap length to keep filesystem happy
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "No file provided (expected 'file' field)" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { ok: false, message: "Empty file" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          message: `File too large (${file.size} bytes). Max ${MAX_BYTES} bytes.`,
        },
        { status: 413 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          message: `Unsupported file type: ${file.type || "unknown"}`,
        },
        { status: 415 }
      );
    }

    const { writeFile, mkdir } = await import("node:fs/promises");
    const path = await import("node:path");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = uniqueName(sanitiseFilename(file.name || "upload"));
    const filePath = path.join(uploadsDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${safeName}`;
    return NextResponse.json({
      ok: true,
      imageUrl,
      filename: safeName,
      size: file.size,
    });
  } catch (err) {
    console.error("[ADMIN UPLOAD ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error during upload" },
      { status: 500 }
    );
  }
}
