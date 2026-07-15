"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Globe,
  Phone,
  Mail,
  MapPin,
  Share2,
  Save,
  RotateCcw,
  Plus,
  X,
  Building2,
  Check,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types — mirror the DEFAULTS shape from /api/admin/settings
   ───────────────────────────────────────────────────────────── */
type PageSeo = { path: string; title: string; description: string };

type SeoSettings = {
  siteTitle: string;
  siteDescription: string;
  defaultKeywords: string[];
  ogImage: string;
  twitterHandle: string;
  robots: string;
  googleVerification: string;
  pages: PageSeo[];
};

type Socials = {
  facebook: string;
  x: string;
  youtube: string;
  linkedin: string;
};

type CompanySettings = {
  name: string;
  tagline: string;
  phoneDisplay: string;
  phoneHref: string;
  tollFreeDisplay: string;
  tollFreeHref: string;
  whatsapp: string;
  email: string;
  careersEmail: string;
  address: string;
  socials: Socials;
};

type SettingsResponse = {
  ok: boolean;
  settings?: {
    seo?: SeoSettings;
    company?: CompanySettings;
    [key: string]: unknown;
  };
  message?: string;
};

/* ─────────────────────────────────────────────────────────────
   Hard-coded defaults — must stay in sync with the API route's
   DEFAULTS so the "Reset to defaults" button works offline.
   ───────────────────────────────────────────────────────────── */
const SEO_DEFAULTS: SeoSettings = {
  siteTitle: "LaxRee Amenities — Hotel Supplies Redefined",
  siteDescription:
    "India's leading hospitality procurement partner. 700+ SKUs across minibars, furniture, linen, roofing & dome structures. Trusted by 1,347+ properties.",
  defaultKeywords: [
    "hotel supplies",
    "hospitality procurement",
    "hotel minibar",
    "hotel furniture",
    "hotel linen",
    "roofing solutions",
    "dome structures",
    "India hotel supplier",
  ],
  ogImage: "/images/og/default.jpg",
  twitterHandle: "@laxree",
  robots: "index, follow",
  googleVerification: "",
  pages: [
    {
      path: "/",
      title: "LaxRee Amenities — Hotel Supplies Redefined",
      description: "India's leading hospitality procurement partner with 700+ SKUs.",
    },
    {
      path: "/about-us",
      title: "About Us — LaxRee Amenities",
      description: "11+ years of hospitality procurement expertise.",
    },
    {
      path: "/products",
      title: "Products — LaxRee Amenities",
      description: "Browse 700+ hotel supply SKUs across 5 categories.",
    },
    {
      path: "/catalogue",
      title: "Catalogue — LaxRee Amenities",
      description: "Download our master and category catalogues.",
    },
    {
      path: "/contact-us",
      title: "Contact Us — LaxRee Amenities",
      description: "Get in touch for quotations and dealer opportunities.",
    },
  ],
};

