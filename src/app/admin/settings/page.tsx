"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Phone,
  Mail,
  MapPin,
  Share2,
  Save,
  RotateCcw,
  Upload,
  Check,
  X,
  Clock,
  MessageCircle,
  Image as ImageIcon,
  FileText,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types — mirror the site:settings CMS key shape.
   Stored as a single JSON blob in SiteContent via
   PUT /api/admin/cms { key: "site:settings", value: settings }.
   ───────────────────────────────────────────────────────────── */
type Socials = {
  facebook: string;
  linkedin: string;
  youtube: string;
  x: string;
};

type SiteSettings = {
  // ── General ──
  siteName: string;
  tagline: string;
  logo: string;
  copyright: string;
  companyDescription: string;
  gst: string;
  pan: string;
  // ── Contact ──
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  tollFreeDisplay: string;
  tollFreeHref: string;
  whatsapp: string;
  email: string;
  careersEmail: string;
  workingHours: string;
  mapEmbed: string;
  socials: Socials;
};

type CmsGetResponse = {
  ok: boolean;
  key?: string;
  value: SiteSettings | null;
  message?: string;
};

/* ─────────────────────────────────────────────────────────────
   Hard-coded defaults — must stay in sync with SITE constant
   in /lib/laxree/site-data.ts so the page renders sane values
   before the first save.
   ───────────────────────────────────────────────────────────── */
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "LaxRee Amenities",
  tagline: "Hotel Supplies Redefined",
  logo: "/images/laxree-logo.webp",
  copyright: "LaxRee Amenities © 2026 — All Rights Reserved",
  companyDescription:
    "India's leading hospitality procurement partner. 700+ SKUs across minibars, furniture, linen, roofing & dome structures. Trusted by 1,347+ properties.",
  gst: "",
  pan: "",
  address:
    "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
  phoneDisplay: "+91-92516 83662",
  phoneHref: "+919251683662",
  tollFreeDisplay: "1800 120 7001",
  tollFreeHref: "18001207001",
  whatsapp: "919251683662",
  email: "contactus@laxree.com",
  careersEmail: "hr@laxree.com",
  workingHours: "Mon–Sat: 9:30 AM – 6:30 PM",
  mapEmbed: "",
  socials: {
    facebook: "https://facebook.com/laxreeamenities",
    linkedin: "https://linkedin.com/company/laxree-amenities",
    youtube: "https://youtube.com/@laxreeamenities",
    x: "https://x.com/laxreeamenities",
  },
};

/* ─────────────────────────────────────────────────────────────
   Shared input styling — matches /admin/seo/page.tsx exactly.
   ───────────────────────────────────────────────────────────── */
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none transition-colors";
const labelClass = "data-label mb-1.5 block text-[11px] text-sand";
const btnPrimary =
  "rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnSecondary =
  "rounded-full bg-white/5 text-ivory px-5 py-2.5 text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

