import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";
import {
  getStaticProducts,
  getStaticBlogPosts,
} from "@/lib/admin/static-fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────
// Brand palette
// ─────────────────────────────────────────────────────────────
const BRAND = {
  charcoal: "FF1A1A1A",
  brass: "FFC6A15B",
  brassLight: "FFD9BD7E",
  ivory: "FFF5F1E8",
  ivoryAlt: "FFFBF8F1",
  ink: "FF1F1F1F",
  sand: "FF9C8B6E",
  emerald: "FF3D6B5C",
  white: "FFFFFFFF",
  borderLight: "FFE5DCC6",
};

const SOURCE_LABELS: Record<string, string> = {
  "contact-page": "Contact Page",
  quotation: "Quotation",
  "catalogue-page": "Catalogue Discount",
  "catalogue-discount": "Catalogue Discount",
  "dealer-application": "Dealer",
  dealer: "Dealer",
  "career-application": "Career",
  career: "Career",
  "enquiry-modal": "Enquiry Modal",
  enquiry: "Enquiry Modal",
  homepage: "Homepage CTA",
  "homepage-cta": "Homepage CTA",
  contact: "Contact Page",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  closed: "Closed",
};

const TOP_PAGES = [
  { path: "/", title: "Homepage" },
  { path: "/products", title: "Products" },
  { path: "/about-us", title: "About Us" },
  { path: "/blog", title: "Blog" },
  { path: "/contact-us", title: "Contact Us" },
  { path: "/catalogue", title: "Catalogue" },
];

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  hotel: string | null;
  category: string | null;
  source: string;
  status: string;
  message: string | null;
  refNo: string | null;
  createdAt: Date | string;
};

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
  createdAt: Date | string;
};

type ProductRow = {
  id: string;
  model: string;
  name: string;
  category: string;
  featured: boolean;
  published: boolean;
  price: string;
  createdAt: Date | string;
};

type ReportData = {
  monthLabel: string;
  monthKey: string;
  monthStart: Date;
  monthEnd: Date;
  generatedAt: Date;

  leads: LeadRow[];
  totalLeads: number;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
  leadsByDay: { day: string; count: number; date: string }[];
  topCategories: { category: string; count: number }[];

  blogPosts: BlogRow[];
  totalBlogPosts: number;
  publishedBlogPosts: number;
  unpublishedBlogPosts: number;
  blogPostsThisMonth: number;

  products: ProductRow[];
  totalProducts: number;
  productsByCategory: { category: string; count: number }[];
  featuredProducts: number;

  site: {
    clientLogos: number;
    imageOverrides: number;
    totalPageViews: string;
    topPages: { path: string; title: string }[];
  };
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function parseMonth(monthParam: string | null): {
  monthStart: Date;
  monthEnd: Date;
  monthKey: string;
  monthLabel: string;
} {
  const now = new Date();
  let year = now.getFullYear();
  let monthIdx = now.getMonth();

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    if (y >= 2000 && y <= 2100 && m >= 1 && m <= 12) {
      year = y;
      monthIdx = m - 1;
    }
  } else {
    // Default: previous month
    monthIdx -= 1;
    if (monthIdx < 0) {
      monthIdx = 11;
      year -= 1;
    }
  }

  const monthStart = new Date(year, monthIdx, 1, 0, 0, 0, 0);
  const monthEnd = new Date(year, monthIdx + 1, 1, 0, 0, 0, 0);
  const monthKey = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
  const monthLabel = monthStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return { monthStart, monthEnd, monthKey, monthLabel };
}

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const k = keyFn(item);
    if (!k) continue;
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

function buildDailyLeadCounts(leads: LeadRow[], monthStart: Date, monthEnd: Date) {
  const daysInMonth = Math.round(
    (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24),
  );
  const out: { day: string; count: number; date: string }[] = [];
  for (let i = 0; i < daysInMonth; i++) {
    const d = new Date(monthStart);
    d.setDate(monthStart.getDate() + i);
    out.push({
      day: `${String(d.getDate()).padStart(2, "0")}`,
      count: 0,
      date: d.toISOString().slice(0, 10),
    });
  }
  for (const lead of leads) {
    const d = new Date(lead.createdAt);
    if (d >= monthStart && d < monthEnd) {
      const dayIdx = d.getDate() - 1;
      if (out[dayIdx]) out[dayIdx].count += 1;
    }
  }
  return out;
}

function safeNumber(val: unknown): number {
  return typeof val === "number" && Number.isFinite(val) ? val : 0;
}

