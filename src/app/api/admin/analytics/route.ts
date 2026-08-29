import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStaticBlogPosts, getStaticProducts } from "@/lib/admin/static-fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   /api/admin/analytics
   Returns aggregated chart data for the admin analytics dashboard:
     - kpis:            { totalLeads, leadsThisMonth, leadsLastMonth, pctChange,
                          totalBlogPosts, totalProducts, pageViews }
     - leadsByDay:      [{ date, label, count }]   (last 30 days)
     - leadsBySource:   [{ key, label, count, color }] (horizontal bars)
     - leadsByStatus:   [{ key, label, count, color }] (donut)
     - leadsByMonth:    [{ label, count }]          (last 6 months, line chart)
   Every DB call is wrapped in try/catch so the endpoint degrades
   gracefully when the database is unavailable (Vercel serverless).
   ───────────────────────────────────────────────────────────── */

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  hotel: string | null;
  category: string | null;
  source: string;
  status: string;
  createdAt: Date | string;
};

const SOURCE_GROUPS: { keys: string[]; label: string; color: string }[] = [
  { keys: ["contact-page", "contact"], label: "Contact Page", color: "#C6A15B" },
  { keys: ["homepage-cta", "homepage"], label: "Homepage CTA", color: "#E4C989" },
  { keys: ["catalogue-discount", "catalogue-page", "catalogue"], label: "Catalogue", color: "#1E4638" },
  { keys: ["dealer-application", "dealer"], label: "Dealer", color: "#9C8B6E" },
  { keys: ["career-application", "career"], label: "Career", color: "#B3261E" },
  { keys: ["enquiry-modal", "enquiry"], label: "Enquiry", color: "#6B6455" },
];

const STATUS_GROUPS: { key: string; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#1E4638" },
  { key: "contacted", label: "Contacted", color: "#C6A15B" },
  { key: "quoted", label: "Quoted", color: "#E4C989" },
  { key: "closed", label: "Closed", color: "#6B6455" },
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(year: number, monthIdx: number): Date {
  return new Date(year, monthIdx, 1, 0, 0, 0, 0);
}

function fmtMonthShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short" });
}

