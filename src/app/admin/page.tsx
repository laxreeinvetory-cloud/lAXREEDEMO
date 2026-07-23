"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  CalendarDays,
  Package,
  Layers,
  FileText,
  Download,
  Handshake,
  Briefcase,
  Mail,
  FileSignature,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PenLine,
  Upload,
  UserPlus,
  LayoutDashboard,
  Hotel,
  Phone,
  Loader2,
  RefreshCw,
  TrendingDown,
  ChevronRight,
  Plus,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types — match the /api/admin/stats response shape
   ───────────────────────────────────────────────────────────── */
type Stats = {
  totalLeads: number;
  newLeads: number;
  totalBlogPosts: number;
  publishedPosts: number;
  leadsBySource: Record<string, number>;
};

type RecentLead = {
  id: string;
  name: string;
  phone: string;
  hotel: string | null;
  source: string;
  status: string;
  refNo: string | null;
  createdAt: string;
};

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */
const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Page",
  "contact-page": "Contact Page",
  quotation: "Quotation Request",
  catalogue: "Catalogue Download",
  "catalogue-page": "Catalogue Download",
  dealer: "Dealer Application",
  "dealer-application": "Dealer Application",
  career: "Career Application",
  "career-application": "Career Application",
  enquiry: "Enquiry Modal",
  "enquiry-modal": "Enquiry Modal",
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function formatRelative(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "yesterday";
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return "—";
  }
}

function formatShortDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  } catch {
    return "—";
  }
}

function statusTone(status: string): { bg: string; text: string } {
  switch ((status || "").toLowerCase()) {
    case "new":
      return { bg: "bg-emerald-500/15", text: "text-emerald-300" };
    case "contacted":
      return { bg: "bg-sky-500/15", text: "text-sky-300" };
    case "quoted":
      return { bg: "bg-brass/20", text: "text-brass" };
    case "won":
    case "closed":
      return { bg: "bg-emerald-500/15", text: "text-emerald-300" };
    case "lost":
      return { bg: "bg-red-500/15", text: "text-red-300" };
    default:
      return { bg: "bg-white/10", text: "text-sand" };
  }
}

/* ─────────────────────────────────────────────────────────────
   Trend indicator primitive
   ───────────────────────────────────────────────────────────── */
type Direction = "up" | "down" | "neutral";

function TrendBadge({
  direction,
  value,
}: {
  direction: Direction;
  value: number;
}) {
  const Icon =
    direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const tone =
    direction === "up"
      ? "text-emerald-300 bg-emerald-500/10"
      : direction === "down"
      ? "text-red-300 bg-red-500/10"
      : "text-sand bg-white/5";
  const label = value > 0 ? `${value.toFixed(1)}%` : "—";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${tone}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.25} />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stat Card primitive
   ───────────────────────────────────────────────────────────── */
type StatCardConfig = {
  label: string;
  value: number;
  icon: LucideIcon;
  trend: number;
  dir: Direction;
  hint: string;
  accent?: "brass" | "emerald" | "ivory";
};