type Tab = "general" | "contact";

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [tab, setTab] = useState<Tab>("general");
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
        const res = await fetch("/api/admin/cms?key=site:settings", {
          cache: "no-store",
        });
        const data: CmsGetResponse = await res.json();
        if (cancelled) return;
        if (data.ok && data.value) {
          const merged: SiteSettings = {
            ...DEFAULT_SETTINGS,
            ...data.value,
            socials: {
              ...DEFAULT_SETTINGS.socials,
              ...(data.value.socials || {}),
            },
          };
          setSettings(merged);
          setLoaded(merged);
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

  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(loaded),
    [settings, loaded],
  );

  const showToast = (kind: "success" | "error", msg: string) => {
    setToast({ kind, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const update = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => setSettings((prev) => ({ ...prev, [key]: value }));

  const updateSocial = (key: keyof Socials, value: string) =>
    setSettings((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value },
    }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site:settings", value: settings }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setLoaded(settings);
        showToast("success", "Site settings saved successfully.");
      } else {
        showToast(
          "error",
          data.message || "Failed to save settings. Server returned an error.",
        );
      }
    } catch {
      showToast("error", "Network error — please retry.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
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
            <SettingsIcon className="h-7 w-7 text-brass" strokeWidth={1.5} />
            Site Settings
          </h1>
          <p className="font-body text-sm text-sand">
            Manage your company identity, contact channels, and social presence.
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
                <Loader2 className="h-4 w-4 animate-spin" />
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

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-full bg-white/5 border border-white/10 p-1 w-fit">
        <TabButton
          active={tab === "general"}
          onClick={() => setTab("general")}
          icon={Building2}
          label="General"
        />
        <TabButton
          active={tab === "contact"}
          onClick={() => setTab("contact")}
          icon={Phone}
          label="Contact"
        />
      </div>

      {/* Tab content */}
      {tab === "general" ? (
        <GeneralTab settings={settings} update={update} />
      ) : (
        <ContactTab
          settings={settings}
          update={update}
          updateSocial={updateSocial}
        />
      )}

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
   Tab button primitive
   ───────────────────────────────────────────────────────────── */
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Building2;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brass text-charcoal"
          : "text-sand hover:text-ivory hover:bg-white/5"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   General tab — site identity, logo, copyright, tax IDs
   ───────────────────────────────────────────────────────────── */
function GeneralTab({
  settings,
  update,
}: {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => void;
}) {
  return (
    <section className="glass-on-charcoal rounded-2xl p-6 md:p-8">
      <header className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
          <Building2 className="h-5 w-5 text-brass" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="font-display text-xl text-ivory">General</h2>
          <p className="font-body text-[12px] text-sand mt-0.5">
            Your site identity, logo, and statutory information.
          </p>
        </div>
      </header>

      <div className="grid gap-5">
        {/* Site name + tagline */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Site Name</label>
            <input
              className={inputClass}
              value={settings.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              placeholder="LaxRee Amenities"
            />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input
              className={inputClass}
              value={settings.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="Hotel Supplies Redefined"
            />
          </div>
        </div>

        {/* Logo upload */}
        <LogoUpload
          value={settings.logo}
          onChange={(v) => update("logo", v)}
        />

        {/* Company description */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5"}>
            <FileText className="h-3 w-3" /> Company Description
          </label>
          <textarea
            className={inputClass}
            rows={4}
            value={settings.companyDescription}
            onChange={(e) => update("companyDescription", e.target.value)}
            placeholder="Short paragraph describing your company — used in footers, About pages, and meta descriptions."
          />
          <p className="font-mono text-[10px] text-sand mt-1.5">
            Recommended length: 140–200 characters.
          </p>
        </div>

        {/* Copyright */}
        <div>
          <label className={labelClass}>Footer Copyright Notice</label>
          <input
            className={inputClass}
            value={settings.copyright}
            onChange={(e) => update("copyright", e.target.value)}
            placeholder="LaxRee Amenities © 2026 — All Rights Reserved"
          />
          <p className="font-mono text-[10px] text-sand mt-1.5">
            Shown at the bottom of every page in the footer.
          </p>
        </div>

        {/* Tax IDs */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>GST Number</label>
            <input
              className={inputClass + " font-mono uppercase"}
              value={settings.gst}
              onChange={(e) => update("gst", e.target.value.toUpperCase())}
              placeholder="08ABCDE1234F1Z5"
              maxLength={15}
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              15-digit GSTIN — appears on invoices and quotations.
            </p>
          </div>
          <div>
            <label className={labelClass}>PAN Number</label>
            <input
              className={inputClass + " font-mono uppercase"}
              value={settings.pan}
              onChange={(e) => update("pan", e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              10-character Permanent Account Number.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Contact tab — address, phone, email, map, socials
   ───────────────────────────────────────────────────────────── */
function ContactTab({
  settings,
  update,
  updateSocial,
}: {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => void;
  updateSocial: (key: keyof Socials, value: string) => void;
}) {
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
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      placeholder: "https://linkedin.com/…",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: Youtube,
      placeholder: "https://youtube.com/…",
    },
    {
      key: "x",
      label: "X / Twitter",
      icon: Twitter,
      placeholder: "https://x.com/…",
    },
  ];

  return (
    <section className="glass-on-charcoal rounded-2xl p-6 md:p-8">
      <header className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
          <Phone className="h-5 w-5 text-brass" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="font-display text-xl text-ivory">Contact</h2>
          <p className="font-body text-[12px] text-sand mt-0.5">
            Address, phone numbers, email channels, map, and social media —
            shown in the footer, navbar, and contact page.
          </p>
        </div>
      </header>

      <div className="grid gap-5">
        {/* Address */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5"}>
            <MapPin className="h-3 w-3" /> Address
          </label>
          <textarea
            className={inputClass}
            rows={3}
            value={settings.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001"
          />
        </div>

        {/* Primary phone */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass + " flex items-center gap-1.5"}>
              <Phone className="h-3 w-3" /> Primary Phone (Display)
            </label>
            <input
              className={inputClass}
              value={settings.phoneDisplay}
              onChange={(e) => update("phoneDisplay", e.target.value)}
              placeholder="+91-92516 83662"
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              Shown to users in the UI.
            </p>
          </div>
          <div>
            <label className={labelClass}>Primary Phone (tel: link)</label>
            <input
              className={inputClass + " font-mono"}
              value={settings.phoneHref}
              onChange={(e) => update("phoneHref", e.target.value)}
              placeholder="+919251683662"
            />
            <p className="font-mono text-[10px] text-sand mt-1.5">
              Used inside <code>tel:</code> links — digits only with country
              code.
            </p>
          </div>
        </div>

        {/* Toll-free */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Toll-Free (Display)</label>
            <input
              className={inputClass}
              value={settings.tollFreeDisplay}
              onChange={(e) => update("tollFreeDisplay", e.target.value)}
              placeholder="1800 120 7001"
            />
          </div>
          <div>
            <label className={labelClass}>Toll-Free (tel: link)</label>
            <input
              className={inputClass + " font-mono"}
              value={settings.tollFreeHref}
              onChange={(e) => update("tollFreeHref", e.target.value)}
              placeholder="18001207001"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5"}>
            <MessageCircle className="h-3 w-3" /> WhatsApp Number
          </label>
          <input
            className={inputClass + " font-mono"}
            value={settings.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="919251683662"
          />
          <p className="font-mono text-[10px] text-sand mt-1.5">
            Include country code, no + or spaces. e.g. 919251683662
          </p>
        </div>

        {/* Emails */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass + " flex items-center gap-1.5"}>
              <Mail className="h-3 w-3" /> General Email
            </label>
            <input
              className={inputClass}
              type="email"
              value={settings.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="contactus@laxree.com"
            />
          </div>
          <div>
            <label className={labelClass + " flex items-center gap-1.5"}>
              <Mail className="h-3 w-3" /> Careers Email
            </label>
            <input
              className={inputClass}
              type="email"
              value={settings.careersEmail}
              onChange={(e) => update("careersEmail", e.target.value)}
              placeholder="hr@laxree.com"
            />
          </div>
        </div>

        {/* Working hours */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5"}>
            <Clock className="h-3 w-3" /> Working Hours
          </label>
          <input
            className={inputClass}
            value={settings.workingHours}
            onChange={(e) => update("workingHours", e.target.value)}
            placeholder="Mon–Sat: 9:30 AM – 6:30 PM"
          />
        </div>

        {/* Google Map Embed URL */}
        <div>
          <label className={labelClass + " flex items-center gap-1.5"}>
            <MapPin className="h-3 w-3" /> Google Map Embed URL
          </label>
          <textarea
            className={inputClass + " font-mono text-xs"}
            rows={3}
            value={settings.mapEmbed}
            onChange={(e) => update("mapEmbed", e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=…"
          />
          <p className="font-mono text-[10px] text-sand mt-1.5">
            Paste the <code>src</code> URL from Google Maps → Share → Embed a
            map. Used on the Contact page.
          </p>
        </div>

        {/* Social media */}
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
                    value={settings.socials[s.key]}
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

/* ─────────────────────────────────────────────────────────────
   Logo upload — POSTs FormData to /api/admin/upload and stores
   the returned imageUrl in the settings.logo field.
   ───────────────────────────────────────────────────────────── */
function LogoUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "site-logo");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        if (res.status === 413) {
          setError("Image too large (max 8 MB).");
        } else {
          setError(`Upload failed (${res.status}).`);
        }
        setUploading(false);
        return;
      }
      const data = await res.json();
      if (data.ok && data.imageUrl) {
        onChange(data.imageUrl);
      } else {
        setError(data.message || "Upload failed.");
      }
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className={labelClass}>Site Logo</label>
      <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
        {/* Preview */}
        <div className="h-20 w-32 shrink-0 rounded-lg border border-white/15 bg-charcoal overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Site logo preview"
              className="h-full w-full object-contain p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-sand/40" />
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 min-w-0">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full bg-brass/15 text-brass border border-brass/20 px-3 py-1.5 text-xs hover:bg-brass/25 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  Upload logo
                </>
              )}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 text-sand border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10 hover:text-ivory transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/laxree-logo.webp"
            className={inputClass + " text-xs font-mono"}
          />
          {error ? (
            <p className="font-mono text-[10px] text-red-400 mt-1.5">{error}</p>
          ) : (
            <p className="font-mono text-[10px] text-sand mt-1.5">
              Recommended size: 320×80 px (PNG with transparent background).
              Used in the navbar and footer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
