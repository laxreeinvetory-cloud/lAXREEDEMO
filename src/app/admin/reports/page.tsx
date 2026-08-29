"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileBarChart,
  Download,
  Calendar,
  Loader2,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Users,
  Package,
  Eye,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type StatsResponse = {
  ok: boolean;
  stats?: {
    totalLeads: number;
    newLeads: number;
    totalBlogPosts: number;
    publishedPosts: number;
    leadsBySource: Record<string, number>;
  };
  recentLeads?: Array<{
    id: string;
    name: string;
    phone: string;
    hotel: string | null;
    source: string;
    status: string;
    refNo: string | null;
    createdAt: string;
  }>;
};

const SOURCE_LABELS: Record<string, string> = {
  "contact-page": "Contact Page",
  quotation: "Quotation",
  "catalogue-page": "Catalogue",
  "catalogue-discount": "Catalogue Discount",
  "dealer-application": "Dealer",
  "career-application": "Career",
  "enquiry-modal": "Enquiry",
};

function getMonthOptions(): { value: string; label: string }[] {
  const now = new Date();
  const opts: { value: string; label: string }[] = [];
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    opts.push({ value, label });
  }
  return opts;
}

export default function AdminReportsPage() {
  const monthOptions = getMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.value || "");
  const [stats, setStats] = useState<StatsResponse["stats"] | null>(null);
  const [recentLeads, setRecentLeads] = useState<NonNullable<StatsResponse["recentLeads"]>>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [downloading, setDownloading] = useState<"xlsx" | "pdf" | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data: StatsResponse = await res.json();
      if (data.ok && data.stats) {
        setStats(data.stats);
        setRecentLeads(data.recentLeads || []);
      }
    } catch (err) {
      console.error("[reports stats]", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Load lastGenerated from localStorage (per browser)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("laxree-report-last-generated");
      if (stored) setLastGenerated(new Date(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const selectedMonthLabel =
    monthOptions.find((m) => m.value === selectedMonth)?.label ||
    selectedMonth;

  const handleDownload = async (format: "xlsx" | "pdf") => {
    setDownloading(format);
    setToast(null);
    try {
      const url = `/api/admin/report?format=${format}&month=${encodeURIComponent(selectedMonth)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt.slice(0, 200)}`);
      }
      const blob = await res.blob();
      // Trigger browser download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      // Get filename from Content-Disposition header (fallback to default)
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="?([^";\n]+)"?/i);
      const ext = format === "xlsx" ? "xlsx" : "html";
      a.download = match?.[1] || `laxree-report-${selectedMonth}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      const now = new Date();
      setLastGenerated(now);
      try {
        localStorage.setItem("laxree-report-last-generated", now.toISOString());
      } catch {
        /* ignore */
      }
      setToast({
        kind: "ok",
        msg: `${format === "xlsx" ? "Excel" : "PDF (HTML)"} report downloaded for ${selectedMonthLabel}`,
      });
    } catch (err) {
      console.error("[report download]", err);
      setToast({
        kind: "err",
        msg: `Failed to generate report: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setDownloading(null);
      // Auto-dismiss toast after 4s
      setTimeout(() => setToast(null), 4000);
    }
  };

  const totalLeads = stats?.totalLeads ?? 0;
  const newLeads = stats?.newLeads ?? 0;
  const totalBlogPosts = stats?.totalBlogPosts ?? 0;
  const publishedPosts = stats?.publishedPosts ?? 0;
  const leadsBySource = stats?.leadsBySource || {};

  const sourceBreakdown = Object.entries(leadsBySource)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-brass/15 border border-brass/30 flex items-center justify-center">
              <FileBarChart className="h-5 w-5 text-brass" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sand">
              Admin · Reporting
            </span>
          </div>
          <h1 className="font-display text-3xl text-ivory mb-1">Monthly Reports</h1>
          <p className="font-body text-sm text-sand">
            Generate beautiful Excel &amp; PDF reports of your website&apos;s monthly performance.
          </p>
        </div>
        {lastGenerated && (
          <div className="glass-on-charcoal rounded-xl px-4 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={1.75} />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-sand">
                Last generated
              </p>
              <p className="font-body text-[12px] text-ivory">
                {lastGenerated.toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Month selector */}
      <div className="glass-on-charcoal rounded-2xl p-6 mb-8">
        <label className="data-label mb-2 flex items-center gap-2 text-[11px] text-sand">
          <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
          Select Month
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ivory focus:border-brass focus:outline-none"
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value} className="bg-charcoal text-ivory">
                {m.label}
              </option>
            ))}
          </select>
          <div className="rounded-xl bg-brass/10 border border-brass/20 px-4 py-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-brass">
              Reporting Period
            </span>
            <span className="font-display text-base text-ivory">{selectedMonthLabel}</span>
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => handleDownload("xlsx")}
          disabled={downloading !== null}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brass/20 to-brass/5 border border-brass/30 p-6 text-left transition-all hover:border-brass/60 hover:from-brass/30 hover:to-brass/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-brass/20 border border-brass/40 flex items-center justify-center">
              {downloading === "xlsx" ? (
                <Loader2 className="h-6 w-6 text-brass animate-spin" strokeWidth={1.75} />
              ) : (
                <FileSpreadsheet className="h-6 w-6 text-brass" strokeWidth={1.75} />
              )}
            </div>
            <Download className="h-4 w-4 text-brass/60 group-hover:text-brass transition-colors" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-lg text-ivory mb-1">Download Excel</h3>
          <p className="font-body text-[12px] text-sand mb-3">
            Full workbook with 7 sheets — Summary KPIs, Leads, pivots by source/status/day, Blog Posts &amp; Products.
          </p>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-brass">
            .xlsx file
          </span>
        </button>

        <button
          onClick={() => handleDownload("pdf")}
          disabled={downloading !== null}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/30 p-6 text-left transition-all hover:border-emerald/60 hover:from-emerald/30 hover:to-emerald/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald/20 border border-emerald/40 flex items-center justify-center">
              {downloading === "pdf" ? (
                <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" strokeWidth={1.75} />
              ) : (
                <FileText className="h-6 w-6 text-emerald-400" strokeWidth={1.75} />
              )}
            </div>
            <Download className="h-4 w-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-lg text-ivory mb-1">Download PDF (HTML)</h3>
          <p className="font-body text-[12px] text-sand mb-3">
            Print-ready branded report with KPI cards, charts &amp; tables. Open in browser, then &ldquo;Print → Save as PDF&rdquo;.
          </p>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            .html file · print to pdf
          </span>
        </button>
      </div>

      {/* Live stats preview */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-ivory">Live Snapshot</h2>
          <p className="font-body text-[12px] text-sand">
            Current totals (all-time) from <code className="font-mono text-brass">/api/admin/stats</code>
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loadingStats}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] text-sand hover:bg-white/10 hover:text-ivory flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loadingStats ? "animate-spin" : ""}`} strokeWidth={1.75} />
          Refresh
        </button>
      </div>

      {loadingStats ? (
        <div className="glass-on-charcoal rounded-2xl p-12 flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-brass animate-spin" strokeWidth={1.75} />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <KpiCard
              icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
              label="Total Leads"
              value={totalLeads}
              accent="brass"
            />
            <KpiCard
              icon={<TrendingUp className="h-4 w-4" strokeWidth={1.75} />}
              label="New Leads"
              value={newLeads}
              accent="emerald"
            />
            <KpiCard
              icon={<FileText className="h-4 w-4" strokeWidth={1.75} />}
              label="Blog Posts"
              value={totalBlogPosts}
              accent="brass"
            />
            <KpiCard
              icon={<Eye className="h-4 w-4" strokeWidth={1.75} />}
              label="Published"
              value={publishedPosts}
              accent="emerald"
            />
          </div>

          {/* Source breakdown + recent leads */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Source breakdown */}
            <div className="glass-on-charcoal rounded-2xl p-6">
              <h3 className="font-display text-base text-ivory mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-brass" strokeWidth={1.75} />
                Leads by Source
              </h3>
              {sourceBreakdown.length === 0 ? (
                <p className="font-body text-sm text-sand py-6 text-center">
                  No leads recorded yet.
                </p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                  {sourceBreakdown.map(([source, count]) => {
                    const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-body text-[13px] text-ivory">
                            {SOURCE_LABELS[source] || source}
                          </span>
                          <span className="font-mono text-[11px] text-sand">
                            {count} · {pct.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brass to-brass-light rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent leads */}
            <div className="glass-on-charcoal rounded-2xl p-6">
              <h3 className="font-display text-base text-ivory mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-brass" strokeWidth={1.75} />
                Recent Leads
              </h3>
              {recentLeads.length === 0 ? (
                <p className="font-body text-sm text-sand py-6 text-center">
                  No leads recorded yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-brass/15 border border-brass/30 flex items-center justify-center shrink-0">
                        <span className="font-display text-[12px] text-brass">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-ivory truncate">
                          {lead.name}
                        </p>
                        <p className="font-mono text-[10px] text-sand truncate">
                          {SOURCE_LABELS[lead.source] || lead.source} ·{" "}
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                          lead.status === "new"
                            ? "border-emerald/30 bg-emerald/10 text-emerald-400"
                            : lead.status === "contacted"
                              ? "border-brass/30 bg-brass/10 text-brass"
                              : "border-white/10 bg-white/5 text-sand"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer note */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <p className="font-body text-[12px] text-sand leading-relaxed">
          <span className="font-mono text-[10px] uppercase tracking-wider text-brass">
            Note
          </span>{" "}
          · Reports pull live data from the database (Leads, Blog Posts, Products, Site Content). If the DB is unreachable, blog &amp; product data falls back to the static catalogue so the report still renders. Page-view stats require Google Analytics to be connected — shown as &ldquo;N/A — connect GA&rdquo; until then.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`glass-on-charcoal rounded-xl px-5 py-4 max-w-sm shadow-2xl border ${
              toast.kind === "ok" ? "border-emerald/40" : "border-red-500/40"
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.kind === "ok" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              ) : (
                <Loader2 className="h-5 w-5 text-red-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              )}
              <p className="font-body text-[13px] text-ivory">{toast.msg}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: "brass" | "emerald";
}) {
  return (
    <div
      className={`glass-on-charcoal rounded-2xl p-5 border-l-4 ${
        accent === "brass" ? "border-l-brass" : "border-l-emerald-400"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.15em] ${
            accent === "brass" ? "text-brass" : "text-emerald-400"
          }`}
        >
          {label}
        </span>
        <span className={accent === "brass" ? "text-brass/70" : "text-emerald-400/70"}>
          {icon}
        </span>
      </div>
      <p className="font-display text-3xl text-ivory">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}
