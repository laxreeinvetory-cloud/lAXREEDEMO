import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ExcelJS from "exceljs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   /api/admin/leads
     GET    ?status=&source=&page=&limit=        → JSON list (paginated)
     GET    ?format=xlsx                         → Professional Excel export
            Optional filters: ?status=&source=
     PATCH  { id, status }                       → update lead status
     DELETE ?id=                                  → delete lead
   ───────────────────────────────────────────────────────────── */

// ─────────────────────────────────────────────────────────────
// Brand palette (ARGB for ExcelJS)
// ─────────────────────────────────────────────────────────────
const BRAND = {
  charcoal: "FF12100D",
  brass: "FFC6A15B",
  brassLight: "FFE4C989",
  ivory: "FFF7F3EA",
  ivoryAlt: "FFFBF8F1",
  emerald: "FF1E4638",
  ink: "FF1A1712",
  sand: "FFB7AC97",
  inkMuted: "FF6B6455",
  white: "FFFFFFFF",
  borderLight: "FFE5DCC6",
};

const SOURCE_LABELS: Record<string, string> = {
  "contact-page": "Contact Page",
  contact: "Contact Page",
  quotation: "Quotation Request",
  "catalogue-page": "Catalogue Download",
  catalogue: "Catalogue Download",
  "catalogue-discount": "Catalogue Discount",
  "dealer-application": "Dealer Application",
  dealer: "Dealer Application",
  "career-application": "Career Application",
  career: "Career Application",
  "enquiry-modal": "Enquiry Modal",
  enquiry: "Enquiry Modal",
  homepage: "Homepage CTA",
  "homepage-cta": "Homepage CTA",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  closed: "Closed",
  approved: "Approved",
  rejected: "Rejected",
};

