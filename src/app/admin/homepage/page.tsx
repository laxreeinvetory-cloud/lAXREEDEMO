"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  Plus,
  X,
  Image as ImageIcon,
  Check,
  Type,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type StatItem = { value: string; suffix: string; label: string };
type SimpleStat = { value: string; label: string };

type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    stats: StatItem[];
  };
  trustMarquee: { items: string[] };
  categoryBento: { eyebrow: string; title: string; subtitle: string };
  aboutUs: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    stats: SimpleStat[];
  };
  ownerMessage: {
    eyebrow: string;
    title: string;
    body: string;
    ownerName: string;
    ownerTitle: string;
    image: string;
  };
  productSpotlight: { eyebrow: string; title: string; subtitle: string };
  categoryExplorer: { eyebrow: string; title: string; subtitle: string };
  clientsTestimonials: { eyebrow: string; title: string; subtitle: string };
  ourPresence: { eyebrow: string; title: string; subtitle: string };
  certifications: { eyebrow: string; title: string; subtitle: string };
  whyChoose: { eyebrow: string; title: string; subtitle: string };
  hospitalityTrends: { eyebrow: string; title: string; subtitle: string };
  leadCta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

const DEFAULTS: HomepageContent = {
  hero: {
    eyebrow: "Hotel Supplies Redefined",
    title: "LaxRee Amenities",
    subtitle:
      "India's most comprehensive hospitality procurement partner — from minibars to roofing systems, delivered to 1,347+ properties.",
    primaryCta: "Request Quotation",
    secondaryCta: "Download Catalogue",
    stats: [
      { value: "1347", suffix: "+", label: "Projects" },
      { value: "11", suffix: "+", label: "Years" },
      { value: "700", suffix: "+", label: "SKUs" },
      { value: "7", suffix: "+", label: "Certifications" },
    ],
  },
  trustMarquee: {
    items: [
      "ISO 9001 Certified",
      "ISO 14001 Certified",
      "ISO 45001 Certified",
      "CE Certified",
      "RoHS Compliant",
      "Pan-India Delivery",
      "700+ Product SKUs",
    ],
  },
  categoryBento: {
    eyebrow: "Five Categories. One Standard.",
    title: "Everything your property needs, under one roof.",
    subtitle:
      "From room amenities to roofing systems — LaxRee is India's only single-source hospitality procurement partner.",
  },
  aboutUs: {
    eyebrow: "About LaxRee",
    title: "11 years of hospitality craftsmanship, now available pan-India.",
    body:
      "Founded in Ajmer, Rajasthan, LaxRee Amenities has grown from a regional minibar supplier into India's most comprehensive hospitality procurement partner. Today, we manufacture and supply 700+ SKUs across five core categories, serving 1,347+ properties nationwide.",
    image: "/images/about/factory.jpg",
    stats: [
      { value: "1347+", label: "Projects Delivered" },
      { value: "11+", label: "Years in Business" },
      { value: "700+", label: "Product SKUs" },
    ],
  },
  ownerMessage: {
    eyebrow: "From the Founder's Desk",
    title: "Hospitality is not an industry — it's a responsibility.",
    body:
      "Every product we make carries the weight of a guest's experience. A minibar that's too loud at 2 AM. A safe that won't open at checkout. A door lock that sticks when it rains. These aren't product failures — they're hospitality failures. That's why we engineer every LaxRee product to perform flawlessly, night after night, year after year.",
    ownerName: "Founder Name",
    ownerTitle: "Founder & Managing Director, LaxRee Amenities",
    image: "/images/about/owner.jpg",
  },
  productSpotlight: {
    eyebrow: "Product Spotlight",
    title: "Nine products that define a premium room.",
    subtitle:
      "Hand-picked from our 700+ SKU catalogue — the items that most consistently elevate guest perception.",
  },
  categoryExplorer: {
    eyebrow: "Deep Dive",
    title: "Every category, engineered for scale.",
    subtitle:
      "Click through to see the full product range, specifications, and pricing for each category.",
  },
  clientsTestimonials: {
    eyebrow: "Trusted by 1,347+ Properties",
    title: "From boutique resorts to 500-room business hotels.",
    subtitle: "Our clients span every segment of Indian hospitality. Here's what they say.",
  },
  ourPresence: {
    eyebrow: "Our Presence",
    title: "From Ajmer to all of India.",
    subtitle:
      "Our exhibition centre in Ajmer is India's largest hospitality supplies showroom. Visit us to experience the full LaxRee range in person.",
  },
  certifications: {
    eyebrow: "Certified Quality",
    title: "Seven certifications. Zero compromises.",
    subtitle: "Every product is tested and certified to international hospitality standards.",
  },
  whyChoose: {
    eyebrow: "Why LaxRee",
    title: "Seven reasons hospitality procurement teams choose LaxRee.",
    subtitle: "We're not just a supplier — we're your procurement partner.",
  },
  hospitalityTrends: {
    eyebrow: "Hospitality Trends",
    title: "Insights from the LaxRee editorial team.",
    subtitle:
      "Procurement guides, design trends, and industry analysis for hospitality professionals.",
  },
  leadCta: {
    eyebrow: "Ready to Procure?",
    title: "Get a quotation within 24 hours.",
    subtitle:
      "Tell us about your project — quantities, timeline, property type. Our sales team will send a detailed rate list.",
    primaryCta: "Request Quotation",
    secondaryCta: "Download Catalogue",
  },
};