async function gatherReportData(monthParam: string | null): Promise<ReportData> {
  const { monthStart, monthEnd, monthKey, monthLabel } = parseMonth(monthParam);
  const generatedAt = new Date();

  // ── Leads (DB with try/catch fallback to empty) ──
  let leads: LeadRow[] = [];
  try {
    const dbLeads = await db.lead.findMany({
      where: { createdAt: { gte: monthStart, lt: monthEnd } },
      orderBy: { createdAt: "desc" },
    });
    leads = dbLeads.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      email: l.email ?? null,
      hotel: l.hotel ?? null,
      category: l.category ?? null,
      source: l.source,
      status: l.status,
      message: l.message ?? null,
      refNo: l.refNo ?? null,
      createdAt: l.createdAt,
    }));
  } catch (err) {
    console.error("[ADMIN REPORT leads]", err);
  }

  // ── Blog posts (DB → static fallback) ──
  let blogPosts: BlogRow[] = [];
  try {
    const dbPosts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    if (dbPosts.length > 0) {
      blogPosts = dbPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        author: p.author,
        date: p.date,
        readTime: p.readTime,
        published: p.published,
        createdAt: p.createdAt,
      }));
    }
  } catch (err) {
    console.error("[ADMIN REPORT blogPosts]", err);
  }
  if (blogPosts.length === 0) {
    const staticPosts = getStaticBlogPosts();
    blogPosts = staticPosts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      author: p.author,
      date: p.date,
      readTime: p.readTime,
      published: p.published,
      createdAt: p.createdAt,
    }));
  }

  // ── Products (DB → static fallback) ──
  let products: ProductRow[] = [];
  try {
    const dbProducts = await db.product.findMany({ orderBy: { createdAt: "desc" } });
    if (dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        model: p.model,
        name: p.name,
        category: p.category,
        featured: p.featured,
        published: p.published,
        price: p.price,
        createdAt: p.createdAt,
      }));
    }
  } catch (err) {
    console.error("[ADMIN REPORT products]", err);
  }
  if (products.length === 0) {
    const staticProducts = getStaticProducts();
    products = staticProducts.map((p) => ({
      id: p.id,
      model: p.model,
      name: p.name,
      category: p.category,
      featured: p.featured,
      published: p.published,
      price: p.price,
      createdAt: new Date(p.createdAt),
    }));
  }

  // ── Site content (client-logos, images overrides) ──
  let clientLogos = 0;
  let imageOverrides = 0;
  try {
    const [clRow, imgRow] = await Promise.all([
      db.siteContent.findUnique({ where: { key: "client-logos" } }),
      db.siteContent.findUnique({ where: { key: "images" } }),
    ]);
    if (clRow?.value) {
      try {
        const parsed = JSON.parse(clRow.value);
        clientLogos = Array.isArray(parsed) ? parsed.length : safeNumber(parsed?.count);
      } catch {
        clientLogos = 0;
      }
    }
    if (imgRow?.value) {
      try {
        const parsed = JSON.parse(imgRow.value);
        if (Array.isArray(parsed)) {
          imageOverrides = parsed.length;
        } else if (typeof parsed === "object" && parsed !== null) {
          imageOverrides = Object.keys(parsed).length;
        } else {
          imageOverrides = 0;
        }
      } catch {
        imageOverrides = 0;
      }
    }
  } catch (err) {
    console.error("[ADMIN REPORT siteContent]", err);
  }

  // ── Aggregations ──
  const leadsBySource = countBy(leads, (l) => l.source);
  const leadsByStatus = countBy(leads, (l) => l.status);
  const leadsByDay = buildDailyLeadCounts(leads, monthStart, monthEnd);

  const catCounts = countBy(
    leads.filter((l) => l.category),
    (l) => l.category as string,
  );
  const topCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  const totalBlogPosts = blogPosts.length;
  const publishedBlogPosts = blogPosts.filter((p) => p.published).length;
  const unpublishedBlogPosts = totalBlogPosts - publishedBlogPosts;
  const blogPostsThisMonth = blogPosts.filter((p) => {
    const d = new Date(p.createdAt);
    return d >= monthStart && d < monthEnd;
  }).length;

  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const productsByCategoryMap = countBy(products, (p) => p.category || "Uncategorised");
  const productsByCategory = Object.entries(productsByCategoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  return {
    monthLabel,
    monthKey,
    monthStart,
    monthEnd,
    generatedAt,
    leads,
    totalLeads: leads.length,
    leadsBySource,
    leadsByStatus,
    leadsByDay,
    topCategories,
    blogPosts,
    totalBlogPosts,
    publishedBlogPosts,
    unpublishedBlogPosts,
    blogPostsThisMonth,
    products,
    totalProducts,
    productsByCategory,
    featuredProducts,
    site: {
      clientLogos,
      imageOverrides,
      totalPageViews: "N/A — connect GA",
      topPages: TOP_PAGES,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Excel styling helpers
// ─────────────────────────────────────────────────────────────
function styleTitleRow(ws: ExcelJS.Worksheet, text: string, colCount: number) {
  ws.mergeCells(1, 1, 1, colCount);
  const cell = ws.getCell(1, 1);
  cell.value = text;
  cell.font = { name: "Calibri", size: 18, bold: true, color: { argb: BRAND.white } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.charcoal } };
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 36;
}

function styleSubtitleRow(
  ws: ExcelJS.Worksheet,
  text: string,
  colCount: number,
  rowIdx = 2,
) {
  ws.mergeCells(rowIdx, 1, rowIdx, colCount);
  const cell = ws.getCell(rowIdx, 1);
  cell.value = text;
  cell.font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.charcoal } };
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(rowIdx).height = 20;
}

function styleHeaderRow(ws: ExcelJS.Worksheet, rowIdx: number, colCount: number) {
  for (let c = 1; c <= colCount; c++) {
    const cell = ws.getCell(rowIdx, c);
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    cell.border = {
      top: { style: "thin", color: { argb: BRAND.brass } },
      bottom: { style: "thin", color: { argb: BRAND.brass } },
      left: { style: "thin", color: { argb: BRAND.brass } },
      right: { style: "thin", color: { argb: BRAND.brass } },
    };
  }
  ws.getRow(rowIdx).height = 24;
}