const COLUMN_DEFS: { header: string; width: number; key: string }[] = [
  { header: "#", width: 5, key: "index" },
  { header: "Date", width: 20, key: "date" },
  { header: "Name", width: 22, key: "name" },
  { header: "Phone", width: 16, key: "phone" },
  { header: "Email", width: 28, key: "email" },
  { header: "Hotel / Property", width: 24, key: "hotel" },
  { header: "Category", width: 22, key: "category" },
  { header: "Source", width: 18, key: "source" },
  { header: "Status", width: 14, key: "status" },
  { header: "Ref No", width: 14, key: "refNo" },
  { header: "Avg Room Rent", width: 14, key: "avgRoomRent" },
  { header: "Timeline", width: 14, key: "timeline" },
  { header: "Property Type", width: 16, key: "propertyType" },
  { header: "Project Stage", width: 14, key: "projectStage" },
  { header: "Message", width: 50, key: "message" },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function labelFor(value: string | null | undefined, map: Record<string, string>): string {
  if (!value) return "—";
  return map[value] || value;
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

// ─────────────────────────────────────────────────────────────
// Excel builder — branded workbook with Leads + Summary sheets
// ─────────────────────────────────────────────────────────────
async function buildLeadsExcel(
  leads: Array<Record<string, unknown>>,
  filters: { status?: string; source?: string },
): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "LaxRee Amenities Admin";
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = "LaxRee Amenities — Leads Export";

  // ═══════════════════════════════════════════════════════════
  // SHEET 1: Leads
  // ═══════════════════════════════════════════════════════════
  const ws = wb.addWorksheet("Leads", {
    properties: { tabColor: { argb: BRAND.brass } },
    views: [{ showGridLines: false, state: "frozen", ySplit: 4 }],
  });

  // Column widths
  ws.columns = COLUMN_DEFS.map((c) => ({ width: c.width, key: c.key }));

  const colCount = COLUMN_DEFS.length;

  // ── Row 1: Title ──
  ws.mergeCells(1, 1, 1, colCount);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = "LaxRee Amenities — Leads Export";
  titleCell.font = { name: "Calibri", size: 18, bold: true, color: { argb: BRAND.white } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 38;

  // ── Row 2: Export date + total count + active filters ──
  ws.mergeCells(2, 1, 2, colCount);
  const dateStr = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const filterText =
    (filters.status || filters.source
      ? ` · Filter: ${[filters.status && `status=${filters.status}`, filters.source && `source=${filters.source}`]
          .filter(Boolean)
          .join(", ")}`
      : " · No filters") + ` · ${leads.length} records`;
  const subCell = ws.getCell(2, 1);
  subCell.value = `Exported: ${dateStr}${filterText}`;
  subCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.charcoal } };
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(2).height = 22;

  // ── Row 3: empty spacer (charcoal sliver) ──
  ws.mergeCells(3, 1, 3, colCount);
  const spacer = ws.getCell(3, 1);
  spacer.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.charcoal } };
  ws.getRow(3).height = 6;

  // ── Row 4: Headers ──
  const headerRowIdx = 4;
  COLUMN_DEFS.forEach((c, i) => {
    const cell = ws.getCell(headerRowIdx, i + 1);
    cell.value = c.header;
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    cell.border = {
      top: { style: "thin", color: { argb: BRAND.brass } },
      bottom: { style: "medium", color: { argb: BRAND.charcoal } },
      left: { style: "thin", color: { argb: BRAND.brassLight } },
      right: { style: "thin", color: { argb: BRAND.brassLight } },
    };
  });
  ws.getRow(headerRowIdx).height = 26;

  // ── Data rows ──
  leads.forEach((lead, i) => {
    const r = headerRowIdx + 1 + i;
    const isAlt = i % 2 === 1;
    const created = lead.createdAt instanceof Date ? lead.createdAt : new Date(lead.createdAt as string);
    const rowValues: Record<string, string | number> = {
      index: i + 1,
      date: created.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      name: String(lead.name || ""),
      phone: String(lead.phone || ""),
      email: String(lead.email || ""),
      hotel: String(lead.hotel || ""),
      category: String(lead.category || ""),
      source: labelFor(lead.source as string, SOURCE_LABELS),
      status: labelFor(lead.status as string, STATUS_LABELS),
      refNo: String(lead.refNo || ""),
      avgRoomRent: String(lead.avgRoomRent || ""),
      timeline: String(lead.timeline || ""),
      propertyType: String(lead.propertyType || ""),
      projectStage: String(lead.projectStage || ""),
      message: String(lead.message || "").replace(/\s+/g, " ").trim(),
    };

    COLUMN_DEFS.forEach((c, ci) => {
      const cell = ws.getCell(r, ci + 1);
      const v = rowValues[c.key];
      cell.value = v;

      // Phone column: force TEXT format to prevent scientific notation
      if (c.key === "phone") {
        cell.numFmt = "@";
      }

      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND.ink } };
      if (isAlt) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.ivoryAlt } };
      } else {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.white } };
      }
      cell.alignment = {
        vertical: "middle",
        horizontal: c.key === "index" ? "center" : "left",
        indent: c.key === "index" ? 0 : 1,
        wrapText: c.key === "message",
      };
      cell.border = { bottom: { style: "thin", color: { argb: BRAND.borderLight } } };
    });
    ws.getRow(r).height = 20;
  });

  // Auto-filter on the header row (row 4) covering all data
  ws.autoFilter = {
    from: { row: headerRowIdx, column: 1 },
    to: { row: headerRowIdx + leads.length, column: colCount },
  };

  // Print setup — landscape, fit to width
  ws.pageSetup.orientation = "landscape";
  ws.pageSetup.fitToWidth = 1;
  ws.pageSetup.fitToHeight = 0;
  ws.pageSetup.paperSize = 9; // A4

  // ═══════════════════════════════════════════════════════════
  // SHEET 2: Summary — counts by source, status, category
  // ═══════════════════════════════════════════════════════════
  const summaryWs = wb.addWorksheet("Summary", {
    properties: { tabColor: { argb: BRAND.emerald } },
    views: [{ showGridLines: false }],
  });
  summaryWs.columns = [{ width: 28 }, { width: 14 }, { width: 14 }];

  // Title
  summaryWs.mergeCells(1, 1, 1, 3);
  const sTitle = summaryWs.getCell(1, 1);
  sTitle.value = "LaxRee Amenities — Leads Summary";
  sTitle.font = { name: "Calibri", size: 18, bold: true, color: { argb: BRAND.white } };
  sTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.emerald } };
  sTitle.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  summaryWs.getRow(1).height = 36;

  // Subtitle
  summaryWs.mergeCells(2, 1, 2, 3);
  const sSub = summaryWs.getCell(2, 1);
  sSub.value = `Generated ${dateStr} · ${leads.length} records`;
  sSub.font = { name: "Calibri", size: 10, italic: true, color: { argb: BRAND.sand } };
  sSub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.charcoal } };
  sSub.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  summaryWs.getRow(2).height = 20;

  // Helper to render a pivot table
  const renderPivot = (
    startRow: number,
    title: string,
    entries: [string, number][],
    total: number,
  ): number => {
    // Section title
    summaryWs.mergeCells(startRow, 1, startRow, 3);
    const secCell = summaryWs.getCell(startRow, 1);
    secCell.value = title;
    secCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND.white } };
    secCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brass } };
    secCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    summaryWs.getRow(startRow).height = 24;

    // Header row
    const headers = ["Category", "Leads", "% of Total"];
    headers.forEach((h, i) => {
      const cell = summaryWs.getCell(startRow + 1, i + 1);
      cell.value = h;
      cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND.charcoal } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.brassLight } };
      cell.alignment = { vertical: "middle", horizontal: i === 0 ? "left" : "right", indent: i === 0 ? 1 : 0 };
      cell.border = { bottom: { style: "thin", color: { argb: BRAND.charcoal } } };
    });
    summaryWs.getRow(startRow + 1).height = 20;

    // Data rows
    entries.forEach(([k, c], i) => {
      const r = startRow + 2 + i;
      const isAlt = i % 2 === 1;
      const pct = total > 0 ? `${((c / total) * 100).toFixed(1)}%` : "0%";
      const cells = [
        { v: k, align: "left" as const, indent: 1 },
        { v: c, align: "right" as const, indent: 0 },
        { v: pct, align: "right" as const, indent: 0 },
      ];
      cells.forEach((cv, ci) => {
        const cell = summaryWs.getCell(r, ci + 1);
        cell.value = cv.v;
        cell.font = { name: "Calibri", size: 10, color: { argb: BRAND.ink } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isAlt ? BRAND.ivoryAlt : BRAND.white },
        };
        cell.alignment = { vertical: "middle", horizontal: cv.align, indent: cv.indent };
        cell.border = { bottom: { style: "thin", color: { argb: BRAND.borderLight } } };
      });
      summaryWs.getRow(r).height = 18;
    });

    // Total row
    const totalRow = startRow + 2 + entries.length;
    const totalCells = [
      { v: "Total", align: "left" as const },
      { v: total, align: "right" as const },
      { v: "100%", align: "right" as const },
    ];
    totalCells.forEach((cv, ci) => {
      const cell = summaryWs.getCell(totalRow, ci + 1);
      cell.value = cv.v;
      cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND.white } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.charcoal } };
      cell.alignment = { vertical: "middle", horizontal: cv.align, indent: ci === 0 ? 1 : 0 };
    });
    summaryWs.getRow(totalRow).height = 22;

    return totalRow + 2; // next section starts 2 rows below
  };

  // Aggregations
  const total = leads.length;
  const bySource = countBy(leads, (l) => labelFor(l.source as string, SOURCE_LABELS));
  const byStatus = countBy(leads, (l) => labelFor(l.status as string, STATUS_LABELS));
  const byCategory = countBy(
    leads.filter((l) => l.category),
    (l) => String(l.category),
  );

  let row = 4;
  row = renderPivot(
    row,
    "Leads by Source",
    Object.entries(bySource).sort((a, b) => b[1] - a[1]),
    total,
  );
  row = renderPivot(
    row,
    "Leads by Status",
    Object.entries(byStatus).sort((a, b) => b[1] - a[1]),
    total,
  );
  row = renderPivot(
    row,
    "Leads by Category (Top 10)",
    Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    total,
  );

  return wb.xlsx.writeBuffer();
}

