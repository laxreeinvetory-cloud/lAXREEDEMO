"use client";

/**
 * Admin Analytics Page — /admin/analytics
 *
 * Two halves on one page:
 *   1. Visual analytics dashboard (KPI cards + 4 CSS/SVG charts) — top
 *   2. Google Analytics 4 + Search Console configuration — bottom
 *
 * All charts are pure CSS / inline SVG (no chart libraries).
 *
 * Data:
 *   GET /api/admin/analytics  → { kpis, leadsByDay, leadsBySource, leadsByStatus, leadsByMonth }
 *   GET /api/admin/cms?key=analytics-config  → { value: { gaId, gscToken } }
 *   PUT /api/admin/cms  body { key: "analytics-config", value: { gaId, gscToken } }
 */
import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Package,
  Save,
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
  Eye,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  Globe,
  BookOpen,
  HelpCircle,
  Link2,
} from "lucide-react";
import { toast, AdminToaster } from "@/lib/admin/admin-toast";

/* ─────────────────────────────────────────────────────────────
   Types — match /api/admin/analytics response
   ───────────────────────────────────────────────────────────── */
type Kpis = {
  totalLeads: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  pctChange: number;
  totalBlogPosts: number;
  totalProducts: number;
  pageViews: string | null;
  gaConnected: boolean;
  gscConnected: boolean;
};

type DayPoint = { date: string; label: string; count: number };
type SourcePoint = { key: string; label: string; color: string; count: number };
type StatusPoint = { key: string; label: string; color: string; count: number };
type MonthPoint = { label: string; count: number };

type AnalyticsResponse = {
  ok: boolean;
  kpis?: Kpis;
  leadsByDay?: DayPoint[];
  leadsBySource?: SourcePoint[];
  leadsByStatus?: StatusPoint[];
  leadsByMonth?: MonthPoint[];
};

/* ─────────────────────────────────────────────────────────────
   Number formatting helpers
   ───────────────────────────────────────────────────────────── */
function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtPct(p: number): string {
  const sign = p > 0 ? "+" : "";
  return `${sign}${p}%`;
}

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */
export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AnalyticsDashboard />
      <AnalyticsConfig />
      <AdminToaster />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Section 1 — Visual Analytics Dashboard
   ════════════════════════════════════════════════════════════ */
