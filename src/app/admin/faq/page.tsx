"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  X,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast, AdminToaster } from "@/lib/admin/admin-toast";

/* ─────────────────────────────────────────────────────────────
   Types & constants
   ───────────────────────────────────────────────────────────── */
type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  published: boolean;
};

const CATEGORIES = [
  "Products",
  "Ordering",
  "Logistics",
  "Quality",
  "Partnership",
  "Services",
  "General",
] as const;

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/admin/faq", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.faqs)) setFaqs(data.faqs);
    } catch (err) {
      console.error("[ADMIN FAQ PAGE] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCat =
        categoryFilter === "All" || f.category === categoryFilter;
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [faqs, search, categoryFilter]);

  const togglePublish = async (item: FaqItem) => {
    const nextPublished = !item.published;
    // Optimistic update
    setFaqs((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, published: nextPublished } : f))
    );
    try {
      const res = await fetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, published: nextPublished }),
      });
      const data = await res.json();
      if (!data.ok) {
        // Roll back
        setFaqs((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, published: item.published } : f))
        );
        toast("error", data.message || "Failed to update FAQ.");
      } else {
        toast("success", nextPublished ? "FAQ published." : "FAQ hidden.");
      }
    } catch {
      setFaqs((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, published: item.published } : f))
      );
      toast("error", "Network error — could not update FAQ.");
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ item? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        toast("success", "FAQ deleted.");
      } else {
        toast("error", data.message || "Failed to delete FAQ.");
      }
    } catch {
      toast("error", "Network error — could not delete FAQ.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2">
            FAQ Management
          </h1>
          <p className="font-body text-sm text-sand">
            {faqs.length} FAQ item{faqs.length === 1 ? "" : "s"} · published and
            managed via SiteContent (`faq` key)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="pill pill-brass px-5 py-2.5 text-[13px] flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      {/* Filters */}
      <div className="glass-on-charcoal rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sand/50"
            size={16}
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none cursor-pointer"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-on-charcoal rounded-2xl p-12 text-center">
          <HelpCircle className="h-10 w-10 text-sand/40 mx-auto mb-4" />
          <p className="font-body text-sand mb-4">No FAQ items found</p>
          <button
            onClick={() => setCreating(true)}
            className="pill pill-brass px-6 py-3 text-[13px]"
          >
            Create First FAQ
          </button>
        </div>
      ) : (
        <div className="glass-on-charcoal rounded-2xl overflow-hidden">
          {/* Table head */}
          <div className="hidden md:grid grid-cols-[1fr_140px_110px_80px_120px] gap-4 px-5 py-3 border-b border-white/10">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand/70">
              Question
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand/70">
              Category
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand/70">
              Order
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand/70">
              Status
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-sand/70 text-right">
              Actions
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="md:grid md:grid-cols-[1fr_140px_110px_80px_120px] md:gap-4 px-5 py-4 flex flex-col gap-3 hover:bg-white/[0.02] transition-colors"
              >
                {/* Question */}
                <div className="min-w-0">
                  <p className="font-display text-ivory text-[15px] leading-snug line-clamp-2">
                    {item.question}
                  </p>
                  <p className="font-body text-[12px] text-sand mt-1 line-clamp-1 md:max-w-none max-w-full">
                    {item.answer}
                  </p>
                </div>

                {/* Category */}
                <div className="flex md:items-center">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal bg-brass px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Sort order */}
                <div className="flex md:items-center">
                  <span className="font-mono text-[12px] text-sand">
                    #{item.sortOrder}
                  </span>
                </div>

                {/* Published */}
                <div className="flex md:items-center">
                  <button
                    type="button"
                    onClick={() => togglePublish(item)}
                    title={item.published ? "Published — click to unpublish" : "Hidden — click to publish"}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                      item.published
                        ? "text-emerald-400 bg-emerald/10 hover:bg-emerald/20"
                        : "text-sand bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {item.published ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {item.published ? "Live" : "Hidden"}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex md:items-center md:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors"
                    aria-label={`Edit ${item.question}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFaq(item.id)}
                    className="p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    aria-label={`Delete ${item.question}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor modal */}
      {(editing || creating) && (
        <FaqEditor
          item={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={async (data) => {
            try {
              if (editing) {
                const res = await fetch("/api/admin/faq", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: editing.id, ...data }),
                });
                const json = await res.json();
                if (!json.ok) {
                  toast("error", json.message || "Failed to save changes.");
                  return;
                }
                toast("success", "FAQ updated.");
              } else {
                const res = await fetch("/api/admin/faq", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const json = await res.json();
                if (!json.ok) {
                  toast("error", json.message || "Failed to create FAQ.");
                  return;
                }
                toast("success", "FAQ created.");
              }
              setEditing(null);
              setCreating(false);
              fetchFaqs();
            } catch {
              toast("error", "Network error — could not save FAQ.");
            }
          }}
        />
      )}

      <AdminToaster />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ editor modal — add/edit
   ───────────────────────────────────────────────────────────── */
function FaqEditor({
  item,
  onClose,
  onSave,
}: {
  item: FaqItem | null;
  onClose: () => void;
  onSave: (data: Partial<FaqItem>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    question: item?.question || "",
    answer: item?.answer || "",
    category: item?.category || "Products",
    sortOrder: item?.sortOrder ?? 0,
    published: item?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none";
  const labelClass = "data-label mb-1.5 block text-[11px] text-sand";

  const canSave =
    form.question.trim().length > 0 && form.answer.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSave) {
      setError("Question and Answer are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch {
      setError("Could not save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-charcoal border border-white/10 rounded-[24px] w-full max-w-2xl my-4 sm:my-8 max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="font-display text-xl text-ivory truncate">
            {item ? "Edit FAQ" : "New FAQ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

        <div className="grid grid-cols-2 gap-4">
          {/* Question */}
          <div className="col-span-2">
            <label className={labelClass}>Question *</label>
            <input
              className={inputClass}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="e.g. What is the MOQ for minibars?"
            />
          </div>

          {/* Answer */}
          <div className="col-span-2">
            <label className={labelClass}>Answer *</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={5}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Write a clear, concise answer that will appear publicly on /faq…"
            />
            <p className="font-mono text-[10px] text-sand/60 mt-1">
              {form.answer.length} characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order */}
          <div>
            <label className={labelClass}>Sort Order</label>
            <input
              type="number"
              className={inputClass}
              value={form.sortOrder}
              onChange={(e) =>
                setForm({
                  ...form,
                  sortOrder: Number.isFinite(Number(e.target.value))
                    ? Number(e.target.value)
                    : 0,
                })
              }
              placeholder="0"
            />
            <p className="font-mono text-[10px] text-sand/60 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Published toggle */}
          <div className="col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                className="accent-brass h-4 w-4"
              />
              <span className="text-sm text-ivory">
                Published (visible on /faq)
              </span>
            </label>
          </div>
        </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/10 shrink-0 bg-charcoal/95 backdrop-blur-xl rounded-b-[24px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave || saving}
            className="pill pill-brass flex-1 py-3 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>{item ? "Save Changes" : "Create FAQ"}</>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full bg-white/5 px-6 py-3 text-[13px] text-sand hover:bg-white/10 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