const SECTIONS = [
  { key: "hero", label: "1. Hero Section", icon: Type },
  { key: "trustMarquee", label: "2. Trust Marquee", icon: Check },
  { key: "categoryBento", label: "3. Category Bento", icon: Type },
  { key: "aboutUs", label: "4. About Us", icon: Type },
  { key: "ownerMessage", label: "5. Owner's Message", icon: Type },
  { key: "productSpotlight", label: "6. Product Spotlight", icon: Type },
  { key: "categoryExplorer", label: "7. Category Explorer", icon: Type },
  { key: "clientsTestimonials", label: "8. Clients & Testimonials", icon: Type },
  { key: "ourPresence", label: "9. Our Presence", icon: Type },
  { key: "certifications", label: "10. Certifications", icon: Type },
  { key: "whyChoose", label: "11. Why Choose LaxRee", icon: Type },
  { key: "hospitalityTrends", label: "12. Hospitality Trends", icon: Type },
  { key: "leadCta", label: "13. Lead CTA", icon: Type },
] as const;

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none";
const labelClass = "block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5";
const textareaClass = inputClass + " resize-none";

// ─────────────────────────────────────────────────────────────
// Helper: deep clone
// ─────────────────────────────────────────────────────────────
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ─────────────────────────────────────────────────────────────
// Reusable field components
// ─────────────────────────────────────────────────────────────
function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={textareaClass}
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-sand/30" />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/path/to/image.jpg"
          className={inputClass}
        />
      </div>
    </div>
  );
}