// ─────────────────────────────────────────────────────────────
// GET handler — JSON list OR Excel download
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (source) where.source = source;

    // ── Excel export path ──
    if (format === "xlsx") {
      let leads: Array<Record<string, unknown>> = [];
      try {
        leads = await db.lead.findMany({
          where,
          orderBy: { createdAt: "desc" },
        });
      } catch (dbErr) {
        console.error("[ADMIN LEADS EXPORT DB ERROR]", dbErr);
        // Return empty workbook rather than 500 so the user still gets a file
      }

      const buffer = await buildLeadsExcel(leads, { status: status || undefined, source: source || undefined });
      const dateStr = new Date().toISOString().slice(0, 10);
      return new NextResponse(Buffer.from(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="laxree-leads-${dateStr}.xlsx"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // ── JSON list (default) ──
    let leads: Array<Record<string, unknown>> = [];
    let total = 0;

    try {
      [leads, total] = await Promise.all([
        db.lead.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.lead.count({ where }),
      ]);
    } catch (dbErr) {
      // DB unavailable (Vercel serverless ephemeral FS) — return empty gracefully
      console.error("[ADMIN LEADS DB ERROR]", dbErr);
    }

    return NextResponse.json({
      ok: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[ADMIN LEADS ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    const lead = await db.lead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    console.error("[ADMIN LEADS UPDATE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "ID required" }, { status: 400 });
    }

    await db.lead.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Lead deleted" });
  } catch (err) {
    console.error("[ADMIN LEADS DELETE ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
