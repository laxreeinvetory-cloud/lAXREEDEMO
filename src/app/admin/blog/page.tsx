"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, X } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string; // JSON string of body content sections
  image: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  published: boolean;
  createdAt: string;
  // SEO fields
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  faqJsonLd?: string;
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
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) {
        alert(`Delete failed: ${data.message || data.error || "Unknown error"}`);
        return;
      }
      fetchPosts();
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
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
                aria-label={post.published ? `Unpublish ${post.title}` : `Publish ${post.title}`}
              >
                {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setEditing(post)}
                className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors"
                title={`Edit ${post.title}`}
                aria-label={`Edit ${post.title}`}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title={`Delete ${post.title}`}
                aria-label={`Delete ${post.title}`}
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
    image: post?.image || "/images/blog/blog-1.webp",
    author: post?.author || "LaxRee Editorial Team",
    authorRole: post?.authorRole || "Hospitality Procurement Insights",
    date: post?.date || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    readTime: post?.readTime || "5 min",
    published: post?.published ?? true,
    // Body content — array of sections (heading + paragraphs)
    bodyContent: (() => {
      try {
        if (post?.content) {
          const parsed = JSON.parse(post.content);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
      return [{ heading: "", paragraphs: [""] }];
    })(),
    // SEO fields
    seoTitle: post?.seoTitle || "",
    metaDescription: post?.metaDescription || "",
    keywords: post?.keywords || "",
    canonicalUrl: post?.canonicalUrl || "",
    ogImage: post?.ogImage || "",
    faqJsonLd: post?.faqJsonLd || "",
  });

  // Body content helpers
  const addSection = () => setForm({ ...form, bodyContent: [...form.bodyContent, { heading: "", paragraphs: [""] }] });
  const removeSection = (idx: number) => setForm({ ...form, bodyContent: form.bodyContent.filter((_: unknown, i: number) => i !== idx) });
  const updateHeading = (idx: number, val: string) => setForm({ ...form, bodyContent: form.bodyContent.map((s: any, i: number) => i === idx ? { ...s, heading: val } : s) });
  const addParagraph = (idx: number) => setForm({ ...form, bodyContent: form.bodyContent.map((s: any, i: number) => i === idx ? { ...s, paragraphs: [...s.paragraphs, ""] } : s) });
  const removeParagraph = (secIdx: number, paraIdx: number) => setForm({ ...form, bodyContent: form.bodyContent.map((s: any, i: number) => i === secIdx ? { ...s, paragraphs: s.paragraphs.filter((_: unknown, j: number) => j !== paraIdx) } : s) });
  const updateParagraph = (secIdx: number, paraIdx: number, val: string) => setForm({ ...form, bodyContent: form.bodyContent.map((s: any, i: number) => i === secIdx ? { ...s, paragraphs: s.paragraphs.map((p: string, j: number) => j === paraIdx ? val : p) } : s) });

  const inputClass = "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-ivory placeholder:text-sand/30 focus:border-brass focus:bg-white/15 focus:outline-none transition-colors";
  const labelClass = "data-label mb-1.5 block text-[11px] text-sand font-medium";
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  const handleSave = () => {
    if (!form.title.trim()) { alert("Title is required"); return; }
    if (!form.slug.trim()) { alert("Slug is required"); return; }
    // Convert bodyContent to content JSON string for storage
    const { bodyContent, ...restForm } = form;
    onSave({
      ...restForm,
      content: JSON.stringify(bodyContent),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-charcoal border border-brass/20 rounded-[24px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#1a1815" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="font-display text-xl text-ivory">{post ? "Edit Post" : "New Blog Post"}</h2>
          <button onClick={onClose} className="text-sand hover:text-ivory transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 shrink-0">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-t-lg text-[13px] font-medium transition-colors ${activeTab === "content" ? "bg-white/10 text-brass border-b-2 border-brass" : "text-sand hover:text-ivory"}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-2 rounded-t-lg text-[13px] font-medium transition-colors ${activeTab === "seo" ? "bg-white/10 text-brass border-b-2 border-brass" : "text-sand hover:text-ivory"}`}
          >
            SEO Settings
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {activeTab === "content" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Title *</label>
                <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter post title" />
              </div>
              <div>
                <label className={labelClass}>Slug *</label>
                <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Procurement Guide" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Excerpt (summary for blog listing)</label>
                <textarea className={inputClass} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description shown on blog listing page..." />
              </div>

              {/* BODY CONTENT — Article sections with heading + paragraphs */}
              <div className="col-span-2 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass + " mb-0"}>Article Body Content</label>
                  <button type="button" onClick={addSection} className="inline-flex items-center gap-1 rounded-lg bg-brass/20 text-brass px-3 py-1 text-xs hover:bg-brass/30 border border-brass/30">
                    + Add Section
                  </button>
                </div>
                <p className="text-[10px] text-sand/50 mb-3">Write your article in sections. Each section has a heading (optional) and one or more paragraphs.</p>
                {form.bodyContent.map((section: any, secIdx: number) => (
                  <div key={secIdx} className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-brass uppercase tracking-wider">Section {secIdx + 1}</span>
                      {form.bodyContent.length > 1 && (
                        <button type="button" onClick={() => removeSection(secIdx)} className="text-red-400 hover:text-red-300 text-xs">Remove Section</button>
                      )}
                    </div>
                    <input
                      className={inputClass + " mb-2"}
                      value={section.heading || ""}
                      onChange={(e) => updateHeading(secIdx, e.target.value)}
                      placeholder="Section heading (optional)"
                    />
                    {section.paragraphs.map((para: string, paraIdx: number) => (
                      <div key={paraIdx} className="flex gap-2 mb-2">
                        <textarea
                          className={inputClass}
                          rows={3}
                          value={para}
                          onChange={(e) => updateParagraph(secIdx, paraIdx, e.target.value)}
                          placeholder={`Paragraph ${paraIdx + 1}...`}
                        />
                        {section.paragraphs.length > 1 && (
                          <button type="button" onClick={() => removeParagraph(secIdx, paraIdx)} className="text-red-400 hover:text-red-300 text-xs shrink-0 pt-2">✕</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addParagraph(secIdx)} className="text-[11px] text-brass hover:text-brass-light">+ Add Paragraph</button>
                  </div>
                ))}
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Cover Image URL</label>
                <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/blog/blog-1.webp" />
              </div>
              <div>
                <label className={labelClass}>Author Name</label>
                <input className={inputClass} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
              </div>
              <div>
                <label className={labelClass}>Author Role</label>
                <input className={inputClass} value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} placeholder="e.g. Head of Sales" />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Jan 2026" />
              </div>
              <div>
                <label className={labelClass}>Read Time</label>
                <input className={inputClass} value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="e.g. 5 min" />
              </div>
              <div className="col-span-2 flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-brass h-4 w-4" />
                  <span className="text-sm text-ivory">Published</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-brass/20 bg-brass/5 p-4">
                <p className="text-[12px] text-sand mb-4">Optimize this post for Google search, AI tools (ChatGPT, Gemini, Claude, Grok), and social media sharing.</p>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>SEO Title (50-60 chars recommended)</label>
                    <input className={inputClass} value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="SEO optimized title for search engines" />
                    <p className="text-[10px] text-sand/50 mt-1">{form.seoTitle?.length || 0}/60 characters</p>
                  </div>
                  <div>
                    <label className={labelClass}>Meta Description (150-160 chars recommended)</label>
                    <textarea className={inputClass} rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Compelling description that appears in search results and AI summaries" />
                    <p className="text-[10px] text-sand/50 mt-1">{form.metaDescription?.length || 0}/160 characters</p>
                  </div>
                  <div>
                    <label className={labelClass}>Target Keywords (comma-separated)</label>
                    <input className={inputClass} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="hotel minibar supplier, hospitality amenities India, OEM manufacturer" />
                    <p className="text-[10px] text-sand/50 mt-1">These help AI tools understand the topic context</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Canonical URL (optional)</label>
                      <input className={inputClass} value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} placeholder="https://laxree.com/blog/your-post" />
                    </div>
                    <div>
                      <label className={labelClass}>OG Image URL (optional)</label>
                      <input className={inputClass} value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="/images/blog/custom-og.jpg" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>FAQ Schema (JSON-LD) — for Rich Results</label>
                    <textarea className={inputClass} rows={5} value={form.faqJsonLd} onChange={(e) => setForm({ ...form, faqJsonLd: e.target.value })} placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "Your question here?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "Your answer here"\n    }\n  }]\n}'} />
                    <p className="text-[10px] text-sand/50 mt-1">Add FAQ schema to get rich snippets in Google and AI answers</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/10 shrink-0">
          <button onClick={handleSave} className="pill pill-brass flex-1 py-3 text-[13px]">Save Post</button>
          <button onClick={onClose} className="rounded-full bg-white/5 px-6 py-3 text-[13px] text-sand hover:bg-white/10 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}