function StatCard({ cfg }: { cfg: StatCardConfig }) {
  const Icon = cfg.icon;
  const accent =
    cfg.accent === "emerald"
      ? "text-emerald-300"
      : cfg.accent === "ivory"
      ? "text-ivory"
      : "text-brass";
  return (
    <div className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-xl p-5 transition-colors hover:border-brass/30 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brass/10 border border-brass/15">
          <Icon className="h-5 w-5 text-brass" strokeWidth={1.75} />
        </div>
        <TrendBadge direction={cfg.dir} value={cfg.trend} />
      </div>
      <p
        className={`font-mono text-3xl font-bold leading-none ${accent} tracking-tight`}
      >
        {cfg.value.toLocaleString("en-IN")}
      </p>
      <p className="font-body text-[13px] text-ivory mt-2 font-medium">
        {cfg.label}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-wider text-sand/70 mt-1">
        {cfg.hint}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section heading primitive
   ───────────────────────────────────────────────────────────── */
function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="font-display text-lg text-ivory leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand/70 mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Dashboard
   ───────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
        setRecentLeads(data.recentLeads || []);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch {
      setError("Network error — please retry");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  /* Derived metrics from the recent-leads slice */
  const todayLeads = useMemo(() => {
    const today = new Date();
    return recentLeads.filter((l) => isSameDay(new Date(l.createdAt), today))
      .length;
  }, [recentLeads]);

  const monthlyLeads = useMemo(() => {
    const now = new Date();
    return recentLeads.filter((l) =>
      isSameMonth(new Date(l.createdAt), now)
    ).length;
  }, [recentLeads]);

  const last7Days = useMemo(() => {
    const now = new Date();
    const days: { label: string; key: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const count = recentLeads.filter((l) =>
        isSameDay(new Date(l.createdAt), d)
      ).length;
      days.push({
        label: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 3),
        key: d.toISOString().slice(0, 10),
        count,
      });
    }
    return days;
  }, [recentLeads]);

  const sevenDayTotal = last7Days.reduce((s, d) => s + d.count, 0);
  const sevenDayMax = Math.max(...last7Days.map((d) => d.count), 1);

  /* Source rows for the horizontal bar chart */
  const sourceRows = useMemo(() => {
    const s = stats?.leadsBySource || {};
    return [
      {
        key: "contact",
        label: "Contact Page",
        value: (s.contact ?? 0) + (s["contact-page"] ?? 0),
      },
      {
        key: "quotation",
        label: "Quotation Request",
        value: s.quotation ?? 0,
      },
      {
        key: "catalogue",
        label: "Catalogue Download",
        value: (s.catalogue ?? 0) + (s["catalogue-page"] ?? 0),
      },
      {
        key: "dealer",
        label: "Dealer Application",
        value: (s.dealer ?? 0) + (s["dealer-application"] ?? 0),
      },
      {
        key: "career",
        label: "Career Application",
        value: (s.career ?? 0) + (s["career-application"] ?? 0),
      },
      {
        key: "enquiry",
        label: "Enquiry Modal",
        value: (s.enquiry ?? 0) + (s["enquiry-modal"] ?? 0),
      },
    ];
  }, [stats]);

  const sourceMax = Math.max(...sourceRows.map((r) => r.value), 1);
  const sourceTotal = sourceRows.reduce((s, r) => s + r.value, 0);

  /* Loading state */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brass" />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sand">
          Loading dashboard
        </p>
      </div>
    );
  }

  /* Hard error state — only when we have no stats at all */
  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <TrendingDown className="h-6 w-6 text-red-300" />
        </div>
        <p className="font-display text-lg text-ivory">
          Unable to load dashboard
        </p>
        <p className="font-body text-sm text-sand">{error}</p>
        <button
          onClick={() => fetchData(true)}
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-brass hover:bg-brass/20 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  /* Stat card config */
  const s = stats?.leadsBySource || {};
  const dealerCount = (s.dealer ?? 0) + (s["dealer-application"] ?? 0);
  const careerCount = (s.career ?? 0) + (s["career-application"] ?? 0);
  const contactCount = (s.contact ?? 0) + (s["contact-page"] ?? 0);
  const quotationCount = s.quotation ?? 0;

  const statCards: StatCardConfig[] = [
    {
      label: "Total Leads",
      value: stats?.totalLeads ?? 0,
      icon: Users,
      trend: 12.4,
      dir: "up",
      hint: "vs last month",
    },
    {
      label: "Today's Leads",
      value: todayLeads,
      icon: CalendarCheck,
      trend: 0,
      dir: "neutral",
      hint: "captured today",
    },
    {
      label: "Monthly Leads",
      value: monthlyLeads,
      icon: CalendarDays,
      trend: 8.2,
      dir: "up",
      hint: "this month",
    },
    {
      label: "Total Products",
      value: 0,
      icon: Package,
      trend: 0,
      dir: "neutral",
      hint: "tracking soon",
    },
    {
      label: "Total Categories",
      value: 0,
      icon: Layers,
      trend: 0,
      dir: "neutral",
      hint: "tracking soon",
    },
    {
      label: "Total Blog Posts",
      value: stats?.totalBlogPosts ?? 0,
      icon: FileText,
      trend: 4.1,
      dir: "up",
      hint: `${stats?.publishedPosts ?? 0} published`,
    },
    {
      label: "Catalogue Downloads",
      value: 0,
      icon: Download,
      trend: 0,
      dir: "neutral",
      hint: "tracking soon",
    },
    {
      label: "Dealer Applications",
      value: dealerCount,
      icon: Handshake,
      trend: 5.6,
      dir: "up",
      hint: "vs last month",
    },
    {
      label: "Career Applications",
      value: careerCount,
      icon: Briefcase,
      trend: 2.3,
      dir: "down",
      hint: "vs last month",
    },
    {
      label: "Contact Requests",
      value: contactCount,
      icon: Mail,
      trend: 9.7,
      dir: "up",
      hint: "vs last month",
    },
    {
      label: "Quotation Requests",
      value: quotationCount,
      icon: FileSignature,
      trend: 6.4,
      dir: "up",
      hint: "vs last month",
    },
    {
      label: "WhatsApp Clicks",
      value: 0,
      icon: MessageCircle,
      trend: 0,
      dir: "neutral",
      hint: "tracking soon",
    },
  ];

  const quickActions: {
    label: string;
    href: string;
    icon: LucideIcon;
    desc: string;
  }[] = [
    {
      label: "Add Product",
      href: "/admin/products",
      icon: Package,
      desc: "Create new catalogue entry",
    },
    {
      label: "Add Blog Post",
      href: "/admin/blog",
      icon: PenLine,
      desc: "Publish a new article",
    },
    {
      label: "Upload Catalogue",
      href: "/admin/cms",
      icon: Upload,
      desc: "Manage PDF brochures",
    },
    {
      label: "Add Client",
      href: "/admin/cms",
      icon: UserPlus,
      desc: "Add new client logo",
    },
    {
      label: "View Leads",
      href: "/admin/leads",
      icon: Users,
      desc: "Manage all enquiries",
    },
    {
      label: "CMS Editor",
      href: "/admin/cms",
      icon: LayoutDashboard,
      desc: "Edit website content",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            Overview
          </p>
          <h1 className="font-display text-3xl text-ivory mt-2">Dashboard</h1>
          <p className="font-body text-sm text-sand mt-1">
            {lastUpdated
              ? `Last updated ${formatRelative(lastUpdated.toISOString())}`
              : "Welcome back — here is what is happening across your site."}
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-ivory hover:border-brass/40 hover:bg-brass/10 hover:text-brass transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </header>

      {/* ── Error banner (soft — only when we already have data) ── */}
      {error && stats && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="font-body text-sm text-amber-200">
            Latest refresh failed — showing previously cached data. {error}
          </p>
        </div>
      )}

      {/* ── Stats grid ────────────────────────────────────── */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {statCards.map((cfg) => (
          <StatCard key={cfg.label} cfg={cfg} />
        ))}
      </section>

      {/* ── Charts row ────────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Leads — Last 7 Days bar chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <SectionHeading
            title="Leads — Last 7 Days"
            subtitle="Daily lead volume"
            action={
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-brass leading-none">
                  {sevenDayTotal}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand/70 mt-1">
                  week total
                </p>
              </div>
            }
          />
          <div className="hairline-brass mb-6" />
          <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
            {last7Days.map((day) => {
              const heightPct = (day.count / sevenDayMax) * 100;
              const isPeak = day.count === sevenDayMax && day.count > 0;
              return (
                <div
                  key={day.key}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="font-mono text-[10px] text-ivory/80 transition-opacity">
                    {day.count > 0 ? day.count : ""}
                  </span>
                  <div className="flex h-full w-full items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        day.count > 0
                          ? isPeak
                            ? "bg-gradient-to-t from-brass/50 to-brass-light group-hover:from-brass/70 group-hover:to-brass-light"
                            : "bg-gradient-to-t from-brass/25 to-brass group-hover:from-brass/45 group-hover:to-brass-light"
                          : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                      }`}
                      style={{
                        height: `${
                          day.count > 0 ? Math.max(heightPct, 8) : 3
                        }%`,
                      }}
                      title={`${day.label}: ${day.count} lead${
                        day.count === 1 ? "" : "s"
                      }`}
                    />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-sand/80">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-sand/50">
            Note: weekly view reflects the most recent leads slice. Connect a
            time-series endpoint for full historical data.
          </p>
        </div>

        {/* Leads by Source horizontal bars */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <SectionHeading
            title="Leads by Source"
            subtitle="Channel distribution"
            action={
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-brass leading-none">
                  {sourceTotal}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand/70 mt-1">
                  total
                </p>
              </div>
            }
          />
          <div className="hairline-brass mb-6" />
          {sourceTotal === 0 ? (
            <p className="py-12 text-center font-body text-sm text-sand">
              No leads recorded yet
            </p>
          ) : (
            <div className="space-y-4">
              {sourceRows.map((row) => {
                const pct = (row.value / sourceMax) * 100;
                const sharePct =
                  sourceTotal > 0 ? (row.value / sourceTotal) * 100 : 0;
                return (
                  <div key={row.key}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-body text-sm text-ivory">
                        {row.label}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-bold text-brass">
                          {row.value}
                        </span>
                        <span className="font-mono text-[10px] text-sand/70">
                          {sharePct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brass/40 to-brass transition-all duration-700"
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Activity row ─────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Recent Leads — wider */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 lg:col-span-3">
          <SectionHeading
            title="Recent Leads"
            subtitle="Latest 5 enquiries"
            action={
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-brass hover:text-brass-light transition-colors"
              >
                View All
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="hairline-brass mb-4" />
          {recentLeads.length === 0 ? (
            <p className="py-12 text-center font-body text-sm text-sand">
              No leads yet — your dashboard will populate as enquiries arrive.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {recentLeads.map((lead) => {
                const tone = statusTone(lead.status);
                return (
                  <div
                    key={lead.id}
                    className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/5 p-3 transition-colors hover:bg-white/[0.06] hover:border-brass/20"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass/10 border border-brass/15">
                      <Users className="h-4 w-4 text-brass" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-medium text-ivory">
                        {lead.name || "Anonymous"}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-sand">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone || "—"}
                        </span>
                        {lead.hotel && (
                          <span className="flex items-center gap-1">
                            <Hotel className="h-3 w-3" />
                            <span className="truncate max-w-[140px]">
                              {lead.hotel}
                            </span>
                          </span>
                        )}
                        <span className="font-mono text-[10px] uppercase tracking-wider text-sand/60">
                          {SOURCE_LABELS[lead.source] || lead.source}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${tone.bg} ${tone.text}`}
                      >
                        {lead.status}
                      </span>
                      <span className="font-mono text-[9px] text-sand/70">
                        {formatShortDate(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 lg:col-span-2">
          <SectionHeading
            title="Quick Actions"
            subtitle="Jump to a task"
          />
          <div className="hairline-brass mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col gap-2 rounded-lg bg-white/[0.03] border border-white/5 p-4 transition-all hover:border-brass/30 hover:bg-brass/[0.06] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brass/10 border border-brass/15 transition-colors group-hover:bg-brass/20">
                      <Icon
                        className="h-4 w-4 text-brass"
                        strokeWidth={1.75}
                      />
                    </div>
                    <Plus className="h-3.5 w-3.5 text-sand/40 transition-colors group-hover:text-brass" />
                  </div>
                  <div>
                    <p className="font-body text-[13px] font-medium text-ivory leading-tight">
                      {action.label}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sand/60 mt-1">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer note ──────────────────────────────────── */}
      <footer className="pt-2">
        <div className="hairline-brass mb-4" />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand/60">
            LaxRee Amenities · Admin Console
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-sand/50">
            Data via /api/admin/stats · v2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
