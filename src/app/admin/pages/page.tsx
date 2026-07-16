"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  Save,
  RotateCcw,
  Check,
  X,
  Briefcase,
  Handshake,
  BookOpen,
  Phone,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */
type PageContent = Record<string, string>;

type FieldDef = {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  placeholder?: string;
};

type GroupDef = {
  title: string;
  subtitle?: string;
  fields: FieldDef[];
};

type PageDef = {
  slug: string;
  label: string;
  icon: typeof FileText;
  storageKey: string;
  defaults: PageContent;
  groups: GroupDef[];
};

type SettingsResponse = {
  ok: boolean;
  settings?: Record<string, unknown>;
  message?: string;
};

/* ─────────────────────────────────────────────────────────────
   Default content for each page — mirrors the live public pages.
   Used both as the initial form values and the "Reset to defaults"
   target. The /api/admin/settings route upserts these under their
   respective `page:<slug>` keys in the SiteContent table.
   ───────────────────────────────────────────────────────────── */
const CAREER_DEFAULTS: PageContent = {
  heroEyebrow: "Career",
  heroTitle: "Build Your Career in Hospitality Procurement",
  heroSubtitle:
    "Join LaxRee Amenities — where craftsmanship meets scale. We're always looking for passionate people across sales, operations, design, and manufacturing.",
  positionsSectionTitle: "Open Positions",
  positionsSectionSubtitle:
    "Explore current openings across our Ajmer headquarters and regional offices.",
  whyJoinTitle: "Why Join LaxRee?",
  whyJoinSubtitle:
    "Be part of a team that's redefining hospitality supplies across India.",
  ctaTitle: "Don't see the right role?",
  ctaSubtitle:
    "Send us your resume anyway. We're always looking for exceptional talent.",
  ctaButtonText: "Send Your Resume",
};

const DEALERS_DEFAULTS: PageContent = {
  heroEyebrow: "Dealers",
  heroTitle: "Become a LaxRee Dealer Partner",
  heroSubtitle:
    "Partner with India's leading hospitality procurement brand. Grow your business with our 700+ SKU catalogue, marketing support, and nationwide network.",
  benefitsTitle: "Why Partner With Us?",
  benefitsSubtitle:
    "Unlock growth with a trusted brand that's been serving 1,347+ properties for 11+ years.",
  requirementsTitle: "Requirements",
  requirementsSubtitle: "What we look for in our dealer partners.",
  ctaTitle: "Ready to Grow Your Business?",
  ctaSubtitle:
    "Fill out the application form and our sales team will get back to you within 48 hours.",
  ctaButtonText: "Apply Now",
};

const CATALOGUE_DEFAULTS: PageContent = {
  heroEyebrow: "Catalogue",
  heroTitle: "Download Catalogues by Category",
  heroSubtitle:
    "Get instant access to our complete product range. No email required for available catalogues.",
  featuredTitle: "Master Catalogue",
  featuredSubtitle:
    "The complete LaxRee Amenities product range — all 700+ SKUs across all 5 categories in one PDF.",
  categoriesTitle: "Download by Category",
  categoriesSubtitle:
    "Pick the category you need. Some catalogues are available now; others are coming soon.",
  benefitsTitle: "What's Inside",
  benefitsSubtitle:
    "Every catalogue includes detailed specifications, images, and pricing guidance.",
  discountTitle: "Get 10% Off Your First Order",
  discountSubtitle:
    "Share your details and we'll send you a discount code via WhatsApp.",
  ctaTitle: "Need a Printed Catalogue?",
  ctaSubtitle:
    "We'll courier a physical copy to your hotel or office anywhere in India.",
  ctaButtonText: "Request Printed Copy",
};

