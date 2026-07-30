"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Check, X, Loader2, Image as ImageIcon, ExternalLink } from "lucide-react";

const inputClass = "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";
const btnPrimary = "rounded-lg bg-yellow-600 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40 cursor-pointer";

type ImageEntry = {
  key: string;
  label: string;
  section: string;
  cmsKey: string;
  field: string;
  fallback: string;
};

const EDITABLE_IMAGES: ImageEntry[] = [
  // Homepage
  { key: "hero", label: "Homepage Hero Image", section: "Homepage", cmsKey: "homepage:hero", field: "heroImage", fallback: "/images/products/mini-bar.jpg" },
  { key: "about", label: "About Us — Factory Image", section: "Homepage", cmsKey: "homepage", field: "aboutUs.image", fallback: "/images/about/factory.jpg" },
  { key: "owner", label: "Owner's Photo", section: "Homepage", cmsKey: "homepage", field: "ownerMessage.image", fallback: "/images/owner-cropped.jpg" },
  { key: "gallery1", label: "Our Presence — Gallery Image 1", section: "Homepage", cmsKey: "homepage", field: "ourPresence.image1", fallback: "/images/gallery/exhibition-1.jpg" },
  { key: "gallery2", label: "Our Presence — Gallery Image 2", section: "Homepage", cmsKey: "homepage", field: "ourPresence.image2", fallback: "/images/gallery/exhibition-2.jpg" },
  { key: "gallery3", label: "Our Presence — Gallery Image 3", section: "Homepage", cmsKey: "homepage", field: "ourPresence.image3", fallback: "/images/gallery/exhibition-3.jpg" },
  { key: "gallery4", label: "Our Presence — Gallery Image 4", section: "Homepage", cmsKey: "homepage", field: "ourPresence.image4", fallback: "/images/gallery/exhibition-4.jpg" },
  { key: "gallery5", label: "Our Presence — Gallery Image 5", section: "Homepage", cmsKey: "homepage", field: "ourPresence.image5", fallback: "/images/gallery/exhibition-5.jpg" },
  // Pages
  { key: "about-hero", label: "About Us Page — Hero Image", section: "Pages", cmsKey: "page:about-us", field: "heroImage", fallback: "" },
  { key: "about-factory", label: "About Us Page — Factory Image", section: "Pages", cmsKey: "page:about-us", field: "factoryImage", fallback: "/images/about/factory.jpg" },
  { key: "clients-hero", label: "Clients Page — Hero Image", section: "Pages", cmsKey: "page:clients", field: "heroImage", fallback: "" },
  { key: "exp-hero", label: "Experience Center — Hero Image", section: "Pages", cmsKey: "page:experience-center", field: "heroImage", fallback: "" },
];

export default function AdminImagesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    // Fetch all CMS content at once
    fetch("/api/admin/cms", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.content) {
          const vals: Record<string, string> = {};
          for (const img of EDITABLE_IMAGES) {
            const section = data.content[img.cmsKey];
            if (section) {
              // Navigate nested field (e.g., "aboutUs.image")
              const parts = img.field.split(".");
              let val: any = section;
              for (const p of parts) {
                val = val?.[p];
              }
              if (typeof val === "string" && val) vals[img.key] = val;
            }
          }
          setValues(vals);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = async (img: ImageEntry, file: File) => {
    setUploading(img.key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", img.key);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text().catch(() => "Server error");
        showToast("err", `Upload failed (${res.status}): ${text.substring(0, 80)}`);
        setUploading(null);
        return;
      }
      const data = await res.json();
      if (data.ok) {
        // Save to CMS immediately
        await saveToCMS(img, data.imageUrl);
        setValues({ ...values, [img.key]: data.imageUrl });
      } else {
        showToast("err", data.message || "Upload failed");
      }
    } catch {
      showToast("err", "Network error");
    }
    setUploading(null);
  };

  const saveToCMS = async (img: ImageEntry, imageUrl: string) => {
    setSaving(img.key);
    try {
      // Fetch current CMS value
      const getRes = await fetch(`/api/admin/cms?key=${img.cmsKey}`, { cache: "no-store" });
      const getData = await getRes.json();
      let current: any = getData.value || {};

      // Set nested field
      const parts = img.field.split(".");
      let obj = current;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = imageUrl;

      // Save back
      const putRes = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: img.cmsKey, value: current }),
      });
      const putData = await putRes.json();
      if (putData.ok) {
        showToast("ok", `${img.label} updated — live on website!`);
      } else {
        showToast("err", "Failed to save");
      }
    } catch {
      showToast("err", "Network error saving");
    }
    setSaving(null);
  };

  // Group by section
  const sections = [...new Set(EDITABLE_IMAGES.map((i) => i.section))];

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Image Manager</h1>
        <p className="text-sm text-gray-400">
          Change any image on the website. Upload a new image or paste a URL — changes go live instantly.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="text-lg font-semibold text-yellow-500 mb-4 pb-2 border-b border-white/10">
            {section} Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EDITABLE_IMAGES.filter((img) => img.section === section).map((img) => {
              const current = values[img.key] || img.fallback;
              const isUploading = uploading === img.key;
              const isSaving = saving === img.key;
              return (
                <div key={img.key} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  {/* Image preview */}
                  <div className="aspect-[4/3] w-full bg-gray-900 flex items-center justify-center overflow-hidden relative">
                    {current ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={current} alt={img.label} className="h-full w-full object-contain" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-gray-700" />
                    )}
                    {(isUploading || isSaving) && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-yellow-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm font-medium text-white mb-2">{img.label}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={values[img.key] || ""}
                        onChange={(e) => setValues({ ...values, [img.key]: e.target.value })}
                        placeholder={img.fallback || "No image set"}
                        className="flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveToCMS(img, values[img.key] || img.fallback)}
                        disabled={isSaving}
                        className="shrink-0 rounded-lg bg-white/10 text-white px-2 py-1.5 text-xs hover:bg-white/20 border border-white/15 disabled:opacity-40"
                      >
                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                      </button>
                    </div>
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(img, file);
                        }}
                      />
                      <span className="flex items-center justify-center gap-2 rounded-lg bg-yellow-600 text-black px-3 py-2 text-xs font-semibold hover:bg-yellow-500 transition-colors cursor-pointer disabled:opacity-40">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" />
                            Upload New Image
                          </>
                        )}
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

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