function styleDataRows(
  ws: ExcelJS.Worksheet,
  startRow: number,
  endRow: number,
  colCount: number,
) {
  for (let r = startRow; r <= endRow; r++) {
    const isAlt = (r - startRow) % 2 === 1;
    for (let c = 1; c <= colCount; c++) {
      const cell = ws.getCell(r, c);
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND.ink } };
      if (isAlt) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: BRAND.ivoryAlt },
        };
      }
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      cell.border = {
        bottom: { style: "thin", color: { argb: BRAND.borderLight } },
      };
    }
    ws.getRow(r).height = 18;
  }
}

function labelFor(value: string, map: Record<string, string>): string {
  return map[value] || value || "—";
}

// ─────────────────────────────────────────────────────────────
// Build Excel workbook
// ─────────────────────────────────────────────────────────────
async function buildExcel(data: ReportData): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "LaxRee Amenities Admin";
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = `LaxRee Amenities — Monthly Report — ${data.monthLabel}`;

  // ═══════════════════════════════════════════════════════════
  // SHEET 1: Summary (KPI cards + pivots)
  // ═══════════════════════════════════════════════════════════
  const ws = wb.addWorksheet("Summary", {
    properties: { tabColor: { argb: BRAND.brass } },
    views: [{ showGridLines: false }],
  });
  ws.columns = [
    { width: 4 },
    { width: 32 },
    { width: 18 },
    { width: 4 },
    { width: 32 },
    { width: 18 },
  ];

  styleTitleRow(ws, "LaxRee Amenities — Monthly Report", 6);
  styleSubtitleRow(
    ws,
    `${data.monthLabel}   •   Generated ${data.generatedAt.toLocaleString("en-IN")}`,
    6,
    2,
  );

  const kpis: { label: string; value: string | number; accent: string }[] = [
    { label: "Total Leads", value: data.totalLeads, accent: BRAND.brass },
    { label: "Blog Posts", value: data.totalBlogPosts, accent: BRAND.emerald },
    { label: "Total Products", value: data.totalProducts, accent: BRAND.brass },
    { label: "Featured Products", value: data.featuredProducts, accent: BRAND.emerald },
    { label: "Published Posts", value: data.publishedBlogPosts, accent: BRAND.brass },
    { label: "Client Logos", value: data.site.clientLogos, accent: BRAND.emerald },
    { label: "Image Overrides", value: data.site.imageOverrides, accent: BRAND.brass },
    { label: "Posts This Month", value: data.blogPostsThisMonth, accent: BRAND.emerald },
  ];

  let kpiRow = 4;
  for (let i = 0; i < kpis.length; i += 2) {
    const pair = kpis.slice(i, i + 2);
    for (let j = 0; j < pair.length; j++) {
      const kpi = pair[j];
      const labelCol = j === 0 ? 2 : 5;
      const valueCol = j === 0 ? 3 : 6;

      const labelCell = ws.getCell(kpiRow, labelCol);
      labelCell.value = kpi.label;
      labelCell.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRAND.sand } };
      labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.ivory } };
      labelCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

      const valueCell = ws.getCell(kpiRow, valueCol);
      valueCell.value = kpi.value;
      valueCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: kpi.accent } };
      valueCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.ivory } };
      valueCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };

      const border = {
        top: { style: "thin" as const, color: { argb: BRAND.borderLight } },
        bottom: { style: "thin" as const, color: { argb: BRAND.borderLight } },
        left: { style: "thin" as const, color: { argb: BRAND.borderLight } },
        right: { style: "thin" as const, color: { argb: BRAND.borderLight } },
      };
      labelCell.border = border;
      valueCell.border = border;
    }
    ws.getRow(kpiRow).height = 32;
    kpiRow++;
    ws.getRow(kpiRow).height = 6; // spacer
    kpiRow++;
  }

  kpiRow += 1;

  // Leads by Source pivot (cols 2..3)
  ws.getCell(kpiRow, 2).value = "Leads by Source";
  ws.getCell(kpiRow, 2).font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND.charcoal } };
  kpiRow++;
  ws.getCell(kpiRow, 2).value = "Source";
  ws.getCell(kpiRow, 3).value = "Count";
  for (let c = 2; c <= 3; c++) {
    const cell = ws.getCell(kpiRow, c);
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  }
  kpiRow++;
  const sourceEntries = Object.entries(data.leadsBySource).sort((a, b) => b[1] - a[1]);
  const sourceStart = kpiRow;
  for (const [src, count] of sourceEntries) {
    ws.getCell(kpiRow, 2).value = labelFor(src, SOURCE_LABELS);
    ws.getCell(kpiRow, 3).value = count;
    kpiRow++;
  }
  if (sourceEntries.length === 0) {
    ws.getCell(kpiRow, 2).value = "No leads this month";
    ws.getCell(kpiRow, 3).value = 0;
    kpiRow++;
  }
  for (let r = sourceStart; r < kpiRow; r++) {
    for (let c = 2; c <= 3; c++) {
      const cell = ws.getCell(r, c);
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND.ink } };
      if ((r - sourceStart) % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.ivoryAlt } };
      }
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      cell.border = { bottom: { style: "thin", color: { argb: BRAND.borderLight } } };
    }
  }

  // Leads by Status pivot (cols 5..6), starts alongside source pivot
  let statusRow = sourceStart - 1;
  ws.getCell(statusRow, 5).value = "Leads by Status";
  ws.getCell(statusRow, 5).font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND.charcoal } };
  statusRow++;
  ws.getCell(statusRow, 5).value = "Status";
  ws.getCell(statusRow, 6).value = "Count";
  for (let c = 5; c <= 6; c++) {
    const cell = ws.getCell(statusRow, c);
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  }
  statusRow++;
  const statusEntries = Object.entries(data.leadsByStatus).sort((a, b) => b[1] - a[1]);
  const statusStart = statusRow;
  for (const [s, count] of statusEntries) {
    ws.getCell(statusRow, 5).value = labelFor(s, STATUS_LABELS);
    ws.getCell(statusRow, 6).value = count;
    statusRow++;
  }
  if (statusEntries.length === 0) {
    ws.getCell(statusRow, 5).value = "No leads this month";
    ws.getCell(statusRow, 6).value = 0;
    statusRow++;
  }
  for (let r = statusStart; r < statusRow; r++) {
    for (let c = 5; c <= 6; c++) {
      const cell = ws.getCell(r, c);
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND.ink } };
      if ((r - statusStart) % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.ivoryAlt } };
      }
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      cell.border = { bottom: { style: "thin", color: { argb: BRAND.borderLight } } };
    }
  }

  kpiRow = Math.max(kpiRow, statusRow) + 2;

  // Top categories pivot
  ws.getCell(kpiRow, 2).value = "Top 5 Categories Requested";
  ws.getCell(kpiRow, 2).font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND.charcoal } };
  kpiRow++;
  ws.getCell(kpiRow, 2).value = "Category";
  ws.getCell(kpiRow, 3).value = "Count";
  for (let c = 2; c <= 3; c++) {
    const cell = ws.getCell(kpiRow, c);
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  }
  kpiRow++;
  const catStart = kpiRow;
  for (const { category, count } of data.topCategories) {
    ws.getCell(kpiRow, 2).value = category;
    ws.getCell(kpiRow, 3).value = count;
    kpiRow++;
  }
  if (data.topCategories.length === 0) {
    ws.getCell(kpiRow, 2).value = "No category data";
    ws.getCell(kpiRow, 3).value = 0;
    kpiRow++;
  }
  for (let r = catStart; r < kpiRow; r++) {
    for (let c = 2; c <= 3; c++) {
      const cell = ws.getCell(r, c);
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND.ink } };
      if ((r - catStart) % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.ivoryAlt } };
      }
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      cell.border = { bottom: { style: "thin", color: { argb: BRAND.borderLight } } };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 2: Leads
  // ═══════════════════════════════════════════════════════════
  const wsLeads = wb.addWorksheet("Leads", {
    properties: { tabColor: { argb: BRAND.brass } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 3 }],
  });
  wsLeads.columns = [
    { header: "Date", key: "date", width: 18 },
    { header: "Name", key: "name", width: 24 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 28 },
    { header: "Hotel", key: "hotel", width: 24 },
    { header: "Category", key: "category", width: 22 },
    { header: "Source", key: "source", width: 20 },
    { header: "Status", key: "status", width: 14 },
  ];
  styleTitleRow(wsLeads, "Leads — " + data.monthLabel, 8);
  styleSubtitleRow(wsLeads, `${data.totalLeads} leads`, 8, 2);
  styleHeaderRow(wsLeads, 3, 8);
  const leadsStartRow = 4;
  for (const l of data.leads) {
    wsLeads.addRow({
      date: new Date(l.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      name: l.name,
      phone: l.phone,
      email: l.email || "—",
      hotel: l.hotel || "—",
      category: l.category || "—",
      source: labelFor(l.source, SOURCE_LABELS),
      status: labelFor(l.status, STATUS_LABELS),
    });
  }
  if (data.leads.length > 0) {
    styleDataRows(wsLeads, leadsStartRow, leadsStartRow + data.leads.length - 1, 8);
  } else {
    wsLeads.getCell(4, 1).value = "No leads recorded for this month";
    wsLeads.mergeCells(4, 1, 4, 8);
    wsLeads.getCell(4, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
    wsLeads.getCell(4, 1).alignment = { horizontal: "center" };
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 3: Leads by Source
  // ═══════════════════════════════════════════════════════════
  const wsSrc = wb.addWorksheet("Leads by Source", {
    properties: { tabColor: { argb: BRAND.brass } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 3 }],
  });
  wsSrc.columns = [
    { header: "Source", key: "source", width: 28 },
    { header: "Leads", key: "count", width: 12 },
    { header: "% of Total", key: "pct", width: 14 },
  ];
  styleTitleRow(wsSrc, "Leads by Source — " + data.monthLabel, 3);
  styleSubtitleRow(wsSrc, `${data.totalLeads} leads across ${sourceEntries.length} sources`, 3, 2);
  styleHeaderRow(wsSrc, 3, 3);
  if (sourceEntries.length === 0) {
    wsSrc.getCell(4, 1).value = "No leads this month";
    wsSrc.mergeCells(4, 1, 4, 3);
    wsSrc.getCell(4, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
    wsSrc.getCell(4, 1).alignment = { horizontal: "center" };
  } else {
    for (const [src, count] of sourceEntries) {
      wsSrc.addRow({
        source: labelFor(src, SOURCE_LABELS),
        count,
        pct: data.totalLeads > 0 ? `${((count / data.totalLeads) * 100).toFixed(1)}%` : "0%",
      });
    }
    styleDataRows(wsSrc, 4, 4 + sourceEntries.length - 1, 3);
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 4: Leads by Status
  // ═══════════════════════════════════════════════════════════
  const wsStat = wb.addWorksheet("Leads by Status", {
    properties: { tabColor: { argb: BRAND.brass } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 3 }],
  });
  wsStat.columns = [
    { header: "Status", key: "status", width: 24 },
    { header: "Leads", key: "count", width: 12 },
    { header: "% of Total", key: "pct", width: 14 },
  ];
  styleTitleRow(wsStat, "Leads by Status — " + data.monthLabel, 3);
  styleSubtitleRow(wsStat, `${data.totalLeads} leads across ${statusEntries.length} statuses`, 3, 2);
  styleHeaderRow(wsStat, 3, 3);
  if (statusEntries.length === 0) {
    wsStat.getCell(4, 1).value = "No leads this month";
    wsStat.mergeCells(4, 1, 4, 3);
    wsStat.getCell(4, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
    wsStat.getCell(4, 1).alignment = { horizontal: "center" };
  } else {
    for (const [s, count] of statusEntries) {
      wsStat.addRow({
        status: labelFor(s, STATUS_LABELS),
        count,
        pct: data.totalLeads > 0 ? `${((count / data.totalLeads) * 100).toFixed(1)}%` : "0%",
      });
    }
    styleDataRows(wsStat, 4, 4 + statusEntries.length - 1, 3);
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 5: Leads by Day
  // ═══════════════════════════════════════════════════════════
  const wsDay = wb.addWorksheet("Leads by Day", {
    properties: { tabColor: { argb: BRAND.brass } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 3 }],
  });
  wsDay.columns = [
    { header: "Date", key: "date", width: 18 },
    { header: "Day", key: "day", width: 8 },
    { header: "Leads", key: "count", width: 12 },
  ];
  styleTitleRow(wsDay, "Daily Lead Counts — " + data.monthLabel, 3);
  styleSubtitleRow(wsDay, `${data.leadsByDay.length} days`, 3, 2);
  styleHeaderRow(wsDay, 3, 3);
  for (const d of data.leadsByDay) {
    wsDay.addRow({ date: d.date, day: d.day, count: d.count });
  }
  if (data.leadsByDay.length > 0) {
    styleDataRows(wsDay, 4, 4 + data.leadsByDay.length - 1, 3);
  } else {
    wsDay.getCell(4, 1).value = "No data";
    wsDay.mergeCells(4, 1, 4, 3);
    wsDay.getCell(4, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
    wsDay.getCell(4, 1).alignment = { horizontal: "center" };
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 6: Blog Posts
  // ═══════════════════════════════════════════════════════════
  const wsBlog = wb.addWorksheet("Blog Posts", {
    properties: { tabColor: { argb: BRAND.emerald } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 3 }],
  });
  wsBlog.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: "Title", key: "title", width: 48 },
    { header: "Category", key: "category", width: 22 },
    { header: "Author", key: "author", width: 24 },
    { header: "Read Time", key: "readTime", width: 12 },
    { header: "Published", key: "published", width: 12 },
    { header: "Slug", key: "slug", width: 24 },
  ];
  styleTitleRow(wsBlog, "Blog Posts — " + data.monthLabel, 7);
  styleSubtitleRow(
    wsBlog,
    `${data.totalBlogPosts} total • ${data.publishedBlogPosts} published • ${data.unpublishedBlogPosts} drafts`,
    7,
    2,
  );
  styleHeaderRow(wsBlog, 3, 7);
  for (const p of data.blogPosts) {
    wsBlog.addRow({
      date: p.date,
      title: p.title,
      category: p.category,
      author: p.author,
      readTime: p.readTime,
      published: p.published ? "Yes" : "No",
      slug: p.slug,
    });
  }
  if (data.blogPosts.length > 0) {
    styleDataRows(wsBlog, 4, 4 + data.blogPosts.length - 1, 7);
  } else {
    wsBlog.getCell(4, 1).value = "No blog posts found";
    wsBlog.mergeCells(4, 1, 4, 7);
    wsBlog.getCell(4, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
    wsBlog.getCell(4, 1).alignment = { horizontal: "center" };
  }

  // ═══════════════════════════════════════════════════════════
  // SHEET 7: Products
  // ═══════════════════════════════════════════════════════════
  const wsProd = wb.addWorksheet("Products", {
    properties: { tabColor: { argb: BRAND.emerald } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 3 }],
  });
  wsProd.columns = [
    { header: "Model", key: "model", width: 22 },
    { header: "Name", key: "name", width: 40 },
    { header: "Category", key: "category", width: 24 },
    { header: "Price", key: "price", width: 18 },
    { header: "Featured", key: "featured", width: 12 },
    { header: "Published", key: "published", width: 12 },
  ];
  styleTitleRow(wsProd, "Products Catalogue — " + data.monthLabel, 6);
  styleSubtitleRow(
    wsProd,
    `${data.totalProducts} total • ${data.featuredProducts} featured • ${data.productsByCategory.length} categories`,
    6,
    2,
  );
  styleHeaderRow(wsProd, 3, 6);
  for (const p of data.products) {
    wsProd.addRow({
      model: p.model,
      name: p.name,
      category: p.category || "Uncategorised",
      price: p.price || "—",
      featured: p.featured ? "Yes" : "No",
      published: p.published ? "Yes" : "No",
    });
  }
  if (data.products.length > 0) {
    styleDataRows(wsProd, 4, 4 + data.products.length - 1, 6);
  } else {
    wsProd.getCell(4, 1).value = "No products found";
    wsProd.mergeCells(4, 1, 4, 6);
    wsProd.getCell(4, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
    wsProd.getCell(4, 1).alignment = { horizontal: "center" };
  }

  return await wb.xlsx.writeBuffer();
}

// ─────────────────────────────────────────────────────────────
// Build HTML report (print-to-PDF)
// ─────────────────────────────────────────────────────────────
function esc(s: string | number | null | undefined): string {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(data: ReportData): string {
  const dateStr = data.generatedAt.toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const kpis: { label: string; value: string | number; accent: string }[] = [
    { label: "Total Leads", value: data.totalLeads, accent: "brass" },
    { label: "Blog Posts", value: data.totalBlogPosts, accent: "emerald" },
    { label: "Published", value: data.publishedBlogPosts, accent: "brass" },
    { label: "Posts This Month", value: data.blogPostsThisMonth, accent: "emerald" },
    { label: "Total Products", value: data.totalProducts, accent: "brass" },
    { label: "Featured Products", value: data.featuredProducts, accent: "emerald" },
    { label: "Client Logos", value: data.site.clientLogos, accent: "brass" },
    { label: "Image Overrides", value: data.site.imageOverrides, accent: "emerald" },
  ];

  const kpiCards = kpis
    .map(
      (k) => `
      <div class="kpi-card kpi-${k.accent}">
        <div class="kpi-value">${esc(k.value)}</div>
        <div class="kpi-label">${esc(k.label)}</div>
      </div>`,
    )
    .join("");

  const sourceRows =
    Object.entries(data.leadsBySource)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([src, count], i) => `
        <tr class="${i % 2 ? "alt" : ""}">
          <td>${esc(labelFor(src, SOURCE_LABELS))}</td>
          <td class="num">${count}</td>
          <td class="num">${data.totalLeads > 0 ? ((count / data.totalLeads) * 100).toFixed(1) : "0.0"}%</td>
        </tr>`,
      )
      .join("") ||
    `<tr><td colspan="3" class="empty">No leads recorded for this month</td></tr>`;

  const statusRows =
    Object.entries(data.leadsByStatus)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([s, count], i) => `
        <tr class="${i % 2 ? "alt" : ""}">
          <td>${esc(labelFor(s, STATUS_LABELS))}</td>
          <td class="num">${count}</td>
          <td class="num">${data.totalLeads > 0 ? ((count / data.totalLeads) * 100).toFixed(1) : "0.0"}%</td>
        </tr>`,
      )
      .join("") ||
    `<tr><td colspan="3" class="empty">No leads recorded for this month</td></tr>`;

  const topCatRows =
    data.topCategories
      .map(
        ({ category, count }, i) => `
        <tr class="${i % 2 ? "alt" : ""}">
          <td>${esc(category)}</td>
          <td class="num">${count}</td>
        </tr>`,
      )
      .join("") ||
    `<tr><td colspan="2" class="empty">No category data available</td></tr>`;

  const maxDaily = Math.max(1, ...data.leadsByDay.map((d) => d.count));
  const dailyChart = data.leadsByDay
    .map((d) => {
      const h = Math.max(2, (d.count / maxDaily) * 80);
      return `<div class="bar-col" title="${esc(d.date)}: ${d.count} leads">
        <div class="bar" style="height:${h}px"></div>
        <div class="bar-label">${d.day}</div>
      </div>`;
    })
    .join("");

  const topLeads = data.leads.slice(0, 20);
  const leadsRows =
    topLeads
      .map(
        (l, i) => `
        <tr class="${i % 2 ? "alt" : ""}">
          <td>${new Date(l.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</td>
          <td>${esc(l.name)}</td>
          <td class="mono">${esc(l.phone)}</td>
          <td>${esc(l.hotel || "—")}</td>
          <td>${esc(labelFor(l.source, SOURCE_LABELS))}</td>
          <td><span class="status-pill status-${esc(l.status)}">${esc(labelFor(l.status, STATUS_LABELS))}</span></td>
        </tr>`,
      )
      .join("") ||
    `<tr><td colspan="6" class="empty">No leads recorded for this month</td></tr>`;

  const topPosts = data.blogPosts.slice(0, 10);
  const blogRows =
    topPosts
      .map(
        (p, i) => `
        <tr class="${i % 2 ? "alt" : ""}">
          <td>${esc(p.date)}</td>
          <td>${esc(p.title)}</td>
          <td>${esc(p.category)}</td>
          <td>${esc(p.author)}</td>
          <td>${p.published ? '<span class="pub-yes">Published</span>' : '<span class="pub-no">Draft</span>'}</td>
        </tr>`,
      )
      .join("") ||
    `<tr><td colspan="5" class="empty">No blog posts found</td></tr>`;

  const prodCatRows =
    data.productsByCategory
      .map(
        ({ category, count }, i) => `
        <tr class="${i % 2 ? "alt" : ""}">
          <td>${esc(category)}</td>
          <td class="num">${count}</td>
        </tr>`,
      )
      .join("") ||
    `<tr><td colspan="2" class="empty">No products found</td></tr>`;

  const topPagesRows = data.site.topPages
    .map(
      (p, i) => `
      <tr class="${i % 2 ? "alt" : ""}">
        <td class="mono">${esc(p.path)}</td>
        <td>${esc(p.title)}</td>
        <td class="num muted">N/A — connect GA</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LaxRee Amenities — Monthly Report — ${esc(data.monthLabel)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #F5F1E8; color: #1F1F1F; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; line-height: 1.55; }
  .page { max-width: 1100px; margin: 0 auto; padding: 32px 40px 80px; }

  .toolbar {
    position: sticky; top: 0; z-index: 10;
    background: rgba(245, 241, 232, 0.95); backdrop-filter: blur(6px);
    border-bottom: 1px solid #E5DCC6; padding: 14px 40px; margin: -32px -40px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .toolbar .badge { font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #9C8B6E; }
  .print-btn {
    background: #C6A15B; color: #1A1A1A; border: none; padding: 10px 22px;
    border-radius: 999px; font-weight: 600; font-size: 12px; cursor: pointer;
    letter-spacing: 0.05em; transition: background 0.2s;
  }
  .print-btn:hover { background: #B5914B; }

  .report-header {
    background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
    color: #F5F1E8; border-radius: 18px; padding: 36px 40px; margin-bottom: 32px;
    position: relative; overflow: hidden;
  }
  .report-header::after {
    content: ""; position: absolute; right: -60px; top: -60px;
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(198,161,91,0.18) 0%, transparent 70%);
  }
  .report-header .logo-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .report-header .logo-mark {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, #C6A15B, #D9BD7E);
    display: flex; align-items: center; justify-content: center;
    color: #1A1A1A; font-weight: 800; font-size: 22px; font-family: Georgia, serif;
  }
  .report-header .brand-name { font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; letter-spacing: 0.02em; }
  .report-header .brand-sub { font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #9C8B6E; margin-top: 2px; }
  .report-header .title { font-family: Georgia, serif; font-size: 36px; font-weight: 700; line-height: 1.15; margin-bottom: 8px; }
  .report-header .month-line { color: #C6A15B; font-family: 'Courier New', monospace; font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; }
  .report-header .meta { display: flex; gap: 28px; margin-top: 22px; font-size: 11px; color: #9C8B6E; }
  .report-header .meta strong { color: #F5F1E8; font-weight: 600; }

  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 36px; }
  .kpi-card { background: #FFFFFF; border: 1px solid #E5DCC6; border-radius: 14px; padding: 20px 22px; border-left: 4px solid #C6A15B; }
  .kpi-card.kpi-emerald { border-left-color: #3D6B5C; }
  .kpi-value { font-family: Georgia, serif; font-size: 32px; font-weight: 700; color: #C6A15B; line-height: 1; margin-bottom: 8px; }
  .kpi-card.kpi-emerald .kpi-value { color: #3D6B5C; }
  .kpi-label { font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #9C8B6E; }

  .section { margin-bottom: 36px; break-inside: avoid; }
  .section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .section-title::before { content: ""; display: block; width: 28px; height: 2px; background: #C6A15B; }
  .section-title h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 600; color: #1A1A1A; }
  .section-title .count { font-family: 'Courier New', monospace; font-size: 11px; color: #9C8B6E; margin-left: 8px; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .sub-h { font-family: Georgia, serif; font-size: 15px; color: #1A1A1A; margin-bottom: 10px; }

  table { width: 100%; border-collapse: collapse; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  th { background: #C6A15B; color: #FFFFFF; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; padding: 12px 14px; text-align: left; }
  td { padding: 10px 14px; font-size: 12px; color: #1F1F1F; border-bottom: 1px solid #F0E9D8; }
  tr:last-child td { border-bottom: none; }
  tr.alt td { background: #FBF8F1; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.mono, .mono { font-family: 'Courier New', monospace; font-size: 11px; }
  td.muted, .muted { color: #9C8B6E; }
  td.empty { text-align: center; color: #9C8B6E; font-style: italic; padding: 24px; }

  .status-pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; }
  .status-new { background: #E6F4EF; color: #3D6B5C; }
  .status-contacted { background: #FFF4E0; color: #B07020; }
  .status-quoted { background: #F5EAD2; color: #8B6B2A; }
  .status-closed { background: #ECECEC; color: #555; }
  .pub-yes { color: #3D6B5C; font-weight: 600; font-size: 11px; }
  .pub-no { color: #B07020; font-weight: 600; font-size: 11px; }

  .chart-wrap { background: #FFFFFF; border: 1px solid #E5DCC6; border-radius: 12px; padding: 22px; }
  .chart { display: flex; align-items: flex-end; gap: 3px; height: 120px; padding-bottom: 22px; border-bottom: 1px solid #E5DCC6; overflow-x: auto; }
  .bar-col { flex: 0 0 22px; min-width: 16px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
  .bar { width: 100%; background: linear-gradient(180deg, #C6A15B, #B5914B); border-radius: 3px 3px 0 0; transition: height 0.3s; }
  .bar-label { font-family: 'Courier New', monospace; font-size: 8px; color: #9C8B6E; margin-top: 6px; }

  .report-footer {
    margin-top: 48px; padding-top: 22px; border-top: 1px solid #E5DCC6;
    display: flex; justify-content: space-between; align-items: center;
    font-family: 'Courier New', monospace; font-size: 10px; color: #9C8B6E; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .report-footer .brand { color: #1A1A1A; font-weight: 700; }

  @media print {
    body { background: #FFFFFF; }
    .toolbar { display: none; }
    .page { max-width: 100%; padding: 0; }
    .report-header { border-radius: 0; padding: 24px 0; background: #1A1A1A !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .kpi-card, .chart-wrap, table, th, td, .status-pill, .bar, .section-title::before { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .section { break-inside: avoid; page-break-inside: avoid; }
    @page { size: A4; margin: 14mm; }
  }

  @media (max-width: 800px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .two-col { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="toolbar">
      <span class="badge">LaxRee Admin · Monthly Report</span>
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <header class="report-header">
      <div class="logo-row">
        <div class="logo-mark">L</div>
        <div>
          <div class="brand-name">LaxRee Amenities</div>
          <div class="brand-sub">Hospitality Procurement Intelligence</div>
        </div>
      </div>
      <h1 class="title">Monthly Performance Report</h1>
      <div class="month-line">${esc(data.monthLabel)}</div>
      <div class="meta">
        <div>Generated: <strong>${esc(dateStr)}</strong></div>
        <div>Period: <strong>${esc(data.monthStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }))} → ${esc(new Date(data.monthEnd.getTime() - 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }))}</strong></div>
        <div>Report ID: <strong>${esc(data.monthKey)}</strong></div>
      </div>
    </header>

    <section class="section">
      <div class="section-title"><h2>Key Metrics</h2><span class="count">at a glance</span></div>
      <div class="kpi-grid">${kpiCards}</div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Leads Breakdown</h2><span class="count">${data.totalLeads} leads</span></div>
      <div class="two-col">
        <div>
          <h3 class="sub-h">By Source</h3>
          <table>
            <thead><tr><th>Source</th><th class="num">Leads</th><th class="num">Share</th></tr></thead>
            <tbody>${sourceRows}</tbody>
          </table>
        </div>
        <div>
          <h3 class="sub-h">By Status</h3>
          <table>
            <thead><tr><th>Status</th><th class="num">Leads</th><th class="num">Share</th></tr></thead>
            <tbody>${statusRows}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Daily Lead Activity</h2><span class="count">${data.leadsByDay.length} days</span></div>
      <div class="chart-wrap">
        <div class="chart">${dailyChart}</div>
        <p style="font-family:'Courier New',monospace;font-size:10px;color:#9C8B6E;margin-top:14px;letter-spacing:0.1em;text-transform:uppercase;">Daily lead count across the month</p>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Top 5 Categories Requested</h2></div>
      <table>
        <thead><tr><th>Category</th><th class="num">Requests</th></tr></thead>
        <tbody>${topCatRows}</tbody>
      </table>
    </section>

    <section class="section">
      <div class="section-title"><h2>Recent Leads</h2><span class="count">${data.totalLeads > 20 ? "top 20 of " + data.totalLeads : data.totalLeads + " total"}</span></div>
      <table>
        <thead>
          <tr><th>Date</th><th>Name</th><th>Phone</th><th>Hotel</th><th>Source</th><th>Status</th></tr>
        </thead>
        <tbody>${leadsRows}</tbody>
      </table>
    </section>

    <section class="section">
      <div class="section-title"><h2>Blog Posts</h2><span class="count">${data.totalBlogPosts} total · ${data.publishedBlogPosts} published · ${data.blogPostsThisMonth} new this month</span></div>
      <table>
        <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Author</th><th>Status</th></tr></thead>
        <tbody>${blogRows}</tbody>
      </table>
    </section>

    <section class="section">
      <div class="section-title"><h2>Products by Category</h2><span class="count">${data.totalProducts} products · ${data.featuredProducts} featured</span></div>
      <table>
        <thead><tr><th>Category</th><th class="num">Products</th></tr></thead>
        <tbody>${prodCatRows}</tbody>
      </table>
    </section>

    <section class="section">
      <div class="section-title"><h2>Website Stats</h2><span class="count">top pages + CMS assets</span></div>
      <table>
        <thead><tr><th>Path</th><th>Page</th><th class="num">Page Views</th></tr></thead>
        <tbody>${topPagesRows}</tbody>
      </table>
      <div class="two-col" style="margin-top:18px;">
        <div class="kpi-card kpi-brass"><div class="kpi-value">${data.site.clientLogos}</div><div class="kpi-label">Client Logos (CMS)</div></div>
        <div class="kpi-card kpi-emerald"><div class="kpi-value">${data.site.imageOverrides}</div><div class="kpi-label">Image Overrides (CMS)</div></div>
      </div>
    </section>

    <footer class="report-footer">
      <div><span class="brand">LaxRee Amenities</span> · Monthly Report · ${esc(data.monthLabel)}</div>
      <div>Generated ${esc(dateStr)}</div>
    </footer>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "xlsx").toLowerCase();
    const month = searchParams.get("month");

    const data = await gatherReportData(month);

    if (format === "pdf" || format === "html") {
      const html = buildHtml(data);
      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="laxree-report-${data.monthKey}.html"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Default: xlsx
    const buffer = await buildExcel(data);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="laxree-report-${data.monthKey}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[ADMIN REPORT ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Failed to generate report", error: String(err) },
      { status: 500 },
    );
  }
}
