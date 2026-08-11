"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  Check,
  Loader2,
  ArrowUp,
  ArrowDown,
  Users,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";
import { CLIENT_LOGOS } from "@/lib/laxree/site-data";

/* ─────────────────────────────────────────────────────────────
   Types & constants
   ───────────────────────────────────────────────────────────── */
type ClientLogo = {
  id: string;
  name: string;
  logo: string;
};

const CMS_KEY = "client-logos";

/** Build a reasonably-unique id from timestamp + random suffix. */
function makeId(): string {
  return `cl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Build the default logo list from the hardcoded CLIENT_LOGOS array. */
function buildDefaults(): ClientLogo[] {
  return CLIENT_LOGOS.map((l) => ({
    id: makeId(),
    name: l.name,
    logo: l.logo,
  }));
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function AdminClientLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [editing, setEditing] = useState<ClientLogo | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null
  );

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLogos = async () => {
    try {
      const res = await fetch(`/api/admin/cms?key=${CMS_KEY}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.value)) {
        // Defensive: filter out malformed entries & ensure ids
        const cleaned: ClientLogo[] = data.value
          .filter(
            (v: unknown): v is ClientLogo =>
              !!v &&
              typeof v === "object" &&
              typeof (v as ClientLogo).name === "string" &&
              typeof (v as ClientLogo).logo === "string"
          )
          .map((v: ClientLogo) =>
            v.id ? v : { ...v, id: makeId() }
          );
        setLogos(cleaned);
      } else {
        // No CMS value yet — start empty so admin can add or reset.
        setLogos([]);
      }
    } catch (err) {
      console.error("[ADMIN CLIENT-LOGOS PAGE] fetch error:", err);
      showToast("err", "Failed to load logos from CMS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  /** Persist the full array to CMS. */
  const persist = async (next: ClientLogo[]): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: CMS_KEY, value: next }),
      });
      const data = await res.json();
      if (data?.ok) {
        return true;
      }
      showToast("err", "Failed to save logos");
      return false;
    } catch {
      showToast("err", "Network error saving logos");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (logo: ClientLogo) => {
    let next: ClientLogo[];
    if (editing) {
      next = logos.map((l) => (l.id === logo.id ? logo : l));
    } else {
      next = [...logos, logo];
    }
    const ok = await persist(next);
    if (ok) {
      setLogos(next);
      showToast("ok", editing ? "Logo updated — live on website!" : "Logo added — live on website!");
      setEditing(null);
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this client logo? This cannot be undone.")) return;
    setDeletingId(id);
    const next = logos.filter((l) => l.id !== id);
    const ok = await persist(next);
    if (ok) {
      setLogos(next);
      showToast("ok", "Logo deleted");
    }
    setDeletingId(null);
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= logos.length) return;
    const next = [...logos];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setLogos(next); // optimistic
    const ok = await persist(next);
    if (!ok) {
      // revert by refetching
      fetchLogos();
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset to the 13 default client logos? This will REPLACE the current list with the hardcoded defaults from site-data.ts."
      )
    )
      return;
    setResetting(true);
    const defaults = buildDefaults();
    const ok = await persist(defaults);
    if (ok) {
      setLogos(defaults);
      showToast("ok", "Reset to 13 default logos");
    }
    setResetting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2 flex items-center gap-3">
            <Users className="h-7 w-7 text-brass" strokeWidth={1.5} />
            Client Logos
          </h1>
          <p className="font-body text-sm text-sand">
            {logos.length} logo{logos.length === 1 ? "" : "s"} · shown in the
            homepage marquee and on the{" "}
            <a
              href="/clients"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass hover:underline"
            >
              /clients
            </a>{" "}
            page roster · managed via SiteContent key{" "}
            <code className="font-mono text-[11px] text-brass">client-logos</code>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving || resetting}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[13px] text-sand hover:bg-white/10 hover:text-ivory transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={() => setCreating(true)}
            disabled={saving}
            className="pill pill-brass px-5 py-2.5 text-[13px] flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add Logo
          </button>
        </div>
      </div>

      {/* Global saving indicator */}
      {saving && (
        <div className="mb-4 rounded-xl border border-brass/30 bg-brass/5 px-4 py-2.5 text-[12px] text-brass flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving changes to CMS…
        </div>
      )}

      {/* Logo grid */}
      {logos.length === 0 ? (
        <div className="glass-on-charcoal rounded-2xl p-12 text-center">
          <Users className="h-10 w-10 text-sand/40 mx-auto mb-4" />
          <p className="font-body text-sand mb-1">No client logos yet</p>
          <p className="font-mono text-[11px] text-sand/60 mb-5">
            Add logos one-by-one, or click &ldquo;Reset to defaults&rdquo; to
            load the 13 hardcoded hotel logos.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleReset}
              disabled={saving || resetting}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[13px] text-sand hover:bg-white/10 hover:text-ivory transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {resetting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Reset to defaults
            </button>
            <button
              onClick={() => setCreating(true)}
              className="pill pill-brass px-5 py-2.5 text-[13px] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Logo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {logos.map((logo, index) => {
            const isDeleting = deletingId === logo.id;
            return (
              <div
                key={logo.id}
                className="glass-on-charcoal rounded-2xl overflow-hidden border border-white/10 flex flex-col"
              >
                {/* Image preview */}
                <div className="aspect-[4/3] w-full bg-white/95 flex items-center justify-center overflow-hidden relative">
                  {logo.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  )}
                  {isDeleting && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-brass animate-spin" />
                    </div>
                  )}
                  {/* Order badge */}
                  <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-sand">
                    #{index + 1}
                  </div>
                </div>

                {/* Info + actions */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <p
                    className="font-display text-[15px] text-ivory leading-snug line-clamp-2 break-words"
                    title={logo.name}
                  >
                    {logo.name}
                  </p>
                  <p
                    className="font-mono text-[10px] text-sand/60 break-all line-clamp-1"
                    title={logo.logo}
                  >
                    {logo.logo}
                  </p>

                  <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-white/5">
                    {/* Move up */}
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || saving || isDeleting}
                      title="Move up"
                      aria-label={`Move ${logo.name} up`}
                      className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    {/* Move down */}
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === logos.length - 1 || saving || isDeleting}
                      title="Move down"
                      aria-label={`Move ${logo.name} down`}
                      className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditing(logo)}
                      disabled={saving || isDeleting}
                      title="Edit"
                      aria-label={`Edit ${logo.name}`}
                      className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(logo.id)}
                      disabled={saving || isDeleting}
                      title="Delete"
                      aria-label={`Delete ${logo.name}`}
                      className="p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors ml-auto disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor modal */}
      {(editing || creating) && (
        <LogoEditor
          logo={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={handleSave}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-lg px-5 py-3 shadow-2xl border"
          style={{
            backgroundColor: toast.kind === "ok" ? "#1a4d3a" : "#5c1d1d",
            borderColor: toast.kind === "ok" ? "#22c55e" : "#ef4444",
          }}
        >
          {toast.kind === "ok" ? (
            <Check className="h-5 w-5 text-green-400" strokeWidth={2.5} />
          ) : (
            <X className="h-5 w-5 text-red-400" strokeWidth={2.5} />
          )}
          <span className="text-sm text-white font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Logo editor modal — add/edit
   ───────────────────────────────────────────────────────────── */
function LogoEditor({
  logo,
  onClose,
  onSave,
  showToast,
}: {
  logo: ClientLogo | null;
  onClose: () => void;
  onSave: (logo: ClientLogo) => void;
  showToast: (kind: "ok" | "err", msg: string) => void;
}) {
  const [name, setName] = useState(logo?.name || "");
  const [logoUrl, setLogoUrl] = useState(logo?.logo || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none";
  const labelClass = "data-label mb-1.5 block text-[11px] text-sand";

  const canSave = name.trim().length > 0 && logoUrl.trim().length > 0;

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "model",
        `client-logo-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`
      );
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "Server error");
        showToast("err", `Upload failed (${res.status}): ${text.substring(0, 80)}`);
        setUploading(false);
        return;
      }
      const data = await res.json();
      if (data.ok && data.imageUrl) {
        setLogoUrl(data.imageUrl);
        showToast("ok", "Image uploaded — click Save to publish");
      } else {
        showToast("err", data.message || "Upload failed");
      }
    } catch {
      showToast("err", "Network error during upload");
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!canSave) return;
    setSubmitting(true);
    onSave({
      id: logo?.id || makeId(),
      name: name.trim(),
      logo: logoUrl.trim(),
    });
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-on-charcoal rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ivory">
            {logo ? "Edit Logo" : "New Logo"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sand hover:text-ivory"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Preview */}
          <div className="aspect-[4/3] w-full bg-white/95 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={name || "Logo preview"}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                  Logo preview
                </p>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Client Name *</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Radisson, Taj, Holiday Inn…"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className={labelClass}>Logo URL *</label>
            <input
              className={inputClass}
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="/images/client-logos/radisson.webp or /api/admin/upload/…"
            />
            <p className="font-mono text-[10px] text-sand/60 mt-1">
              Paste an existing image URL, or upload a new file below.
            </p>
          </div>

          {/* Upload */}
          <div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.currentTarget.value = "";
                }}
              />
              <span className="flex items-center justify-center gap-2 rounded-xl bg-brass/15 border border-brass/30 text-brass px-4 py-2.5 text-[13px] font-medium hover:bg-brass/25 transition-colors cursor-pointer">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Logo Image
                  </>
                )}
              </span>
            </label>
            <p className="font-mono text-[10px] text-sand/60 mt-1.5">
              PNG with transparent background works best. Max 8 MB.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave || uploading || submitting}
            className="pill pill-brass flex-1 py-3 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {logo ? "Save Changes" : "Create Logo"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/5 px-6 py-3 text-[13px] text-sand hover:bg-white/10 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
