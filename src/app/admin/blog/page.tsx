"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { toast, AdminToaster } from "@/lib/admin/admin-toast";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  published: boolean;
  createdAt: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setPosts(data.posts);
    } catch {
      toast("error", "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const togglePublish = async (post: BlogPost) => {
    const nextPublished = !post.published;
    // Optimistic update so the UI feels instant
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published: nextPublished } : p))
    );
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: nextPublished }),
      });
      const data = await res.json();
      if (!data.ok) {
        // Roll back on failure
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, published: post.published } : p))
        );
        toast("error", data.message || "Failed to update post.");
      } else {
        toast("success", nextPublished ? "Post published." : "Post unpublished.");
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: post.published } : p))
      );
      toast("error", "Network error — could not update post.");
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast("success", "Post deleted.");
      } else {
        toast("error", data.message || "Failed to delete post.");
      }
    } catch {
      toast("error", "Network error — could not delete post.");
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
    <div className="pb-24">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2">Blog Posts</h1>
          <p className="font-body text-sm text-sand">{posts.length} posts total</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="pill pill-brass px-5 py-2.5 text-[13px] flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {/* Posts list */}
      <div className="grid gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-on-charcoal rounded-2xl p-5 flex items-center gap-4"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-16 w-16 rounded-xl object-cover shrink-0 bg-white/5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.2";
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base text-ivory truncate">{post.title}</h3>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="font-mono text-[10px] text-brass uppercase tracking-wider">{post.category}</span>
                <span className="font-mono text-[10px] text-sand">{post.date}</span>
                <span className="font-mono text-[10px] text-sand">{post.readTime}</span>
              </div>
              <p className="font-body text-[12px] text-sand mt-1 truncate">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePublish(post)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${post.published ? "text-emerald-400 hover:bg-emerald/10" : "text-sand hover:bg-white/5"}`}
                title={post.published ? "Unpublish" : "Publish"}
              >
                {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setEditing(post)}
                className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors cursor-pointer"
                aria-label="Edit post"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="glass-on-charcoal rounded-2xl p-12 text-center">
          <p className="font-body text-sand mb-4">No blog posts yet</p>
          <button
            onClick={() => setCreating(true)}
            className="pill pill-brass px-6 py-3 text-[13px] cursor-pointer"
          >
            Create First Post
          </button>
        </div>
      )}

      {/* Editor modal */}
      {(editing || creating) && (
        <BlogEditor
          post={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={async (data) => {
            try {
              if (editing) {
                const res = await fetch("/api/admin/blog", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: editing.id, ...data }),
                });
                const json = await res.json();
                if (!json.ok) {
                  toast("error", json.message || "Failed to save changes.");
                  return;
                }
                toast("success", "Post updated successfully.");
              } else {
                const res = await fetch("/api/admin/blog", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const json = await res.json();
                if (!json.ok) {
                  toast("error", json.message || "Failed to create post.");
                  return;
                }
                toast("success", "Post created successfully.");
              }
              setEditing(null);
              setCreating(false);
              fetchPosts();
            } catch {
              toast("error", "Network error — could not save post.");
            }
          }}
        />
      )}

      <AdminToaster />
    </div>
  );
}

function BlogEditor({
  post,
  onClose,
  onSave,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSave: (data: Partial<BlogPost>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    slug: post?.slug || "",
    title: post?.title || "",
    category: post?.category || "Procurement Guide",
    excerpt: post?.excerpt || "",
    image: post?.image || "/images/blog/blog-1.jpg",
    author: post?.author || "LaxRee Editorial Team",
    authorRole: post?.authorRole || "Hospitality Procurement Insights",
    date: post?.date || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    readTime: post?.readTime || "5 min",
    published: post?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none transition-colors";
  const labelClass = "data-label mb-1.5 block text-[11px] text-sand";

  const canSave = form.title.trim().length > 0 && form.slug.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) {
      setError("Title and Slug are required.");
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
        {/* Sticky header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="font-display text-xl text-ivory truncate">
            {post ? "Edit Post" : "New Blog Post"}
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

        {/* Scrollable body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Post title"
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="post-slug"
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Excerpt</label>
              <textarea
                className={inputClass + " resize-none"}
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short description..."
              />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                className={inputClass}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Author</label>
              <input
                className={inputClass}
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Author Role</label>
              <input
                className={inputClass}
                value={form.authorRole}
                onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                className={inputClass}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Read Time</label>
              <input
                className={inputClass}
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="accent-brass h-4 w-4"
                />
                <span className="text-sm text-ivory">Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/10 shrink-0 bg-charcoal/95 backdrop-blur-xl rounded-b-[24px]">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !canSave}
            className="pill pill-brass flex-1 py-3 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save Post"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full bg-white/5 px-6 py-3 text-[13px] text-sand hover:bg-white/10 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
