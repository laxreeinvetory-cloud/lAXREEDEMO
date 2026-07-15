"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Palette,
  Type,
  Save,
  RotateCcw,
  Plus,
  X,
  Check,
  Eye,
} from "lucide-react";

type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  textColor: string;
  mutedColor: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  cardRadius: string;
  pillRadius: string;
};

type HeroStat = { value: number; suffix: string; label: string };

type HomepageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroStats: HeroStat[];
};

type Settings = {
  theme: ThemeSettings;
  homepage: HomepageSettings;
};

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: "#12100D",
  secondaryColor: "#F5F1E8",
  accentColor: "#B08D57",
  successColor: "#1E4638",
  textColor: "#F5F1E8",
  mutedColor: "#A89B8C",
  fontDisplay: "Fraunces",
  fontBody: "Work Sans",
  fontMono: "IBM Plex Mono",
  cardRadius: "24px",
  pillRadius: "999px",
};

const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroEyebrow: "Hotel Supplies Redefined",
  heroTitle: "LaxRee Amenities",
  heroSubtitle:
    "India's most comprehensive hospitality procurement partner — from minibars to roofing systems, delivered to 1,347+ properties.",
  heroPrimaryCta: "Request Quotation",
  heroSecondaryCta: "Download Catalogue",
  heroStats: [
    { value: 1347, suffix: "+", label: "Projects" },
    { value: 11, suffix: "+", label: "Years" },
    { value: 700, suffix: "+", label: "SKUs" },
    { value: 7, suffix: "+", label: "Certifications" },
  ],
};

const FONT_OPTIONS = [
  "Fraunces",
  "Work Sans",
  "IBM Plex Mono",
  "Inter",
  "Playfair Display",
  "Roboto Mono",
  "Georgia",
  "system-ui",
];

