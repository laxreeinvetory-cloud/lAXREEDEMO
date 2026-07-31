"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  Upload,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  Save,
} from "lucide-react";

const inputClass = "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";
const btnPrimary = "rounded-lg bg-yellow-600 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40 cursor-pointer";

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  fallback?: string;
};

type SectionDef = {
  name: string;
  fields: FieldDef[];
};

type PageDef = {
  slug: string;
  label: string;
  url: string;
  cmsKey: string;
  sections: SectionDef[];
};

const PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    url: "/",
    cmsKey: "homepage:hero",
    sections: [
      {
        name: "Hero Image",
        fields: [
          { key: "heroImage", label: "Homepage Hero Image", type: "image", fallback: "/images/products/mini-bar.webp" },
        ],
      },
    ],
  },
  {
    slug: "about-us",
    label: "About Us",
    url: "/about-us",
    cmsKey: "page:about-us",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text", fallback: "Who We Are" },
          { key: "heroTitle", label: "Title", type: "text", fallback: "Eleven Years of Opening Doors" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        name: "Page Images",
        fields: [
          { key: "factoryImage", label: "Factory Image", type: "image", fallback: "/images/about/factory.webp" },
          { key: "heroImage", label: "Second Image", type: "image", fallback: "/images/products/mini-bar.webp" },
        ],
      },
    ],
  },
  {
    slug: "products",
    label: "Products",
    url: "/products",
    cmsKey: "page:products",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text", fallback: "WHAT WE SUPPLY" },
          { key: "heroTitle", label: "Title", type: "text", fallback: "700+ SKUs. Eight Categories. One Standard." },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "clients",
    label: "Clients",
    url: "/clients",
    cmsKey: "page:clients",
    sections: [
      {
        name: "Hero Text & Image",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
          { key: "heroImage", label: "Hero Image", type: "image" },
        ],
      },
    ],
  },
  {
    slug: "catalogue",
    label: "Catalogue",
    url: "/catalogue",
    cmsKey: "page:catalogue",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "dealers",
    label: "Dealers",
    url: "/dealers",
    cmsKey: "page:dealers",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "experience-center",
    label: "Experience Center",
    url: "/experience-center",
    cmsKey: "page:experience-center",
    sections: [
      {
        name: "Hero Text & Image",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
          { key: "heroImage", label: "Hero Image", type: "image" },
        ],
      },
      {
        name: "Video",
        fields: [
          { key: "demoVideoUrl", label: "Demo Video URL", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "contact-us",
    label: "Contact Us",
    url: "/contact-us",
    cmsKey: "page:contact-us",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "career",
    label: "Career",
    url: "/career",
    cmsKey: "page:career",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "blog",
    label: "Blog",
    url: "/blog",
    cmsKey: "page:blog",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "faq",
    label: "FAQ",
    url: "/faq",
    cmsKey: "page:faq",
    sections: [
      {
        name: "Hero Text",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", type: "text" },
          { key: "heroTitle", label: "Title", type: "text" },
          { key: "heroSubtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },
];

export default function TrackPagesPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [cmsData, setCmsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedPage = PAGES.find((p) => p.slug === selectedSlug);

  useEffect(() => {
    fetch("/api/admin/cms", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.content) setCmsData(data.content);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const getValue = (page: PageDef, field: FieldDef): string => {
    const section = cmsData[page.cmsKey];
    if (!section) return field.fallback || "";
    return section[field.key] || field.fallback || "";
  };

  const setValue = (page: PageDef, field: FieldDef, value: string) => {
    const current = cmsData[page.cmsKey] || {};
    setCmsData({ ...cmsData, [page.cmsKey]: { ...current, [field.key]: value } });
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const value = cmsData[selectedPage.cmsKey] || {};
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: selectedPage.cmsKey, value }),
      });
      const data = await res.json();
      if (data.ok) showToast("ok", `${selectedPage.label} saved — live on website!`);
      else showToast("err", "Failed to save");
    } catch { showToast("err", "Network error"); }
    setSaving(false);
  };

  const handleUpload = async (page: PageDef, field: FieldDef, file: File) => {
    const fid = `${page.slug}-${field.key}`;
    setUploadingField(fid);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", `${page.slug}-${field.key}`);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) { showToast("err", "Upload failed"); setUploadingField(null); return; }
      const data = await res.json();
      if (data.ok) { setValue(page, field, data.imageUrl); showToast("ok", "Image uploaded! Click Save to publish."); }
      else showToast("err", data.message || "Upload failed");
    } catch { showToast("err", "Network error"); }
    setUploadingField(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-600/30 border-t-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Track Pages</h1>
        <p className="text-sm text-gray-400">Select a page → edit text & images → Save. Changes go live instantly.</p>
      </div>

      {/* Dropdown page selector */}
      <div className="mb-6 relative max-w-md">
        <label className={labelClass}>Select Page</label>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white hover:bg-white/15 cursor-pointer"
        >
          <span>{selectedPage ? selectedPage.label : "Choose a page..."}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/15 bg-charcoal shadow-2xl overflow-hidden">
            {PAGES.map((page) => (
              <button
                key={page.slug}
                onClick={() => { setSelectedSlug(page.slug); setDropdownOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  selectedSlug === page.slug ? "bg-yellow-600/20 text-yellow-500" : "text-white hover:bg-white/10"
                }`}
              >
                <span>{page.label}</span>
                <ExternalLink className="h-3 w-3 text-gray-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected page editor */}
      {selectedPage ? (
        <div className="max-w-3xl">
          <a href={`https://l-axreedemo.vercel.app${selectedPage.url}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 mb-6">
            <ExternalLink className="h-4 w-4" /> View {selectedPage.label} page →
          </a>

          {selectedPage.sections.map((section, si) => (
            <div key={si} className="mb-6 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-yellow-500 mb-4">{section.name}</h3>
              <div className="space-y-4">
                {section.fields.map((field) => {
                  const value = getValue(selectedPage, field);
                  const fid = `${selectedPage.slug}-${field.key}`;
                  const isUploading = uploadingField === fid;
                  return (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      {field.type === "image" ? (
                        <div className="space-y-2">
                          <div className="h-32 w-full max-w-xs rounded-lg border border-white/10 bg-gray-900 overflow-hidden flex items-center justify-center">
                            {value ? (
                              <img src={value} alt={field.label} className="h-full w-full object-contain" />
                            ) : (
                              <ImageIcon className="h-8 w-8 text-gray-700" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="text" value={value} onChange={(e) => setValue(selectedPage, field, e.target.value)}
                              placeholder={field.fallback || "Upload or paste URL"} className={inputClass + " flex-1"} />
                            <label className="shrink-0 cursor-pointer">
                              <input type="file" accept="image/*" className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(selectedPage, field, f); }} />
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 text-white px-3 py-2 text-xs hover:bg-white/20 border border-white/15">
                                {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                                {isUploading ? "..." : "Upload"}
                              </span>
                            </label>
                          </div>
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea value={value} onChange={(e) => setValue(selectedPage, field, e.target.value)}
                          placeholder={field.fallback || ""} rows={3} className={inputClass + " resize-none"} />
                      ) : (
                        <input type="text" value={value} onChange={(e) => setValue(selectedPage, field, e.target.value)}
                          placeholder={field.fallback || ""} className={inputClass} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button onClick={handleSave} disabled={saving} className={btnPrimary + " mb-8"}>
            {saving ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span>
                    : <span className="inline-flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</span>}
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">Select a page above to edit its content.</p>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-lg px-5 py-3 shadow-2xl border"
          style={{ backgroundColor: toast.kind === "ok" ? "#1a4d3a" : "#5c1d1d", borderColor: toast.kind === "ok" ? "#22c55e" : "#ef4444" }}>
          {toast.kind === "ok" ? <Check className="h-5 w-5 text-green-400" strokeWidth={2.5} /> : <X className="h-5 w-5 text-red-400" strokeWidth={2.5} />}
          <span className="text-sm text-white font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