function StatListEditor({
  stats,
  onChange,
  hasSuffix = true,
}: {
  stats: StatItem[] | SimpleStat[];
  onChange: (stats: StatItem[] | SimpleStat[]) => void;
  hasSuffix?: boolean;
}) {
  const update = (i: number, key: string, val: string) => {
    const next = deepClone(stats);
    (next as Record<string, unknown>[])[i][key] = val;
    onChange(next);
  };
  const add = () => {
    if (hasSuffix) {
      onChange([...(stats as StatItem[]), { value: "0", suffix: "+", label: "New Stat" }]);
    } else {
      onChange([...(stats as SimpleStat[]), { value: "0", label: "New Stat" }]);
    }
  };
  const remove = (i: number) => {
    onChange(stats.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={labelClass + " mb-0"}>Stats</label>
        <button
          onClick={add}
          className="inline-flex items-center gap-1 rounded-full bg-white/5 text-ivory px-3 py-1 text-xs hover:bg-white/10 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Stat
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-white/5 p-2">
            <input
              type="text"
              value={stat.value}
              onChange={(e) => update(i, "value", e.target.value)}
              className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm text-ivory focus:border-brass focus:outline-none"
              placeholder="1347"
            />
            {hasSuffix && (
              <input
                type="text"
                value={(stat as StatItem).suffix || ""}
                onChange={(e) => update(i, "suffix", e.target.value)}
                className="w-16 bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm text-ivory focus:border-brass focus:outline-none text-center"
                placeholder="+"
              />
            )}
            <input
              type="text"
              value={stat.label}
              onChange={(e) => update(i, "label", e.target.value)}
              className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm text-ivory focus:border-brass focus:outline-none"
              placeholder="Projects"
            />
            <button
              onClick={() => remove(i)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sand/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
  label,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
}) {
  const [newItem, setNewItem] = useState("");
  const add = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full bg-brass/10 border border-brass/20 px-3 py-1.5 text-xs text-brass"
          >
            {item}
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add new item..."
          className={inputClass}
        />
        <button
          onClick={add}
          className="rounded-full bg-white/5 text-ivory px-4 py-2 text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section renderer
// ─────────────────────────────────────────────────────────────
function SectionEditor({
  sectionKey,
  content,
  onUpdate,
}: {
  sectionKey: keyof HomepageContent;
  content: HomepageContent;
  onUpdate: (section: keyof HomepageContent, data: unknown) => void;
}) {
  const section = content[sectionKey] as Record<string, unknown>;

  const set = (field: string, value: unknown) => {
    onUpdate(sectionKey, { ...section, [field]: value });
  };

  switch (sectionKey) {
    case "hero":
      return (
        <div className="space-y-3">
          <TextField label="Eyebrow" value={section.eyebrow as string} onChange={(v) => set("eyebrow", v)} />
          <TextField label="Title" value={section.title as string} onChange={(v) => set("title", v)} />
          <TextAreaField label="Subtitle" value={section.subtitle as string} onChange={(v) => set("subtitle", v)} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Primary Button" value={section.primaryCta as string} onChange={(v) => set("primaryCta", v)} />
            <TextField label="Secondary Button" value={section.secondaryCta as string} onChange={(v) => set("secondaryCta", v)} />
          </div>
          <StatListEditor stats={section.stats as StatItem[]} onChange={(s) => set("stats", s)} />
        </div>
      );

    case "trustMarquee":
      return <StringListEditor label="Marquee Items" items={section.items as string[]} onChange={(s) => set("items", s)} />;

    case "categoryBento":
    case "productSpotlight":
    case "categoryExplorer":
    case "clientsTestimonials":
    case "ourPresence":
    case "certifications":
    case "whyChoose":
    case "hospitalityTrends":
      return (
        <div className="space-y-3">
          <TextField label="Eyebrow" value={section.eyebrow as string} onChange={(v) => set("eyebrow", v)} />
          <TextField label="Title" value={section.title as string} onChange={(v) => set("title", v)} />
          <TextAreaField label="Subtitle" value={section.subtitle as string} onChange={(v) => set("subtitle", v)} />
        </div>
      );

    case "aboutUs":
      return (
        <div className="space-y-3">
          <TextField label="Eyebrow" value={section.eyebrow as string} onChange={(v) => set("eyebrow", v)} />
          <TextField label="Title" value={section.title as string} onChange={(v) => set("title", v)} />
          <TextAreaField label="Body Text" value={section.body as string} onChange={(v) => set("body", v)} rows={4} />
          <ImageField label="Image URL" value={section.image as string} onChange={(v) => set("image", v)} />
          <StatListEditor stats={section.stats as SimpleStat[]} onChange={(s) => set("stats", s)} hasSuffix={false} />
        </div>
      );

    case "ownerMessage":
      return (
        <div className="space-y-3">
          <TextField label="Eyebrow" value={section.eyebrow as string} onChange={(v) => set("eyebrow", v)} />
          <TextField label="Title" value={section.title as string} onChange={(v) => set("title", v)} />
          <TextAreaField label="Message Body" value={section.body as string} onChange={(v) => set("body", v)} rows={5} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Owner Name" value={section.ownerName as string} onChange={(v) => set("ownerName", v)} />
            <TextField label="Owner Title" value={section.ownerTitle as string} onChange={(v) => set("ownerTitle", v)} />
          </div>
          <ImageField label="Owner Photo URL" value={section.image as string} onChange={(v) => set("image", v)} />
        </div>
      );

    case "leadCta":
      return (
        <div className="space-y-3">
          <TextField label="Eyebrow" value={section.eyebrow as string} onChange={(v) => set("eyebrow", v)} />
          <TextField label="Title" value={section.title as string} onChange={(v) => set("title", v)} />
          <TextAreaField label="Subtitle" value={section.subtitle as string} onChange={(v) => set("subtitle", v)} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Primary Button" value={section.primaryCta as string} onChange={(v) => set("primaryCta", v)} />
            <TextField label="Secondary Button" value={section.secondaryCta as string} onChange={(v) => set("secondaryCta", v)} />
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent>(deepClone(DEFAULTS));
  const [loaded, setLoaded] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["hero"]));
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.settings?.["homepage:full"]) {
          const stored = data.settings["homepage:full"];
          // Merge with defaults so new fields appear
          const merged = deepClone(DEFAULTS);
          for (const key of Object.keys(merged)) {
            if (stored[key]) {
              merged[key] = { ...merged[key], ...stored[key] };
            }
          }
          setContent(merged);
          setLoaded(deepClone(merged));
        } else {
          setLoaded(deepClone(DEFAULTS));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dirty = useMemo(() => {
    if (!loaded) return false;
    return !isEqual(content, loaded);
  }, [content, loaded]);

  const showToast = useCallback((kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "homepage:full", value: content }),
      });
      if (res.ok) {
        setLoaded(deepClone(content));
        showToast("ok", "Homepage content saved successfully.");
      } else {
        showToast("err", "Failed to save. Please try again.");
      }
    } catch {
      showToast("err", "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContent(deepClone(DEFAULTS));
    showToast("ok", "Defaults restored. Click Save to persist.");
  };

  const updateSection = (section: keyof HomepageContent, data: unknown) => {
    setContent((prev) => ({ ...prev, [section]: data }));
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-24">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2">Homepage Content</h1>
          <p className="font-body text-sm text-sand">
            Edit every text field and image across all 13 homepage sections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-400">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 text-ivory px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Sections accordion */}
      <div className="flex flex-col gap-3">
        {SECTIONS.map((sec) => {
          const isOpen = openSections.has(sec.key);
          const Icon = sec.icon;
          return (
            <div key={sec.key} className="glass-on-charcoal rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection(sec.key)}
                className="flex items-center justify-between w-full p-4 text-ivory font-display text-sm hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-brass" />
                  {sec.label}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-sand" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-sand" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 pt-0">
                  <SectionEditor
                    sectionKey={sec.key}
                    content={content}
                    onUpdate={updateSection}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-charcoal/95 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-4xl flex items-center justify-between gap-4">
          <p className="font-body text-xs text-sand">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-full bg-brass text-charcoal px-6 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save All Changes
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-2xl"
          style={{
            backgroundColor: toast.kind === "ok" ? "rgba(30,70,56,0.95)" : "rgba(127,29,29,0.95)",
            borderColor: toast.kind === "ok" ? "rgba(176,141,87,0.4)" : "rgba(248,113,113,0.4)",
          }}
        >
          {toast.kind === "ok" ? (
            <Check className="h-4 w-4 text-brass" strokeWidth={2} />
          ) : (
            <X className="h-4 w-4 text-red-300" strokeWidth={2} />
          )}
          <span className="font-body text-sm text-ivory">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