const COLOR_FIELDS: { key: keyof ThemeSettings; label: string; hint: string }[] = [
  { key: "primaryColor", label: "Primary (Charcoal)", hint: "Main background" },
  { key: "secondaryColor", label: "Secondary (Ivory)", hint: "Light backgrounds" },
  { key: "accentColor", label: "Accent (Brass)", hint: "Buttons, highlights" },
  { key: "successColor", label: "Success (Emerald)", hint: "Positive states" },
  { key: "textColor", label: "Text", hint: "Body text on dark" },
  { key: "mutedColor", label: "Muted (Sand)", hint: "Secondary text" },
];

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function AdminAppearancePage() {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [homepage, setHomepage] = useState<HomepageSettings>(DEFAULT_HOMEPAGE);
  const [loaded, setLoaded] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.settings) {
          const t = { ...DEFAULT_THEME, ...(data.settings.theme || {}) } as ThemeSettings;
          const h = { ...DEFAULT_HOMEPAGE, ...(data.settings.homepage || {}) } as HomepageSettings;
          setTheme(t);
          setHomepage(h);
          setLoaded({ theme: t, homepage: h });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dirty = useMemo(() => {
    if (!loaded) return false;
    return !isEqual(theme, loaded.theme) || !isEqual(homepage, loaded.homepage);
  }, [theme, homepage, loaded]);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tasks: Promise<Response>[] = [];
      if (!isEqual(theme, loaded?.theme)) {
        tasks.push(
          fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "theme", value: theme }),
          })
        );
      }
      if (!isEqual(homepage, loaded?.homepage)) {
        tasks.push(
          fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "homepage", value: homepage }),
          })
        );
      }
      const results = await Promise.all(tasks);
      if (results.every((r) => r.ok)) {
        setLoaded({ theme: { ...theme }, homepage: { ...homepage } });
        showToast("ok", "Settings saved successfully.");
      } else {
        showToast("err", "Failed to save settings.");
      }
    } catch {
      showToast("err", "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTheme({ ...DEFAULT_THEME });
    setHomepage({ ...DEFAULT_HOMEPAGE, heroStats: DEFAULT_HOMEPAGE.heroStats.map((s) => ({ ...s })) });
    showToast("ok", "Defaults restored. Click Save to persist.");
  };

  const updateTheme = (key: keyof ThemeSettings, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const updateHomepage = (key: keyof HomepageSettings, value: string) => {
    setHomepage((prev) => ({ ...prev, [key]: value } as HomepageSettings));
  };

  const updateStat = (idx: number, key: keyof HeroStat, value: string | number) => {
    setHomepage((prev) => ({
      ...prev,
      heroStats: prev.heroStats.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));
  };

  const addStat = () => {
    setHomepage((prev) => ({
      ...prev,
      heroStats: [...prev.heroStats, { value: 0, suffix: "+", label: "New Stat" }],
    }));
  };

  const removeStat = (idx: number) => {
    setHomepage((prev) => ({
      ...prev,
      heroStats: prev.heroStats.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2">Appearance</h1>
          <p className="font-body text-sm text-sand">
            Customize your site&apos;s theme colors, fonts, and homepage hero content.
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
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.75} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* SECTION A: THEME */}
      <div className="glass-on-charcoal rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
            <Palette className="h-5 w-5 text-brass" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-display text-lg text-ivory">Brand Colors &amp; Typography</h2>
            <p className="font-body text-[12px] text-sand">
              Colors and fonts used across your website.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {COLOR_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
                {field.label}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5">
                <input
                  type="color"
                  value={theme[field.key]}
                  onChange={(e) => updateTheme(field.key, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  style={{ appearance: "none" }}
                />
                <input
                  type="text"
                  value={theme[field.key]}
                  onChange={(e) => updateTheme(field.key, e.target.value)}
                  className="flex-1 bg-transparent border-0 px-1 py-1 font-mono text-sm text-ivory focus:outline-none"
                />
              </div>
              <p className="font-body text-[10px] text-sand/60 mt-1">{field.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Display Font
            </label>
            <select
              value={theme.fontDisplay}
              onChange={(e) => updateTheme("fontDisplay", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f} className="bg-charcoal">
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Body Font
            </label>
            <select
              value={theme.fontBody}
              onChange={(e) => updateTheme("fontBody", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f} className="bg-charcoal">
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Mono Font
            </label>
            <select
              value={theme.fontMono}
              onChange={(e) => updateTheme("fontMono", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f} className="bg-charcoal">
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Card Radius
            </label>
            <input
              type="text"
              value={theme.cardRadius}
              onChange={(e) => updateTheme("cardRadius", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
              placeholder="24px"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Pill Radius
            </label>
            <input
              type="text"
              value={theme.pillRadius}
              onChange={(e) => updateTheme("pillRadius", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
              placeholder="999px"
            />
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-sand" strokeWidth={1.75} />
            <p className="font-mono text-[10px] uppercase tracking-wider text-sand">
              Live Preview
            </p>
          </div>
          <div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: theme.primaryColor,
              borderColor: `${theme.accentColor}33`,
              borderRadius: theme.cardRadius,
            }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2"
              style={{ color: theme.accentColor, fontFamily: theme.fontMono }}
            >
              Sample Eyebrow
            </p>
            <h3
              className="text-2xl mb-2"
              style={{ color: theme.secondaryColor, fontFamily: theme.fontDisplay }}
            >
              Display Heading Preview
            </h3>
            <p
              className="text-sm mb-4 max-w-md"
              style={{ color: theme.mutedColor, fontFamily: theme.fontBody }}
            >
              This is how your body text will look. Cras sit amet nibh libero, in gravida nulla.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="px-5 py-2.5 text-sm font-medium"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.primaryColor,
                  borderRadius: theme.pillRadius,
                }}
              >
                Primary Button
              </button>
              <span
                className="inline-block px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider"
                style={{
                  backgroundColor: `${theme.successColor}33`,
                  color: theme.successColor,
                  borderRadius: theme.pillRadius,
                  border: `1px solid ${theme.successColor}55`,
                }}
              >
                Success Badge
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: HOMEPAGE HERO */}
      <div className="glass-on-charcoal rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10">
            <Type className="h-5 w-5 text-brass" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-display text-lg text-ivory">Homepage Hero Section</h2>
            <p className="font-body text-[12px] text-sand">
              The first thing visitors see at the top of your homepage.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Eyebrow (small label above title)
            </label>
            <input
              type="text"
              value={homepage.heroEyebrow}
              onChange={(e) => updateHomepage("heroEyebrow", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={homepage.heroTitle}
              onChange={(e) => updateHomepage("heroTitle", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
            Subtitle
          </label>
          <textarea
            value={homepage.heroSubtitle}
            onChange={(e) => updateHomepage("heroSubtitle", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Primary Button Text
            </label>
            <input
              type="text"
              value={homepage.heroPrimaryCta}
              onChange={(e) => updateHomepage("heroPrimaryCta", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sand mb-1.5">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={homepage.heroSecondaryCta}
              onChange={(e) => updateHomepage("heroSecondaryCta", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
            />
          </div>
        </div>

        {/* HERO STATS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-sand">
              Hero Stats
            </p>
            <button
              onClick={addStat}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 text-ivory px-3 py-1.5 text-xs hover:bg-white/10 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
              Add Stat
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {homepage.heroStats.map((stat, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_80px_1.5fr_auto] gap-2 items-center rounded-xl bg-white/5 p-2"
              >
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, "value", parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-ivory focus:border-brass focus:outline-none"
                  placeholder="1347"
                />
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => updateStat(idx, "suffix", e.target.value)}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-ivory focus:border-brass focus:outline-none text-center"
                  placeholder="+"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(idx, "label", e.target.value)}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-ivory focus:border-brass focus:outline-none"
                  placeholder="Projects"
                />
                <button
                  onClick={() => removeStat(idx)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sand/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Remove stat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {homepage.heroStats.length === 0 && (
              <p className="font-body text-sm text-sand/60 py-4 text-center">
                No stats yet. Click &quot;Add Stat&quot; to create one.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2"
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