const COMPANY_DEFAULTS: CompanySettings = {
  name: "LaxRee Amenities",
  tagline: "Hotel Supplies Redefined",
  phoneDisplay: "+91-92516 83662",
  phoneHref: "+919251683662",
  tollFreeDisplay: "1800 120 7001",
  tollFreeHref: "18001207001",
  whatsapp: "919251683662",
  email: "contactus@laxree.com",
  careersEmail: "hr@laxree.com",
  address:
    "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
  socials: {
    facebook: "https://facebook.com",
    x: "https://x.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
};

const ROBOTS_OPTIONS = [
  "index, follow",
  "noindex, nofollow",
  "index, nofollow",
  "noindex, follow",
];

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none transition-colors";
const labelClass = "data-label mb-1.5 block text-[11px] text-sand";
const btnPrimary =
  "rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnSecondary =
  "rounded-full bg-white/5 text-ivory px-5 py-2.5 text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const chipClass =
  "inline-flex items-center gap-2 rounded-full bg-brass/10 border border-brass/20 px-3 py-1.5 text-xs text-brass";

function charCounterClass(len: number) {
  if (len > 160) return "font-mono text-[10px] text-amber-400 ml-auto";
  if (len >= 140) return "font-mono text-[10px] text-emerald-400 ml-auto";
  return "font-mono text-[10px] text-sand ml-auto";
}

function useDirty<T>(current: T, initial: T) {
  return useMemo(
    () => JSON.stringify(current) !== JSON.stringify(initial),
    [current, initial],
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoSettings>(SEO_DEFAULTS);
  const [company, setCompany] = useState<CompanySettings>(COMPANY_DEFAULTS);
  const [loadedSeo, setLoadedSeo] = useState<SeoSettings>(SEO_DEFAULTS);
  const [loadedCompany, setLoadedCompany] = useState<CompanySettings>(COMPANY_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    msg: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data: SettingsResponse = await res.json();
        if (cancelled) return;
        if (data.ok && data.settings) {
          const s: SeoSettings = { ...SEO_DEFAULTS, ...(data.settings.seo || {}) };
          const cRaw: CompanySettings = {
            ...COMPANY_DEFAULTS,
            ...(data.settings.company || {}),
          };
          const c: CompanySettings = {
            ...cRaw,
            socials: { ...COMPANY_DEFAULTS.socials, ...(cRaw.socials || {}) },
          };
          setSeo(s);
          setCompany(c);
          setLoadedSeo(s);
          setLoadedCompany(c);
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

  const seoDirty = useDirty(seo, loadedSeo);
  const companyDirty = useDirty(company, loadedCompany);
  const dirty = seoDirty || companyDirty;

  const showToast = (kind: "success" | "error", msg: string) => {
    setToast({ kind, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const save = async () => {
    setSaving(true);
    try {
      // PUT seo and company separately so each is its own row.
      const tasks: Promise<Response>[] = [];
      if (seoDirty) {
        tasks.push(
          fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "seo", value: seo }),
          }),
        );
      }
      if (companyDirty) {
        tasks.push(
          fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "company", value: company }),
          }),
        );
      }
      const results = await Promise.all(tasks);
      const failed = results.find((r) => !r.ok);
      if (failed) {
        showToast("error", "Failed to save settings. Server returned an error.");
      } else {
        setLoadedSeo(seo);
        setLoadedCompany(company);
        showToast("success", "Settings saved successfully.");
      }
    } catch {
      showToast("error", "Network error — please retry.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setSeo(JSON.parse(JSON.stringify(SEO_DEFAULTS)));
    setCompany(JSON.parse(JSON.stringify(COMPANY_DEFAULTS)));
    showToast("success", "Reverted to defaults (not yet saved).");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2 flex items-center gap-3">
            <Search className="h-7 w-7 text-brass" strokeWidth={1.5} />
            SEO &amp; Company Info
          </h1>
          <p className="font-body text-sm text-sand">
            Manage search engine metadata and company contact details.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={reset}
            className={btnSecondary + " flex items-center gap-2"}
          >
            <RotateCcw className="h-4 w-4" />
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className={btnPrimary + " flex items-center gap-2"}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section A — SEO */}
      <SeoCard seo={seo} setSeo={setSeo} />

      {/* Section B — Company */}
      <CompanyCard company={company} setCompany={setCompany} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-charcoal/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl">
          {toast.kind === "success" ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald/15">
              <Check className="h-4 w-4 text-emerald-400" />
            </span>
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15">
              <X className="h-4 w-4 text-red-400" />
            </span>
          )}
          <span className="font-body text-sm text-ivory pr-2">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section A — SEO card
   ───────────────────────────────────────────────────────────── */
function SeoCard({
  seo,
  setSeo,
}: {
  seo: SeoSettings;
  setSeo: (s: SeoSettings) => void;
}) {
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    const k = newKeyword.trim();
    if (!k) return;
    if (seo.defaultKeywords.includes(k)) {
      setNewKeyword("");
      return;
    }
    setSeo({ ...seo, defaultKeywords: [...seo.defaultKeywords, k] });
    setNewKeyword("");
  };

  const removeKeyword = (k: string) =>
    setSeo({
      ...seo,
      defaultKeywords: seo.defaultKeywords.filter((x) => x !== k),
    });

  const updatePage = (i: number, patch: Partial<PageSeo>) => {
    const pages = seo.pages.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setSeo({ ...seo, pages });
  };

  const addPage = () => {
    setSeo({
      ...seo,
      pages: [...seo.pages, { path: "/new-page", title: "", description: "" }],
    });
  };

  const removePage = (i: number) =>
    setSeo({ ...seo, pages: seo.pages.filter((_, idx) => idx !== i) });

  const siteDescLen = seo.siteDescription.length;

  return (
    <section className="glass-on-charcoal rounded-2xl p-6 md:p-8 mb-6">
      <header className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
          <Search className="h-5 w-5 text-brass" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="font-display text-xl text-ivory">
            Search Engine Optimization
          </h2>
          <p className="font-body text-[12px] text-sand mt-0.5">
            Controls how LaxRee Amenities appears in Google, Bing, and social media previews.
          </p>
        </div>
      </header>

      <div className="grid gap-5">
        {/* siteTitle */}
        <div>
          <label className={labelClass}>Site Title</label>
          <input
            className={inputClass}
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
            placeholder="LaxRee Amenities — Hotel Supplies Redefined"
          />
        </div>

        {/* siteDescription */}
        <div>
          <div className="flex items-center mb-1.5">
            <label className={labelClass + " mb-0"}>Site Description</label>
            <span className={charCounterClass(siteDescLen)}>
              {siteDescLen}/160
            </span>
          </div>
          <textarea
            className={inputClass}
            rows={3}
            value={seo.siteDescription}
            onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
            placeholder="Short, keyword-rich description of LaxRee Amenities (ideal: 140–160 characters)."
          />
        </div>

        {/* defaultKeywords */}
        <div>
          <label className={labelClass}>Default Keywords</label>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {seo.defaultKeywords.length === 0 && (
                <span className="font-body text-[12px] text-sand/70 italic px-1">
                  No keywords yet — add a few below.
                </span>
              )}
              {seo.defaultKeywords.map((k) => (
                <span key={k} className={chipClass}>
                  {k}
                  <button
                    type="button"
                    onClick={() => removeKeyword(k)}
                    className="text-brass/70 hover:text-brass"
                    aria-label={`Remove keyword ${k}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="Add a keyword and press Enter"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="rounded-full bg-brass/15 text-brass px-4 py-2.5 text-sm hover:bg-brass/25 transition-colors flex items-center gap-1.5 shrink-0 border border-brass/20"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* ogImage + preview */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>OpenGraph Image URL</label>
            <input
              className={inputClass}
              value={seo.ogImage}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              placeholder="/images/og/default.jpg"
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              Recommended 1200×630. Used for social shares and link previews.
            </p>
          </div>
          <div>
            <label className={labelClass}>Preview</label>
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden aspect-[1200/630] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={seo.ogImage}
                alt="OpenGraph preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.display = "block";
                }}
              />
            </div>
          </div>
        </div>

        {/* twitter + robots */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Twitter / X Handle</label>
            <input
              className={inputClass}
              value={seo.twitterHandle}
              onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
              placeholder="@laxree"
            />
          </div>
          <div>
            <label className={labelClass}>Robots Directive</label>
            <select
              className={inputClass + " appearance-none cursor-pointer"}
              value={seo.robots}
              onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
            >
              {ROBOTS_OPTIONS.map((o) => (
                <option key={o} value={o} className="bg-charcoal text-ivory">
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Google Search Console Verification</label>
          <input
            className={inputClass}
            value={seo.googleVerification}
            onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })}
            placeholder="e.g. google-site-verification=…"
          />
          <p className="font-mono text-[10px] text-sand mt-1.5">
            Paste the content attribute from Google Search Console verification meta tag.
          </p>
        </div>

        {/* Per-page SEO */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 mt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brass" strokeWidth={1.75} />
              <h3 className="font-display text-base text-ivory">Per-Page SEO</h3>
              <span className="font-mono text-[10px] text-sand">
                {seo.pages.length} pages
              </span>
            </div>
            <button
              type="button"
              onClick={addPage}
              className="rounded-full bg-white/5 text-ivory px-3 py-1.5 text-xs hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add page
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[28rem] overflow-y-auto pr-1">
            {seo.pages.map((p, i) => (
              <div
                key={`${p.path}-${i}`}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <code className="font-mono text-[11px] text-brass bg-brass/10 rounded-md px-2 py-1">
                    {p.path || "/path"}
                  </code>
                  <button
                    type="button"
                    onClick={() => removePage(i)}
                    className="ml-auto text-sand hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                    aria-label="Remove this page"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <label className={labelClass}>Path</label>
                    <input
                      className={inputClass}
                      value={p.path}
                      onChange={(e) => updatePage(i, { path: e.target.value })}
                      placeholder="/about-us"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={inputClass}
                      value={p.title}
                      onChange={(e) => updatePage(i, { title: e.target.value })}
                      placeholder="Page title for search engines"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-1.5">
                      <label className={labelClass + " mb-0"}>Description</label>
                      <span className={charCounterClass(p.description.length)}>
                        {p.description.length}/160
                      </span>
                    </div>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={p.description}
                      onChange={(e) => updatePage(i, { description: e.target.value })}
                      placeholder="Short meta description (140–160 chars ideal)"
                    />
                  </div>
                </div>
              </div>
            ))}
            {seo.pages.length === 0 && (
              <p className="font-body text-[12px] text-sand/70 italic text-center py-6">
                No pages configured. Click &quot;Add page&quot; to define per-page SEO.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section B — Company card
   ───────────────────────────────────────────────────────────── */
function CompanyCard({
  company,
  setCompany,
}: {
  company: CompanySettings;
  setCompany: (c: CompanySettings) => void;
}) {
  const updateSocial = (k: keyof Socials, v: string) =>
    setCompany({ ...company, socials: { ...company.socials, [k]: v } });

  const socialFields: {
    key: keyof Socials;
    label: string;
    icon: typeof Facebook;
    placeholder: string;
  }[] = [
    {
      key: "facebook",
      label: "Facebook",
      icon: Facebook,
      placeholder: "https://facebook.com/…",
    },
    {
      key: "x",
      label: "X / Twitter",
      icon: Twitter,
      placeholder: "https://x.com/…",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: Youtube,
      placeholder: "https://youtube.com/…",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      placeholder: "https://linkedin.com/…",
    },
  ];

  return (
    <section className="glass-on-charcoal rounded-2xl p-6 md:p-8">
      <header className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
          <Building2 className="h-5 w-5 text-brass" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="font-display text-xl text-ivory">Company Contact Details</h2>
          <p className="font-body text-[12px] text-sand mt-0.5">
            Shown in the footer, contact page, and floating WhatsApp / call buttons.
          </p>
        </div>
      </header>

      <div className="grid gap-5">
        {/* name + tagline */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Company Name</label>
            <input
              className={inputClass}
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input
              className={inputClass}
              value={company.tagline}
              onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
            />
          </div>
        </div>

        {/* phoneDisplay + phoneHref */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass + " flex items-center gap-1.5"}>
              <Phone className="h-3 w-3" /> Primary Phone (Display)
            </label>
            <input
              className={inputClass}
              value={company.phoneDisplay}
              onChange={(e) => setCompany({ ...company, phoneDisplay: e.target.value })}
              placeholder="+91-92516 83662"
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              Shown to users in the UI.
            </p>
          </div>
          <div>
            <label className={labelClass}>Primary Phone (href)</label>
            <input
              className={inputClass}
              value={company.phoneHref}
              onChange={(e) => setCompany({ ...company, phoneHref: e.target.value })}
              placeholder="+919251683662"
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              Used inside <code>tel:</code> links — digits only with country code.
            </p>
          </div>
        </div>

        {/* tollFree */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Toll-Free (Display)</label>
            <input
              className={inputClass}
              value={company.tollFreeDisplay}
              onChange={(e) =>
                setCompany({ ...company, tollFreeDisplay: e.target.value })
              }
              placeholder="1800 120 7001"
            />
          </div>
          <div>
            <label className={labelClass}>Toll-Free (href)</label>
            <input
              className={inputClass}
              value={company.tollFreeHref}
              onChange={(e) =>
                setCompany({ ...company, tollFreeHref: e.target.value })
              }
              placeholder="18001207001"
            />
          </div>
        </div>

        {/* whatsapp */}
        <div>
          <label className={labelClass}>WhatsApp Number</label>
          <input
            className={inputClass}
            value={company.whatsapp}
            onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
            placeholder="919251683662"
          />
          <p className="font-mono text-[10px] text-sand mt-1.5">
            Include country code, no + or spaces. e.g. 919251683662
          </p>
        </div>

        {/* emails */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass + " flex items-center gap-1.5"}>
              <Mail className="h-3 w-3" /> General Email
            </label>
            <input
              className={inputClass}
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              placeholder="contactus@laxree.com"
            />
          </div>
          <div>
            <label className={labelClass + " flex items-center gap-1.5"}>
              <Mail className="h-3 w-3" /> Careers Email
            </label>
            <input
              className={inputClass}
              value={company.careersEmail}
              onChange={(e) =>
                setCompany({ ...company, careersEmail: e.target.value })
              }
              placeholder="hr@laxree.com"
            />
          </div>
        </div>

        {/* address */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5"}>
            <MapPin className="h-3 w-3" /> Address
          </label>
          <textarea
            className={inputClass}
            rows={3}
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
            placeholder="Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001"
          />
        </div>

        {/* socials */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5 mb-3"}>
            <Share2 className="h-3 w-3" /> Social Media Links
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {socialFields.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.key}>
                  <label className="data-label mb-1.5 flex items-center gap-1.5 text-[11px] text-sand">
                    <Icon className="h-3.5 w-3.5" /> {s.label}
                  </label>
                  <input
                    className={inputClass}
                    value={company.socials[s.key]}
                    onChange={(e) => updateSocial(s.key, e.target.value)}
                    placeholder={s.placeholder}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