function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      const json: AnalyticsResponse = await res.json();
      if (json.ok) {
        setData(json);
      } else if (!silent) {
        toast("error", "Failed to load analytics data.");
      }
    } catch {
      if (!silent) toast("error", "Network error — could not load analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(true);
    // Auto-refresh every 60s so the dashboard feels "real-time"
    const id = window.setInterval(() => fetchAnalytics(true), 60_000);
    return () => window.clearInterval(id);
  }, [fetchAnalytics]);

  const kpis = data?.kpis;
  const byDay = data?.leadsByDay || [];
  const bySource = data?.leadsBySource || [];
  const byStatus = data?.leadsByStatus || [];
  const byMonth = data?.leadsByMonth || [];

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brass/30 bg-brass/15">
              <BarChart3 className="h-5 w-5 text-brass" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sand">
              Admin · Analytics
            </span>
          </div>
          <h1 className="font-display text-3xl text-ivory">Analytics Dashboard</h1>
          <p className="mt-1.5 font-body text-sm text-sand">
            Real-time tracking of leads, content and integration status. Auto-refreshes every 60s.
          </p>
        </div>
        <button
          onClick={() => fetchAnalytics(false)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.75} />
          Refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Leads (Month)"
          icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
          value={kpis ? fmtNum(kpis.leadsThisMonth) : "—"}
          footer={
            kpis ? (
              <ChangePill pct={kpis.pctChange} prev={kpis.leadsLastMonth} />
            ) : (
              <span className="font-mono text-[10px] text-sand/50">—</span>
            )
          }
          accent="brass"
        />
        <KpiCard
          label="Blog Posts"
          icon={<FileText className="h-4 w-4" strokeWidth={1.75} />}
          value={kpis ? fmtNum(kpis.totalBlogPosts) : "—"}
          footer={<span className="font-mono text-[10px] text-sand/70">All-time total</span>}
          accent="emerald"
        />
        <KpiCard
          label="Products"
          icon={<Package className="h-4 w-4" strokeWidth={1.75} />}
          value={kpis ? fmtNum(kpis.totalProducts) : "—"}
          footer={<span className="font-mono text-[10px] text-sand/70">Catalogue size</span>}
          accent="brass"
        />
        <KpiCard
          label="Page Views"
          icon={<Eye className="h-4 w-4" strokeWidth={1.75} />}
          value={
            kpis
              ? kpis.gaConnected
                ? "Connected"
                : "—"
              : "—"
          }
          footer={
            kpis?.gaConnected ? (
              <span className="font-mono text-[10px] text-emerald-400">GA tracking active</span>
            ) : (
              <Link
                href="#ga-config"
                className="font-mono text-[10px] uppercase tracking-wider text-brass hover:underline"
              >
                Connect GA →
              </Link>
            )
          }
          accent="emerald"
        />
      </div>

      {/* Charts grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-brass" strokeWidth={1.75} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <BarChartDay data={byDay} />
          <SourceBars data={bySource} />
          <StatusDonut data={byStatus} />
          <MonthLine data={byMonth} />
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   KPI card
   ───────────────────────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  icon,
  footer,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  footer: React.ReactNode;
  accent: "brass" | "emerald";
}) {
  const accentBorder = accent === "brass" ? "border-l-brass" : "border-l-emerald";
  return (
    <div
      className={`glass-on-charcoal rounded-2xl border border-white/10 ${accentBorder} border-l-4 p-5`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand">{label}</span>
        <span className="text-brass/80">{icon}</span>
      </div>
      <p className="font-display text-3xl text-ivory">{value}</p>
      <div className="mt-2">{footer}</div>
    </div>
  );
}

function ChangePill({ pct, prev }: { pct: number; prev: number }) {
  if (prev === 0 && pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-sand/60">
        <Minus className="h-3 w-3" /> No prior data
      </span>
    );
  }
  const isUp = pct > 0;
  const isFlat = pct === 0;
  const cls = isFlat
    ? "text-sand/70"
    : isUp
    ? "text-emerald-400"
    : "text-red-400";
  const Icon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${cls}`}>
      <Icon className="h-3 w-3" /> {fmtPct(pct)} vs last month
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Chart 1 — Leads by Day (vertical bar chart, last 30 days)
   ───────────────────────────────────────────────────────────── */
function BarChartDay({ data }: { data: DayPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <ChartCard
      title="Leads by Day"
      subtitle="Last 30 days · hover for exact count"
      icon={<TrendingUp className="h-4 w-4" strokeWidth={1.75} />}
      meta={<span className="font-mono text-[10px] text-sand">{total} total</span>}
    >
      <div className="flex h-44 items-end gap-[3px]">
        {data.map((d, i) => {
          const h = (d.count / max) * 100;
          return (
            <div
              key={`${d.date}-${i}`}
              className="group relative flex-1"
              title={`${d.label}: ${d.count} lead${d.count === 1 ? "" : "s"}`}
            >
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-brass/40 to-brass transition-all duration-300 hover:from-brass hover:to-brass-light"
                style={{ height: `${Math.max(h, 2)}%` }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-brass/30 bg-charcoal px-2 py-1 font-mono text-[10px] text-ivory shadow-lg group-hover:block">
                {d.label}: {d.count}
              </div>
            </div>
          );
        })}
      </div>
      {/* X-axis labels — first, middle, last */}
      <div className="mt-2 flex justify-between font-mono text-[9px] text-sand/60">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────────────────────
   Chart 2 — Leads by Source (horizontal bar chart)
   ───────────────────────────────────────────────────────────── */
function SourceBars({ data }: { data: SourcePoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <ChartCard
      title="Leads by Source"
      subtitle="Where leads are coming from"
      icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
      meta={<span className="font-mono text-[10px] text-sand">{total} total</span>}
    >
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="flex max-h-72 flex-col gap-3 overflow-y-auto scrollbar-thin pr-2">
          {data.map((d) => {
            const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
            return (
              <div key={d.key} className="group">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-body text-[12px] text-ivory">{d.label}</span>
                  <span className="font-mono text-[11px] text-sand">
                    {d.count} <span className="text-sand/50">· {pct}%</span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(d.count / max) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────────────────────
   Chart 3 — Leads by Status (donut chart via conic-gradient)
   ───────────────────────────────────────────────────────────── */
function StatusDonut({ data }: { data: StatusPoint[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const segments = data.filter((d) => d.count > 0);

  // Build conic-gradient stops
  let acc = 0;
  const stops: string[] = [];
  for (const seg of segments) {
    const start = (acc / Math.max(total, 1)) * 100;
    acc += seg.count;
    const end = (acc / Math.max(total, 1)) * 100;
    stops.push(`${seg.color} ${start}% ${end}%`);
  }
  const gradient =
    segments.length > 0
      ? `conic-gradient(${stops.join(", ")})`
      : "conic-gradient(#3a3a3a 0% 100%)";

  return (
    <ChartCard
      title="Leads by Status"
      subtitle="Pipeline distribution"
      icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.75} />}
      meta={<span className="font-mono text-[10px] text-sand">{total} total</span>}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Donut */}
        <div className="relative h-40 w-40 shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ background: gradient }}
            aria-label={`Leads by status donut chart, ${total} total`}
            role="img"
          />
          {/* Inner hole */}
          <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-charcoal text-center">
            <span className="font-display text-2xl text-ivory">{fmtNum(total)}</span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-sand">Leads</span>
          </div>
        </div>
        {/* Legend */}
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-1">
          {data.map((d) => {
            const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
            return (
              <div key={d.key} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="font-body text-[12px] text-ivory">{d.label}</span>
                </div>
                <span className="font-mono text-[11px] text-sand">
                  {d.count} <span className="text-sand/50">· {pct}%</span>
                </span>
              </div>
            );
          })}
          {data.length === 0 && <EmptyChart />}
        </div>
      </div>
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────────────────────
   Chart 4 — Leads Trend (line chart, last 6 months, SVG)
   ───────────────────────────────────────────────────────────── */
function MonthLine({ data }: { data: MonthPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  const W = 320;
  const H = 140;
  const padX = 20;
  const padY = 20;
  const stepX = (W - padX * 2) / Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = H - padY - (d.count / max) * (H - padY * 2);
    return { x, y, ...d };
  });

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `M ${padX},${H - padY} ` +
        points.map((p) => `L ${p.x},${p.y}`).join(" ") +
        ` L ${padX + (data.length - 1) * stepX},${H - padY} Z`
      : "";

  return (
    <ChartCard
      title="Leads Trend"
      subtitle="Last 6 months"
      icon={<TrendingUp className="h-4 w-4" strokeWidth={1.75} />}
      meta={<span className="font-mono text-[10px] text-sand">{total} total</span>}
    >
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-44 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Leads trend over the last 6 months"
        >
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Gridlines */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1={padX}
              x2={W - padX}
              y1={padY + g * (H - padY * 2)}
              y2={padY + g * (H - padY * 2)}
              stroke="rgba(247,243,234,0.06)"
              strokeWidth="1"
            />
          ))}
          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#lineFill)" />}
          {/* Line */}
          <polyline
            points={polyPoints}
            fill="none"
            stroke="#C6A15B"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#12100D" stroke="#C6A15B" strokeWidth="2" />
              <title>{`${p.label}: ${p.count} leads`}</title>
            </g>
          ))}
          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              fill="#b7ac97"
            >
              {p.label}
            </text>
          ))}
        </svg>
      )}
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shared chart card shell
   ───────────────────────────────────────────────────────────── */
function ChartCard({
  title,
  subtitle,
  icon,
  meta,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-on-charcoal rounded-2xl border border-white/10 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brass/20 bg-brass/10 text-brass">
            {icon}
          </div>
          <div>
            <h3 className="font-display text-base text-ivory">{title}</h3>
            <p className="font-body text-[11px] text-sand">{subtitle}</p>
          </div>
        </div>
        {meta}
      </div>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-32 items-center justify-center text-center">
      <div>
        <BarChart3 className="mx-auto mb-2 h-6 w-6 text-sand/30" strokeWidth={1.5} />
        <p className="font-body text-[12px] text-sand/60">No data yet</p>
      </div>
    </div>
  );
}

/* A tiny client-side Link component so the page doesn't depend on next/link
   for an in-page anchor (avoids a top-of-file import that lint flags unused). */
function Link({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════
   Section 2 — GA4 + GSC Configuration
   ════════════════════════════════════════════════════════════ */
function AnalyticsConfig() {
  const [gaId, setGaId] = useState("");
  const [gscToken, setGscToken] = useState("");
  const [savingGa, setSavingGa] = useState(false);
  const [savingGsc, setSavingGsc] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cms?key=analytics-config", { cache: "no-store" });
      const data = await res.json();
      const v = data.value || { gaId: "", gscToken: "" };
      setGaId(v.gaId || "");
      setGscToken(v.gscToken || "");
    } catch {
      // leave empty defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const gaConnected = gaId.trim().startsWith("G-");
  const gscConnected = gscToken.trim().length > 0;

  const saveGa = async () => {
    setSavingGa(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "analytics-config",
          value: { gaId: gaId.trim(), gscToken: gscToken.trim() },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast("success", "Google Analytics ID saved. Tracking will activate on next page load.");
      } else {
        toast("error", "Failed to save GA ID.");
      }
    } catch {
      toast("error", "Network error — could not save GA ID.");
    } finally {
      setSavingGa(false);
    }
  };

  const saveGsc = async () => {
    setSavingGsc(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "analytics-config",
          value: { gaId: gaId.trim(), gscToken: gscToken.trim() },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast("success", "GSC verification token saved. The meta tag is now live on every page.");
      } else {
        toast("error", "Failed to save GSC token.");
      }
    } catch {
      toast("error", "Network error — could not save GSC token.");
    } finally {
      setSavingGsc(false);
    }
  };

  return (
    <section id="ga-config" className="space-y-6">
      <div>
        <p className="eyebrow text-brass mb-1.5">INTEGRATION</p>
        <h2 className="font-display text-2xl text-ivory">Analytics Configuration</h2>
        <p className="mt-1 font-body text-sm text-sand">
          Connect Google Analytics 4 and Search Console. Saved to the CMS — no env vars or redeploy needed.
        </p>
      </div>

      {/* Section A + B side-by-side on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Section A: GA4 ── */}
        <div className="glass-on-charcoal rounded-2xl border border-white/10 p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brass/30 bg-brass/15 text-brass">
                <TrendingUp className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ivory">Google Analytics 4</h3>
                <p className="font-body text-[12px] text-sand">
                  Track page views, sessions and conversions.
                </p>
              </div>
            </div>
            <StatusBadge connected={gaConnected} loading={loading} />
          </div>

          <label className="data-label mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-sand">
            GA Measurement ID
          </label>
          <input
            type="text"
            value={gaId}
            onChange={(e) => setGaId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            spellCheck={false}
            className="mb-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none"
          />
          <p className="mb-4 font-body text-[11px] leading-relaxed text-sand/80">
            Get this from <span className="text-ivory">Google Analytics → Admin → Data Streams → your stream → Measurement ID</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={saveGa}
              disabled={savingGa || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-brass px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:bg-brass-light disabled:opacity-50"
            >
              {savingGa ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
              ) : (
                <Save className="h-4 w-4" strokeWidth={1.75} />
              )}
              Save
            </button>
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-sm text-sand transition-colors hover:bg-white/5 hover:text-ivory"
            >
              Open Google Analytics
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* ── Section B: GSC ── */}
        <div className="glass-on-charcoal rounded-2xl border border-white/10 p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald/30 bg-emerald/15 text-emerald-300">
                <Search className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ivory">Google Search Console</h3>
                <p className="font-body text-[12px] text-sand">
                  Verify ownership so Google indexes your site.
                </p>
              </div>
            </div>
            <StatusBadge connected={gscConnected} loading={loading} />
          </div>

          <label className="data-label mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-sand">
            GSC Verification Token
          </label>
          <input
            type="text"
            value={gscToken}
            onChange={(e) => setGscToken(e.target.value)}
            placeholder="the content=... value from the HTML tag"
            spellCheck={false}
            className="mb-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none"
          />
          <p className="mb-4 font-body text-[11px] leading-relaxed text-sand/80">
            Get this from <span className="text-ivory">Google Search Console → Settings → Ownership verification → HTML tag → copy the content value</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={saveGsc}
              disabled={savingGsc || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-ivory transition-colors hover:brightness-110 disabled:opacity-50"
            >
              {savingGsc ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
              ) : (
                <Save className="h-4 w-4" strokeWidth={1.75} />
              )}
              Save
            </button>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-sm text-sand transition-colors hover:bg-white/5 hover:text-ivory"
            >
              Open Google Search Console
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Section D: Current Status ── */}
      <div className="glass-on-charcoal rounded-2xl border border-white/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-brass" strokeWidth={1.75} />
          <h3 className="font-display text-base text-ivory">Current Status</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatusRow
            label="Google Analytics 4"
            value={gaConnected ? "Tracking active" : "Not tracking"}
            active={gaConnected}
            hint={gaConnected ? `Measurement ID: ${gaId}` : "No Measurement ID set"}
          />
          <StatusRow
            label="Google Search Console"
            value={gscConnected ? "Verification tag live" : "Not verified"}
            active={gscConnected}
            hint={gscConnected ? `Token: ${gscToken.slice(0, 12)}…` : "No verification token set"}
          />
        </div>
      </div>

      {/* ── Section C: Connection Guide ── */}
      <ConnectionGuide />
    </section>
  );
}