const CONTACT_DEFAULTS: PageContent = {
  heroEyebrow: "Contact Us",
  heroTitle: "Get in Touch",
  heroSubtitle:
    "Have a question about products, pricing, or partnerships? We're here to help.",
  formSectionTitle: "Send Us a Message",
  formSectionSubtitle:
    "Fill out the form below and our team will reach out within 24 hours.",
  infoSectionTitle: "Contact Information",
  infoSectionSubtitle:
    "Reach us directly via phone, email, or visit our showroom.",
  addressLabel: "Visit Our Showroom",
  phoneLabel: "Call Us",
  emailLabel: "Email Us",
  hoursLabel: "Business Hours",
  ctaTitle: "Prefer to Talk?",
  ctaSubtitle:
    "Call us directly or send a WhatsApp message for immediate assistance.",
};

/* ─────────────────────────────────────────────────────────────
   Page configuration — drives the tab UI, field rendering and
   the dirty/save logic. Adding a new editable page is a matter
   of pushing another entry here.
   ───────────────────────────────────────────────────────────── */
const PAGES: PageDef[] = [
  {
    slug: "career",
    label: "Career",
    icon: Briefcase,
    storageKey: "page:career",
    defaults: CAREER_DEFAULTS,
    groups: [
      {
        title: "Hero Section",
        subtitle: "Top banner shown when the page loads.",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", placeholder: "Career" },
          { key: "heroTitle", label: "Title" },
          { key: "heroSubtitle", label: "Subtitle", multiline: true },
        ],
      },
      {
        title: "Open Positions Section",
        fields: [
          { key: "positionsSectionTitle", label: "Section Title" },
          {
            key: "positionsSectionSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Why Join Section",
        fields: [
          { key: "whyJoinTitle", label: "Section Title" },
          { key: "whyJoinSubtitle", label: "Section Subtitle", multiline: true },
        ],
      },
      {
        title: "Call-to-Action",
        fields: [
          { key: "ctaTitle", label: "Title" },
          { key: "ctaSubtitle", label: "Subtitle", multiline: true },
          { key: "ctaButtonText", label: "Button Text" },
        ],
      },
    ],
  },
  {
    slug: "dealers",
    label: "Dealers",
    icon: Handshake,
    storageKey: "page:dealers",
    defaults: DEALERS_DEFAULTS,
    groups: [
      {
        title: "Hero Section",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", placeholder: "Dealers" },
          { key: "heroTitle", label: "Title" },
          { key: "heroSubtitle", label: "Subtitle", multiline: true },
        ],
      },
      {
        title: "Benefits Section",
        fields: [
          { key: "benefitsTitle", label: "Section Title" },
          {
            key: "benefitsSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Requirements Section",
        fields: [
          { key: "requirementsTitle", label: "Section Title" },
          {
            key: "requirementsSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Call-to-Action",
        fields: [
          { key: "ctaTitle", label: "Title" },
          { key: "ctaSubtitle", label: "Subtitle", multiline: true },
          { key: "ctaButtonText", label: "Button Text" },
        ],
      },
    ],
  },
  {
    slug: "catalogue",
    label: "Catalogue",
    icon: BookOpen,
    storageKey: "page:catalogue",
    defaults: CATALOGUE_DEFAULTS,
    groups: [
      {
        title: "Hero Section",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", placeholder: "Catalogue" },
          { key: "heroTitle", label: "Title" },
          { key: "heroSubtitle", label: "Subtitle", multiline: true },
        ],
      },
      {
        title: "Featured / Master Catalogue",
        fields: [
          { key: "featuredTitle", label: "Section Title" },
          {
            key: "featuredSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Categories Section",
        fields: [
          { key: "categoriesTitle", label: "Section Title" },
          {
            key: "categoriesSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Benefits Section",
        fields: [
          { key: "benefitsTitle", label: "Section Title" },
          {
            key: "benefitsSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Discount Offer",
        fields: [
          { key: "discountTitle", label: "Title" },
          { key: "discountSubtitle", label: "Subtitle", multiline: true },
        ],
      },
      {
        title: "Call-to-Action",
        fields: [
          { key: "ctaTitle", label: "Title" },
          { key: "ctaSubtitle", label: "Subtitle", multiline: true },
          { key: "ctaButtonText", label: "Button Text" },
        ],
      },
    ],
  },
  {
    slug: "contact-us",
    label: "Contact Us",
    icon: Phone,
    storageKey: "page:contact-us",
    defaults: CONTACT_DEFAULTS,
    groups: [
      {
        title: "Hero Section",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow", placeholder: "Contact Us" },
          { key: "heroTitle", label: "Title" },
          { key: "heroSubtitle", label: "Subtitle", multiline: true },
        ],
      },
      {
        title: "Form Section",
        fields: [
          { key: "formSectionTitle", label: "Section Title" },
          {
            key: "formSectionSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
        ],
      },
      {
        title: "Info Section",
        fields: [
          { key: "infoSectionTitle", label: "Section Title" },
          {
            key: "infoSectionSubtitle",
            label: "Section Subtitle",
            multiline: true,
          },
          { key: "addressLabel", label: "Address Label" },
          { key: "phoneLabel", label: "Phone Label" },
          { key: "emailLabel", label: "Email Label" },
          { key: "hoursLabel", label: "Hours Label" },
        ],
      },
      {
        title: "Call-to-Action",
        fields: [
          { key: "ctaTitle", label: "Title" },
          { key: "ctaSubtitle", label: "Subtitle", multiline: true },
        ],
      },
    ],
  },
];

const PAGES_BY_SLUG: Record<string, PageDef> = Object.fromEntries(
  PAGES.map((p) => [p.slug, p]),
);

/* ─────────────────────────────────────────────────────────────
   Shared style tokens (kept in sync with /admin/seo)
   ───────────────────────────────────────────────────────────── */
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none transition-colors";
const labelClass =
  "block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5";
const btnPrimary =
  "rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
const btnSecondary =
  "rounded-full bg-white/5 text-ivory px-4 py-2.5 text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function AdminPagesPage() {
  const [activeSlug, setActiveSlug] = useState<string>(PAGES[0].slug);

  // Seed every page's form with its defaults so the UI is fully
  // populated even before the network round-trip resolves.
  const [contents, setContents] = useState<Record<string, PageContent>>(() =>
    Object.fromEntries(PAGES.map((p) => [p.slug, { ...p.defaults }])),
  );
  const [loaded, setLoaded] = useState<Record<string, PageContent>>(() =>
    Object.fromEntries(PAGES.map((p) => [p.slug, { ...p.defaults }])),
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    msg: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Load all settings once on mount and merge with defaults. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data: SettingsResponse = await res.json();
        if (cancelled) return;
        if (data.ok && data.settings) {
          const next: Record<string, PageContent> = {};
          const loadedSnapshot: Record<string, PageContent> = {};
          for (const def of PAGES) {
            const stored = data.settings[def.storageKey];
            const merged = mergeContent(def.defaults, stored);
            next[def.slug] = merged;
            loadedSnapshot[def.slug] = { ...merged };
          }
          setContents(next);
          setLoaded(loadedSnapshot);
        }
      } catch {
        /* leave defaults in place */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /* Per-page dirty flags + an aggregate "any page dirty" flag. */
  const dirtyByPage = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const def of PAGES) {
      map[def.slug] = !isEqual(contents[def.slug], loaded[def.slug]);
    }
    return map;
  }, [contents, loaded]);

  const activeDirty = dirtyByPage[activeSlug];

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  /* Update a single field on the active page. */
  const updateField = (key: string, value: string) => {
    setContents((prev) => ({
      ...prev,
      [activeSlug]: { ...prev[activeSlug], [key]: value },
    }));
  };

  /* Save only the currently active page's content. */
  const handleSave = async () => {
    const def = PAGES_BY_SLUG[activeSlug];
    if (!def) return;
    if (!activeDirty) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: def.storageKey,
          value: contents[activeSlug],
        }),
      });
      if (res.ok) {
        setLoaded((prev) => ({
          ...prev,
          [activeSlug]: { ...contents[activeSlug] },
        }));
        showToast("ok", `${def.label} page content saved.`);
      } else {
        showToast("err", "Failed to save — server returned an error.");
      }
    } catch {
      showToast("err", "Network error — please retry.");
    } finally {
      setSaving(false);
    }
  };

  /* Restore defaults for the currently active page (no save). */
  const handleReset = () => {
    const def = PAGES_BY_SLUG[activeSlug];
    if (!def) return;
    setContents((prev) => ({
      ...prev,
      [activeSlug]: { ...def.defaults },
    }));
    showToast("ok", `${def.label} defaults restored. Click Save to persist.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  const activeDef = PAGES_BY_SLUG[activeSlug];
  const ActiveIcon = activeDef.icon;

  return (
    <div className="relative max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2 flex items-center gap-3">
            <FileText className="h-7 w-7 text-brass" strokeWidth={1.5} />
            Page Content
          </h1>
          <p className="font-body text-sm text-sand">
            Edit text content on your Career, Dealers, Catalogue, and Contact
            Us pages.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeDirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className={btnSecondary}
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !activeDirty}
            className={btnPrimary}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" strokeWidth={1.75} />
                Save {activeDef.label}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Page selector — pill-style tab toggle */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PAGES.map((def) => {
          const Icon = def.icon;
          const isActive = def.slug === activeSlug;
          const isDirty = dirtyByPage[def.slug];
          return (
            <button
              key={def.slug}
              type="button"
              onClick={() => setActiveSlug(def.slug)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brass text-charcoal"
                  : "bg-white/5 text-sand hover:text-ivory"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {def.label}
              {isDirty && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-charcoal" : "bg-amber-400"
                  }`}
                  aria-label="Unsaved changes"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active page editor */}
      <div className="glass-on-charcoal rounded-2xl p-6 md:p-8">
        <header className="flex items-center gap-3 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
            <ActiveIcon className="h-5 w-5 text-brass" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="font-display text-xl text-ivory">
              {activeDef.label} Page
            </h2>
            <p className="font-body text-[12px] text-sand mt-0.5">
              Stored under key{" "}
              <code className="font-mono text-brass/80">
                {activeDef.storageKey}
              </code>{" "}
              in the SiteContent table.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          {activeDef.groups.map((group) => (
            <section key={group.title}>
              <div className="mb-4">
                <h3 className="font-display text-base text-ivory">
                  {group.title}
                </h3>
                {group.subtitle && (
                  <p className="font-body text-[12px] text-sand mt-0.5">
                    {group.subtitle}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.fields.map((field) => {
                  const value = contents[activeSlug][field.key] ?? "";
                  return (
                    <div
                      key={field.key}
                      className={field.multiline ? "sm:col-span-2" : ""}
                    >
                      <label className={labelClass}>{field.label}</label>
                      {field.multiline ? (
                        <textarea
                          className={inputClass + " resize-none"}
                          rows={3}
                          value={value}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          className={inputClass}
                          value={value}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      )}
                      {field.hint && (
                        <p className="font-body text-[10px] text-sand/60 mt-1">
                          {field.hint}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-2xl"
          style={{
            backgroundColor:
              toast.kind === "ok" ? "rgba(30,70,56,0.95)" : "rgba(127,29,29,0.95)",
            borderColor:
              toast.kind === "ok"
                ? "rgba(176,141,87,0.4)"
                : "rgba(248,113,113,0.4)",
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

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */
/**
 * Merge stored DB content with the page's defaults. Stored values
 * win for any key present; defaults fill in the rest so new fields
 * added later don't show as empty. Only string values are kept —
 * anything else (e.g. legacy numbers) is coerced to string.
 */
function mergeContent(
  defaults: PageContent,
  stored: unknown,
): PageContent {
  const merged: PageContent = { ...defaults };
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return merged;
  }
  const obj = stored as Record<string, unknown>;
  for (const key of Object.keys(merged)) {
    const val = obj[key];
    if (typeof val === "string") {
      merged[key] = val;
    } else if (val === null || val === undefined) {
      // keep default
    } else if (typeof val === "number" || typeof val === "boolean") {
      merged[key] = String(val);
    }
    // objects/arrays are ignored — these fields are plain strings.
  }
  return merged;
}
