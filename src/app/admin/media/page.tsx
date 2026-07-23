"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
  AlertCircle,
  FileWarning,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Image compression utility — copied from products page.
// Compresses before upload to avoid large payloads / 413s.
// ─────────────────────────────────────────────────────────────
async function compressImage(
  file: File,
  maxDim: number,
  quality: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressed = new File([blob], file.name, {
                type: "image/jpeg",
              });
              resolve(compressed);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type MediaItem = {
  id: string;
  url: string;
  filename: string;
  size: number; // bytes
  uploadDate: string; // ISO
};

type UploadJob = {
  id: string;
  filename: string;
  status: "compressing" | "uploading" | "done" | "error";
  error?: string;
};

// ─────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────
const CMS_KEY = "media-library";
const MAX_DIM = 1600;
const QUALITY = 0.82;
const COMPRESS_THRESHOLD = 1 * 1024 * 1024; // 1MB

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/50";

function formatSize(bytes: number): string {
  if (!bytes || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function shortName(name: string, max = 22): string {
  if (name.length <= max) return name;
  const ext = name.lastIndexOf(".");
  if (ext > 0 && name.length - ext < 8) {
    const base = name.slice(0, ext);
    const extStr = name.slice(ext);
    const keep = Math.max(4, max - extStr.length - 1);
    return `${base.slice(0, keep)}…${extStr}`;
  }
  return `${name.slice(0, max - 1)}…`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function AdminMediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadJobs, setUploadJobs] = useState<UploadJob[]>([]);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    msg: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);
  const itemsRef = useRef<MediaItem[]>([]);

  // Keep a ref in sync so async save handlers always read the latest list
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const showToast = useCallback((kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Load media library from CMS ──────────────────────────
  const loadMediaLibrary = useCallback(async (): Promise<MediaItem[]> => {
    try {
      const res = await fetch(`/api/admin/cms?key=${CMS_KEY}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.value)) {
        return data.value as MediaItem[];
      }
      return [];
    } catch {
      showToast("err", "Failed to load media library");
      return [];
    }
  }, [showToast]);

  useEffect(() => {
    (async () => {
      const list = await loadMediaLibrary();
      setItems(list);
      setLoading(false);
    })();
  }, [loadMediaLibrary]);

  // ── Persist the full list to CMS ─────────────────────────
  const persistMediaLibrary = useCallback(
    async (next: MediaItem[]) => {
      // Coalesce concurrent saves — last writer wins via the ref
      itemsRef.current = next;
      if (savingRef.current) return;
      savingRef.current = true;
      try {
        // Small delay to coalesce rapid successive writes (e.g. multi-upload)
        await new Promise((r) => setTimeout(r, 120));
        const snapshot = itemsRef.current;
        await fetch("/api/admin/cms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: CMS_KEY, value: snapshot }),
        });
      } catch {
        showToast("err", "Failed to save media library to CMS");
      } finally {
        savingRef.current = false;
      }
    },
    [showToast]
  );

  // ── Save a single new image to the library ───────────────
  const saveToMediaLibrary = useCallback(
    async (image: {
      url: string;
      filename: string;
      size: number;
      date: string;
    }) => {
      const item: MediaItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        url: image.url,
        filename: image.filename,
        size: image.size,
        uploadDate: image.date,
      };
      const next = [item, ...itemsRef.current];
      setItems(next);
      await persistMediaLibrary(next);
      return item;
    },
    [persistMediaLibrary]
  );

  // ── Upload a single image via the upload API ─────────────
  const uploadImage = useCallback(
    async (file: File): Promise<{ url: string; size: number }> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "media-library");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "Server error");
        if (res.status === 413) {
          throw new Error(
            "Image too large even after compression. Please use a smaller image (max 8MB)."
          );
        }
        throw new Error(`Upload failed (${res.status}): ${text.slice(0, 120)}`);
      }
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.message || "Upload failed — please try again");
      }
      return { url: data.imageUrl, size: data.size ?? file.size };
    },
    []
  );

  // ── Handle a batch of files (compress → upload → save) ───
  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(isImageFile);
      if (files.length === 0) {
        showToast("err", "Please select image files only");
        return;
      }

      // Seed upload jobs so progress is visible immediately
      const jobs: UploadJob[] = files.map((f, i) => ({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        filename: f.name,
        status: "compressing",
      }));
      setUploadJobs((prev) => [...jobs, ...prev]);

      let successCount = 0;

      await Promise.all(
        files.map(async (file, idx) => {
          const job = jobs[idx];
          try {
            // Compress if large
            let uploadFile = file;
            if (file.size > COMPRESS_THRESHOLD) {
              uploadFile = await compressImage(file, MAX_DIM, QUALITY);
            }

            setUploadJobs((prev) =>
              prev.map((j) =>
                j.id === job.id ? { ...j, status: "uploading" } : j
              )
            );

            const { url, size } = await uploadImage(uploadFile);
            await saveToMediaLibrary({
              url,
              filename: file.name,
              size,
              date: new Date().toISOString(),
            });

            successCount++;
            setUploadJobs((prev) =>
              prev.map((j) => (j.id === job.id ? { ...j, status: "done" } : j))
            );
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : "Unknown upload error";
            setUploadJobs((prev) =>
              prev.map((j) =>
                j.id === job.id ? { ...j, status: "error", error: msg } : j
              )
            );
          }
        })
      );

      // Clear completed jobs after a short delay; keep errors a bit longer
      setTimeout(() => {
        setUploadJobs((prev) => prev.filter((j) => j.status !== "done"));
      }, 1500);

      if (successCount > 0) {
        showToast(
          "ok",
          `Uploaded ${successCount} image${successCount > 1 ? "s" : ""}${
            successCount < files.length
              ? ` (${files.length - successCount} failed)`
              : ""
          }`
        );
      } else if (files.length > 0) {
        showToast("err", "All uploads failed — check file sizes and try again");
      }
    },
    [uploadImage, saveToMediaLibrary, showToast]
  );

  // ── Drag & drop handlers ─────────────────────────────────
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  // ── Delete an image ──────────────────────────────────────
  const handleDelete = useCallback(
    async (item: MediaItem) => {
      if (
        !confirm(
          `Delete "${item.filename}"?\n\nThis removes it from the media library. The file on disk is not deleted.`
        )
      ) {
        return;
      }
      const next = itemsRef.current.filter((m) => m.id !== item.id);
      setItems(next);
      await persistMediaLibrary(next);
      showToast("ok", "Image removed from library");
      if (preview?.id === item.id) setPreview(null);
    },
    [persistMediaLibrary, showToast, preview]
  );

  // ── Copy URL to clipboard ────────────────────────────────
  const handleCopyUrl = useCallback(
    async (item: MediaItem) => {
      const absolute = new URL(item.url, window.location.origin).toString();
      try {
        await navigator.clipboard.writeText(absolute);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 1500);
        showToast("ok", "Image URL copied to clipboard");
      } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = absolute;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 1500);
          showToast("ok", "Image URL copied to clipboard");
        } catch {
          showToast("err", "Could not copy URL — please copy manually");
        }
        document.body.removeChild(ta);
      }
    },
    [showToast]
  );

  // ── Filtered list (search by filename) ───────────────────
  const filtered = items.filter((m) =>
    !search.trim()
      ? true
      : m.filename.toLowerCase().includes(search.trim().toLowerCase())
  );

  const inProgress = uploadJobs.filter(
    (j) => j.status === "compressing" || j.status === "uploading"
  ).length;

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-brass" strokeWidth={1.75} />
            Media Library
          </h1>
          <p className="text-sm text-gray-400">
            Upload, browse, and manage images.{" "}
            <span className="text-gray-500">
              {items.length} image{items.length !== 1 ? "s" : ""} stored.
            </span>
          </p>
        </div>
      </div>

      {/* Upload area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload images — click or drag and drop"
        className={`group relative cursor-pointer rounded-xl border-2 border-dashed transition-colors p-8 md:p-12 text-center mb-6 ${
          dragging
            ? "border-yellow-500 bg-yellow-500/5"
            : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
            // Reset so selecting the same file again still fires onChange
            e.target.value = "";
          }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${
              dragging
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-white/10 text-gray-300 group-hover:text-white"
            }`}
          >
            {inProgress > 0 ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Upload className="h-7 w-7" strokeWidth={1.75} />
            )}
          </div>
          <div>
            <p className="text-white font-medium">
              {dragging
                ? "Drop images to upload"
                : inProgress > 0
                ? `Uploading ${inProgress} image${inProgress > 1 ? "s" : ""}…`
                : "Drag & drop images here, or click to browse"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPEG, PNG, WebP, GIF, AVIF, SVG · multiple files supported ·
              large images auto-compressed
            </p>
          </div>
        </div>
      </div>

      {/* Upload progress jobs */}
      {uploadJobs.length > 0 && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Upload activity
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {uploadJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-2 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs"
                title={job.error || job.filename}
              >
                {job.status === "compressing" && (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-gray-400" />
                )}
                {job.status === "uploading" && (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-yellow-500" />
                )}
                {job.status === "done" && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                )}
                {job.status === "error" && (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                )}
                <span className="truncate flex-1 text-gray-300">
                  {job.filename}
                </span>
                <span className="shrink-0 text-gray-500">
                  {job.status === "compressing"
                    ? "compressing"
                    : job.status === "uploading"
                    ? "uploading"
                    : job.status === "done"
                    ? "done"
                    : "failed"}
                </span>
              </div>
            ))}
          </div>
          {uploadJobs.some((j) => j.status === "error") && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              <FileWarning className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                Some uploads failed. Hover the failed item for details —
                usually the image is too large or in an unsupported format.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toolbar: search + count */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className={inputClass + " pl-9"}
            aria-label="Search media by filename"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Showing {filtered.length} of {items.length}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brass" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <ImageIcon className="h-8 w-8 text-gray-600" strokeWidth={1.5} />
          </div>
          <p className="text-gray-400 font-medium">
            {search
              ? "No images match your search."
              : "No images yet. Upload your first image above."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm text-brass hover:text-brass-light underline-offset-4 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <button
                type="button"
                onClick={() => setPreview(item)}
                className="relative aspect-square w-full bg-black/30 overflow-hidden flex items-center justify-center"
                aria-label={`Preview ${item.filename}`}
                title="Click to preview"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.filename}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                    const sib = t.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = "flex";
                  }}
                />
                <div
                  className="absolute inset-0 items-center justify-center text-gray-600"
                  style={{ display: "none" }}
                >
                  <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-end gap-1 p-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(item);
                    }}
                    className="h-8 w-8 rounded-lg bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                    aria-label="Copy image URL"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="h-8 w-8 rounded-lg bg-red-500/30 hover:bg-red-500/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                    aria-label={`Delete ${item.filename}`}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </button>

              {/* Filename + meta */}
              <div className="p-2.5">
                <p
                  className="text-xs text-white truncate font-medium"
                  title={item.filename}
                >
                  {shortName(item.filename, 26)}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                  <span>{formatSize(item.size)}</span>
                  <span>{formatDate(item.uploadDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview: ${preview.filename}`}
        >
          <div
            className="relative bg-gray-900 border border-white/15 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/10">
              <div className="min-w-0">
                <p
                  className="text-sm font-medium text-white truncate"
                  title={preview.filename}
                >
                  {preview.filename}
                </p>
                <p className="text-[11px] text-gray-500">
                  {formatSize(preview.size)} · {formatDate(preview.uploadDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyUrl(preview)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs border border-white/15 transition-colors"
                >
                  {copiedId === preview.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy URL
                    </>
                  )}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition-colors"
                  aria-label="Close preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal body — image */}
            <div className="flex-1 min-h-0 p-4 flex items-center justify-center bg-black/40 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.filename}
                className="max-w-full max-h-[72vh] object-contain rounded-lg"
              />
            </div>

            {/* Modal footer — URL */}
            <div className="px-5 py-3 border-t border-white/10 flex items-center gap-2">
              <code className="flex-1 min-w-0 truncate text-[11px] text-gray-400 bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono">
                {new URL(preview.url, window.location.origin).toString()}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[110]">
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm shadow-2xl border ${
              toast.kind === "ok"
                ? "bg-emerald-600/90 border-emerald-400/40 text-white"
                : "bg-red-600/90 border-red-400/40 text-white"
            }`}
          >
            {toast.kind === "ok" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