function StatusBadge({ connected, loading }: { connected: boolean; loading: boolean }) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-sand">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading
      </span>
    );
  }
  if (connected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
        <Check className="h-3 w-3" strokeWidth={2.5} /> Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-red-300">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Not connected
    </span>
  );
}

function StatusRow({
  label,
  value,
  active,
  hint,
}: {
  label: string;
  value: string;
  active: boolean;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-sand">{label}</span>
        <span
          className={`h-2 w-2 rounded-full ${active ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-red-400"}`}
        />
      </div>
      <p className="mt-2 font-display text-base text-ivory">{value}</p>
      <p className="mt-0.5 font-mono text-[10px] text-sand/70 break-all">{hint}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section C — Connection Guide (numbered cards)
   ───────────────────────────────────────────────────────────── */
function ConnectionGuide() {
  return (
    <div className="glass-on-charcoal rounded-2xl border border-white/10 p-6">
      <div className="mb-5 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-brass" strokeWidth={1.75} />
        <h3 className="font-display text-base text-ivory">Connection Guide</h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* GA4 steps */}
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
            Google Analytics 4
          </p>
          <ol className="space-y-2.5">
            <GuideStep n={1} icon={<ExternalLink className="h-3.5 w-3.5" />}>
              Go to{" "}
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass hover:underline"
              >
                analytics.google.com
              </a>{" "}
              and sign in with your Google account.
            </GuideStep>
            <GuideStep n={2} icon={<HelpCircle className="h-3.5 w-3.5" />}>
              Click <span className="text-ivory">Admin</span> (gear icon, bottom-left) →{" "}
              <span className="text-ivory">Create Account</span> or pick an existing property.
            </GuideStep>
            <GuideStep n={3} icon={<Link2 className="h-3.5 w-3.5" />}>
              Under <span className="text-ivory">Data Streams</span>, add a <em>Web</em> stream and
              enter your site URL (e.g. https://l-axreedemo.vercel.app).
            </GuideStep>
            <GuideStep n={4} icon={<TrendingUp className="h-3.5 w-3.5" />}>
              Copy the <span className="text-ivory">Measurement ID</span> (format{" "}
              <code className="font-mono text-brass">G-XXXXXXXXXX</code>) shown at the top-right.
            </GuideStep>
            <GuideStep n={5} icon={<Save className="h-3.5 w-3.5" />}>
              Paste it in the GA input above and click <span className="text-ivory">Save</span>. The
              tracking script loads on the next page view — no redeploy needed.
            </GuideStep>
          </ol>
        </div>

        {/* GSC steps */}
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
            Google Search Console
          </p>
          <ol className="space-y-2.5">
            <GuideStep n={1} icon={<ExternalLink className="h-3.5 w-3.5" />}>
              Go to{" "}
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass hover:underline"
              >
                search.google.com/search-console
              </a>{" "}
              and sign in.
            </GuideStep>
            <GuideStep n={2} icon={<Globe className="h-3.5 w-3.5" />}>
              Click <span className="text-ivory">Add property</span> → choose{" "}
              <span className="text-ivory">URL prefix</span> → enter your full site URL.
            </GuideStep>
            <GuideStep n={3} icon={<HelpCircle className="h-3.5 w-3.5" />}>
              Under <span className="text-ivory">Ownership verification</span>, choose{" "}
              <span className="text-ivory">HTML tag</span>.
            </GuideStep>
            <GuideStep n={4} icon={<Search className="h-3.5 w-3.5" />}>
              Copy only the <code className="font-mono text-brass">content="…"</code> value from the
              tag (not the whole tag).
            </GuideStep>
            <GuideStep n={5} icon={<Save className="h-3.5 w-3.5" />}>
              Paste it in the GSC input above, click <span className="text-ivory">Save</span>, then
              back in GSC click <span className="text-ivory">Verify</span>.
            </GuideStep>
          </ol>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brass/20 bg-brass/5 p-4">
        <p className="font-body text-[12px] leading-relaxed text-sand">
          <span className="font-semibold text-brass">Tip:</span> Both values are stored in the CMS
          under the key <code className="font-mono text-brass">analytics-config</code>. The Google
          Analytics script and the GSC verification meta tag are injected by the root layout on every
          page — so saving here activates tracking site-wide instantly.
        </p>
      </div>
    </div>
  );
}

function GuideStep({
  n,
  icon,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass/15 font-mono text-[11px] font-semibold text-brass">
        {n}
      </span>
      <div className="flex-1">
        <div className="mb-0.5 text-brass/80">{icon}</div>
        <p className="font-body text-[12px] leading-relaxed text-sand">{children}</p>
      </div>
    </li>
  );
}
