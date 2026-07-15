"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, X } from "lucide-react";

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
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    if (data.ok) setPosts(data.posts);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const togglePublish = async (post: BlogPost) => {
    await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    fetchPosts();
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2">Blog Posts</h1>
          <p className="font-body text-sm text-sand">{posts.length} posts total</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="pill pill-brass px-5 py-2.5 text-[13px] flex items-center gap-2"
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
              className="h-16 w-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base text-ivory truncate">{post.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-[10px] text-brass uppercase tracking-wider">{post.category}</span>
                <span className="font-mono text-[10px] text-sand">{post.date}</span>
                <span className="font-mono text-[10px] text-sand">{post.readTime}</span>
              </div>
              <p className="font-body text-[12px] text-sand mt-1 truncate">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePublish(post)}
                className={`p-2 rounded-lg transition-colors ${post.published ? "text-emerald-400 hover:bg-emerald/10" : "text-sand hover:bg-white/5"}`}
                title={post.published ? "Unpublish" : "Publish"}
              >
                {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setEditing(post)}
                className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
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
          <button onClick={() => setCreating(true)} className="pill pill-brass px-6 py-3 text-[13px]">
            Create First Post
          </button>
        </div>
      )}

      {/* Editor modal */}
      {(editing || creating) && (
        <BlogEditor
          post={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={async (data) => {
            if (editing) {
              await fetch("/api/admin/blog", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editing.id, ...data }),
              });
            } else {
              await fetch("/api/admin/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
            }
            setEditing(null);
            setCreating(false);
            fetchPosts();
          }}
        />
      )}
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
  onSave: (data: Partial<BlogPost>) => void;
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

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none";
  const labelClass = "data-label mb-1.5 block text-[11px] text-sand";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-on-charcoal rounded-24px p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ivory">{post ? "Edit Post" : "New Blog Post"}</h2>
          <button onClick={onClose} className="text-sand hover:text-ivory"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-slug" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Excerpt</label>
            <textarea className={inputClass} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description..." />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input className={inputClass} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Author Role</label>
            <input className={inputClass} value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Read Time</label>
            <input className={inputClass} value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-brass h-4 w-4" />
              <span className="text-sm text-ivory">Published</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="pill pill-brass flex-1 py-3 text-[13px]">Save Post</button>
          <button onClick={onClose} className="rounded-full bg-white/5 px-6 py-3 text-[13px] text-sand hover:bg-white/10">Cancel</button>
        </div>
      </div>
    </div>
  );
}