function fmtDayLabel(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function groupLeadSource(source: string): string {
  const found = SOURCE_GROUPS.find((g) => g.keys.includes(source));
  return found ? found.label : "Other";
}

export async function GET(_req: NextRequest) {
  try {
    // ── Load analytics config from CMS (so we know if GA is connected) ──
    let gaConnected = false;
    let gscConnected = false;
    try {
      const row = await db.siteContent.findUnique({
        where: { key: "analytics-config" },
        select: { value: true },
      });
      if (row?.value) {
        const parsed = JSON.parse(row.value);
        gaConnected = typeof parsed?.gaId === "string" && parsed.gaId.startsWith("G-");
        gscConnected = typeof parsed?.gscToken === "string" && parsed.gscToken.trim().length > 0;
      }
    } catch {
      // ignore — leave both as false
    }

    // ── Fetch all leads (high count, no pagination) ──
    let leads: LeadRow[] = [];
    try {
      const dbLeads = await db.lead.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          hotel: true,
          category: true,
          source: true,
          status: true,
          createdAt: true,
        },
      });
      leads = dbLeads as unknown as LeadRow[];
    } catch (dbErr) {
      console.error("[ADMIN ANALYTICS leads]", dbErr);
    }

    // ── Blog + Product totals (DB → static fallback) ──
    let totalBlogPosts = 0;
    try {
      totalBlogPosts = await db.blogPost.count();
    } catch (e) {
      console.error("[ADMIN ANALYTICS blog]", e);
    }
    if (totalBlogPosts === 0) {
      try {
        totalBlogPosts = getStaticBlogPosts().length;
      } catch {
        totalBlogPosts = 0;
      }
    }

    let totalProducts = 0;
    try {
      totalProducts = await db.product.count();
    } catch (e) {
      console.error("[ADMIN ANALYTICS products]", e);
    }
    if (totalProducts === 0) {
      try {
        totalProducts = getStaticProducts().length;
      } catch {
        totalProducts = 0;
      }
    }

    // ── KPIs ──
    const now = new Date();
    const thisMonthStart = startOfMonth(now.getFullYear(), now.getMonth());
    const lastMonthStart = startOfMonth(
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
      now.getMonth() === 0 ? 11 : now.getMonth() - 1,
    );
    const lastMonthEnd = thisMonthStart;

    const leadsThisMonth = leads.filter((l) => {
      const d = new Date(l.createdAt);
      return d >= thisMonthStart && d <= now;
    }).length;
    const leadsLastMonth = leads.filter((l) => {
      const d = new Date(l.createdAt);
      return d >= lastMonthStart && d < lastMonthEnd;
    }).length;

    let pctChange = 0;
    if (leadsLastMonth > 0) {
      pctChange = Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100);
    } else if (leadsThisMonth > 0) {
      pctChange = 100; // No prior baseline — treat as +100 % growth
    }

    // ── Leads by day (last 30 days, oldest → newest) ──
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
      days.push({
        date: d.toISOString().slice(0, 10),
        label: fmtDayLabel(d),
        count: 0,
      });
    }
    const dayIndex = new Map<string, number>();
    days.forEach((d, i) => dayIndex.set(d.date, i));
    for (const lead of leads) {
      const d = startOfDay(new Date(lead.createdAt));
      const key = d.toISOString().slice(0, 10);
      const idx = dayIndex.get(key);
      if (idx !== undefined) days[idx].count += 1;
    }

    // ── Leads by source (grouped) ──
    const sourceCountMap: Record<string, number> = {};
    for (const lead of leads) {
      const label = groupLeadSource(lead.source);
      sourceCountMap[label] = (sourceCountMap[label] || 0) + 1;
    }
    const leadsBySource = SOURCE_GROUPS.map((g) => ({
      key: g.keys[0],
      label: g.label,
      color: g.color,
      count: sourceCountMap[g.label] || 0,
    }))
      // Append "Other" bucket only if non-zero
      .concat(
        (sourceCountMap["Other"] || 0) > 0
          ? [{ key: "other", label: "Other", color: "#3a3a3a", count: sourceCountMap["Other"] }]
          : [],
      )
      .sort((a, b) => b.count - a.count);

    // ── Leads by status (donut) ──
    const statusCountMap: Record<string, number> = {};
    for (const lead of leads) {
      const k = (lead.status || "new").toLowerCase();
      statusCountMap[k] = (statusCountMap[k] || 0) + 1;
    }
    const knownStatuses = new Set(STATUS_GROUPS.map((s) => s.key));
    let otherStatusCount = 0;
    const leadsByStatus = STATUS_GROUPS.map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      count: statusCountMap[s.key] || 0,
    }));
    for (const [k, c] of Object.entries(statusCountMap)) {
      if (!knownStatuses.has(k)) otherStatusCount += c;
    }
    if (otherStatusCount > 0) {
      leadsByStatus.push({
        key: "other",
        label: "Other",
        color: "#3a3a3a",
        count: otherStatusCount,
      });
    }

    // ── Leads by month (last 6 months, oldest → newest) ──
    const months: { label: string; key: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = startOfMonth(
        now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear(),
        ((now.getMonth() - i) % 12 + 12) % 12,
      );
      months.push({
        label: fmtMonthShort(d),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        count: 0,
      });
    }
    const monthIndex = new Map<string, number>();
    months.forEach((m, i) => monthIndex.set(m.key, i));
    for (const lead of leads) {
      const d = new Date(lead.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const idx = monthIndex.get(key);
      if (idx !== undefined) months[idx].count += 1;
    }

    return NextResponse.json({
      ok: true,
      kpis: {
        totalLeads: leads.length,
        leadsThisMonth,
        leadsLastMonth,
        pctChange,
        totalBlogPosts,
        totalProducts,
        pageViews: gaConnected ? "Connected" : null, // GA-API integration is out of scope
        gaConnected,
        gscConnected,
      },
      leadsByDay: days,
      leadsBySource,
      leadsByStatus,
      leadsByMonth: months.map((m) => ({ label: m.label, count: m.count })),
    });
  } catch (err) {
    console.error("[ADMIN ANALYTICS ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
