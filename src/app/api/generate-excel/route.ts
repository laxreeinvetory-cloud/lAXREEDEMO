import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export const runtime = "nodejs";

type QuotationItem = {
  model: string;
  name: string;
  category: string;
  quantity: number;
};

type ExcelBody = {
  name: string;
  email: string;
  phone: string;
  hotel: string;
  message: string;
  avgRoomRent: string;
  timeline: string;
  propertyType: string;
  projectStage: string;
  refNo: string;
  date: string;
  items: QuotationItem[];
};

// Brand colors (ARGB format for ExcelJS)
const CHARCOAL = "FF12100D";
const BRASS = "FFC6A15B";
const IVORY = "FFF7F3EA";
const SAND = "FFB7AC97";
const INK = "FF1A1712";
const INK_MUTED = "FF6B6455";
const ALT_ROW = "FFFAF8F2";
const NOTE_BG = "FFFFFAF0";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExcelBody;
    const totalUnits = body.items.reduce((s, i) => s + i.quantity, 0);
    const propType = body.propertyType === "new" ? "New Property" : "Renovation";

    const wb = new ExcelJS.Workbook();
    wb.creator = "LaxRee Amenities";
    wb.created = new Date();

    const ws = wb.addWorksheet("Quotation", {
      views: [{ showGridLines: false }],
      pageSetup: {
        orientation: "portrait",
        paperSize: 9, // A4
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    // Column widths
    ws.columns = [
      { width: 6 },
      { width: 16 },
      { width: 35 },
      { width: 18 },
      { width: 8 },
      { width: 16 },
      { width: 18 },
    ];

    let row = 1;

    // ── Helper functions ──
    function mergeAndStyle(r: number, startCol: number, endCol: number, value: string, opts: {
      font?: Partial<ExcelJS.Font>;
      fill?: ExcelJS.Fill;
      alignment?: Partial<ExcelJS.Alignment>;
      height?: number;
    }) {
      ws.mergeCells(r, startCol, r, endCol);
      const cell = ws.getCell(r, startCol);
      cell.value = value;
      if (opts.font) cell.font = opts.font;
      if (opts.fill) cell.fill = opts.fill;
      if (opts.alignment) cell.alignment = opts.alignment;
      for (let c = startCol + 1; c <= endCol; c++) {
        if (opts.fill) ws.getCell(r, c).fill = opts.fill;
      }
      if (opts.height) ws.getRow(r).height = opts.height;
    }

    const charcoalFill = { type: "pattern", pattern: "solid", fgColor: { argb: CHARCOAL } } as ExcelJS.Fill;
    const brassFill = { type: "pattern", pattern: "solid", fgColor: { argb: BRASS } } as ExcelJS.Fill;
    const ivoryFill = { type: "pattern", pattern: "solid", fgColor: { argb: IVORY } } as ExcelJS.Fill;
    const altFill = { type: "pattern", pattern: "solid", fgColor: { argb: ALT_ROW } } as ExcelJS.Fill;
    const noteFill = { type: "pattern", pattern: "solid", fgColor: { argb: NOTE_BG } } as ExcelJS.Fill;

    // ── Header ──
    mergeAndStyle(row, 1, 4, "LaxRee", {
      font: { name: "Georgia", size: 22, bold: true, color: { argb: BRASS } },
      fill: charcoalFill,
      alignment: { horizontal: "left", vertical: "middle", indent: 1 },
      height: 36,
    });
    mergeAndStyle(row, 5, 7, "Quotation Request", {
      font: { name: "Calibri", size: 9, color: { argb: SAND } },
      fill: charcoalFill,
      alignment: { horizontal: "right", vertical: "middle" },
      height: 36,
    });
    row++;

    // Tagline + Ref
    mergeAndStyle(row, 1, 4, "AMENITIES  •  HOTEL SUPPLIES REDEFINED", {
      font: { name: "Calibri", size: 8, color: { argb: SAND } },
      fill: charcoalFill,
      alignment: { horizontal: "left", vertical: "middle", indent: 1 },
      height: 20,
    });
    mergeAndStyle(row, 5, 7, body.refNo, {
      font: { name: "Courier New", size: 14, bold: true, color: { argb: BRASS } },
      fill: charcoalFill,
      alignment: { horizontal: "right", vertical: "middle" },
      height: 20,
    });
    row++;

    // Date
    mergeAndStyle(row, 1, 4, "", { fill: charcoalFill, height: 18 });
    mergeAndStyle(row, 5, 7, body.date, {
      font: { name: "Calibri", size: 10, color: { argb: SAND } },
      fill: charcoalFill,
      alignment: { horizontal: "right", vertical: "middle" },
      height: 18,
    });
    row++;

    // Spacer
    ws.getRow(row).height = 8;
    row++;

    // ── Title bar ──
    mergeAndStyle(row, 1, 7, "Product Quotation Request", {
      font: { name: "Georgia", size: 14, bold: true, color: { argb: CHARCOAL } },
      fill: brassFill,
      alignment: { horizontal: "left", vertical: "middle", indent: 1 },
      height: 28,
    });
    row++;

    // Spacer
    ws.getRow(row).height = 8;
    row++;

    // ── Section helper ──
    function section(title: string) {
      mergeAndStyle(row, 1, 7, title, {
        font: { name: "Calibri", size: 10, bold: true, color: { argb: CHARCOAL } },
        fill: brassFill,
        alignment: { horizontal: "left", vertical: "middle", indent: 1 },
        height: 22,
      });
      row++;
    }

    function fieldRow(l1: string, v1: string, l2: string, v2: string) {
      const labelFont = { name: "Calibri", size: 10, bold: true, color: { argb: INK_MUTED } };
      const valueFont = { name: "Calibri", size: 11, color: { argb: INK } };
      const border = { style: "thin" as const, color: { argb: "FFD4CDB8" } };

      const c1 = ws.getCell(row, 1);
      c1.value = l1; c1.font = labelFont; c1.fill = ivoryFill; c1.alignment = { horizontal: "left", vertical: "middle", wrapText: true }; c1.border = { top: border, bottom: border, left: border, right: border };

      ws.mergeCells(row, 2, row, 3);
      const c2 = ws.getCell(row, 2);
      c2.value = v1; c2.font = valueFont; c2.alignment = { horizontal: "left", vertical: "middle", wrapText: true }; c2.border = { top: border, bottom: border, left: border, right: border };
      ws.getCell(row, 3).border = { top: border, bottom: border, left: border, right: border };

      const c4 = ws.getCell(row, 4);
      c4.value = l2; c4.font = labelFont; c4.fill = ivoryFill; c4.alignment = { horizontal: "left", vertical: "middle", wrapText: true }; c4.border = { top: border, bottom: border, left: border, right: border };

      ws.mergeCells(row, 5, row, 7);
      const c5 = ws.getCell(row, 5);
      c5.value = v2; c5.font = valueFont; c5.alignment = { horizontal: "left", vertical: "middle", wrapText: true }; c5.border = { top: border, bottom: border, left: border, right: border };
      ws.getCell(row, 6).border = { top: border, bottom: border, left: border, right: border };
      ws.getCell(row, 7).border = { top: border, bottom: border, left: border, right: border };

      ws.getRow(row).height = 22;
      row++;
    }

    // ── Customer Details ──
    section("CUSTOMER DETAILS");
    fieldRow("Name", body.name, "Phone", body.phone);
    fieldRow("Email", body.email || "—", "Hotel / Company", body.hotel || "—");
    ws.getRow(row).height = 8; row++;

    // ── Project Details ──
    section("PROJECT DETAILS");
    fieldRow("Avg Room Rent", body.avgRoomRent || "—", "Timeline", body.timeline || "—");
    fieldRow("Property Type", propType, body.propertyType === "new" ? "Project Stage" : "Message", body.propertyType === "new" ? (body.projectStage || "—") : (body.message || "—"));
    ws.getRow(row).height = 8; row++;

    // ── Products table ──
    section(`SELECTED PRODUCTS (${body.items.length} ITEMS, ${totalUnits} UNITS)`);

    // Table header
    const headers = ["S.No", "Model", "Product Name", "Category", "Qty", "Rate (INR)", "Amount (INR)"];
    const border = { style: "thin" as const, color: { argb: "FFD4CDB8" } };
    headers.forEach((h, i) => {
      const cell = ws.getCell(row, i + 1);
      cell.value = h;
      cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRASS } };
      cell.fill = charcoalFill;
      cell.alignment = { horizontal: i === 0 || i === 4 ? "center" : "left", vertical: "middle" };
      cell.border = { top: border, bottom: border, left: border, right: border };
    });
    ws.getRow(row).height = 24;
    row++;

    // Product rows
    body.items.forEach((item, i) => {
      const fill = i % 2 === 1 ? altFill : undefined;
      const vals: [number, string | number, Partial<ExcelJS.Alignment>, Partial<ExcelJS.Font>][] = [
        [1, String(i + 1), { horizontal: "center", vertical: "middle" }, { name: "Calibri", size: 11, color: { argb: INK_MUTED } }],
        [2, item.model, { horizontal: "left", vertical: "middle" }, { name: "Courier New", size: 11, bold: true, color: { argb: BRASS } }],
        [3, item.name, { horizontal: "left", vertical: "middle" }, { name: "Calibri", size: 11, color: { argb: INK } }],
        [4, item.category, { horizontal: "left", vertical: "middle" }, { name: "Calibri", size: 11, color: { argb: INK_MUTED } }],
        [5, item.quantity, { horizontal: "center", vertical: "middle" }, { name: "Calibri", size: 12, bold: true, color: { argb: INK } }],
        [6, "To be quoted", { horizontal: "center", vertical: "middle" }, { name: "Calibri", size: 11, color: { argb: SAND } }],
        [7, "To be quoted", { horizontal: "right", vertical: "middle" }, { name: "Calibri", size: 11, color: { argb: SAND } }],
      ];
      vals.forEach(([col, val, alg, fnt]) => {
        const cell = ws.getCell(row, col);
        cell.value = val;
        cell.font = fnt;
        cell.alignment = alg;
        cell.border = { top: border, bottom: border, left: border, right: border };
        if (fill) cell.fill = fill;
      });
      ws.getRow(row).height = 24;
      row++;
    });

    ws.getRow(row).height = 8; row++;

    // ── Summary ──
    const summaryData: [string, string][] = [
      ["Total Items", String(body.items.length)],
      ["Total Units", String(totalUnits)],
      ["Estimated Total", "To be quoted"],
    ];
    summaryData.forEach(([label, value]) => {
      ws.mergeCells(row, 5, row, 6);
      const c1 = ws.getCell(row, 5);
      c1.value = label;
      c1.font = { name: "Calibri", size: 11, bold: true, color: { argb: INK_MUTED } };
      c1.alignment = { horizontal: "right", vertical: "middle" };
      c1.border = { top: border, bottom: border, left: border, right: border };
      ws.getCell(row, 6).border = { top: border, bottom: border, left: border, right: border };

      const c2 = ws.getCell(row, 7);
      c2.value = value;
      c2.font = { name: "Calibri", size: 11, bold: true, color: { argb: INK } };
      c2.alignment = { horizontal: "right", vertical: "middle" };
      c2.border = { top: border, bottom: border, left: border, right: border };
      ws.getRow(row).height = 22;
      row++;
    });

    // Grand total
    ws.mergeCells(row, 5, row, 6);
    const gt1 = ws.getCell(row, 5);
    gt1.value = "Grand Total";
    gt1.font = { name: "Calibri", size: 13, bold: true, color: { argb: CHARCOAL } };
    gt1.fill = brassFill;
    gt1.alignment = { horizontal: "right", vertical: "middle" };
    gt1.border = { top: border, bottom: border, left: border, right: border };
    ws.getCell(row, 6).fill = brassFill;
    ws.getCell(row, 6).border = { top: border, bottom: border, left: border, right: border };

    const gt2 = ws.getCell(row, 7);
    gt2.value = "To be quoted";
    gt2.font = { name: "Calibri", size: 13, bold: true, color: { argb: CHARCOAL } };
    gt2.fill = brassFill;
    gt2.alignment = { horizontal: "right", vertical: "middle" };
    gt2.border = { top: border, bottom: border, left: border, right: border };
    ws.getRow(row).height = 26;
    row++;

    ws.getRow(row).height = 8; row++;

    // ── Note ──
    mergeAndStyle(row, 1, 7, "Note: This is a quotation request, not a confirmed order. Rates, taxes, and delivery charges will be provided by the LaxRee sales team upon confirmation.", {
      font: { name: "Calibri", size: 10, color: { argb: INK_MUTED } },
      fill: noteFill,
      alignment: { horizontal: "left", vertical: "middle", wrapText: true, indent: 1 },
      height: 36,
    });
    row++;

    ws.getRow(row).height = 8; row++;

    // ── Footer ──
    const footerLines: [string, Partial<ExcelJS.Font>, number][] = [
      ["LaxRee Amenities", { name: "Georgia", size: 14, bold: true, color: { argb: BRASS } }, 24],
      ["Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001", { name: "Calibri", size: 10, color: { argb: SAND } }, 18],
      ["Phone: +91-92516 83662  |  Toll Free: 1800 120 7001  |  Email: contactus@laxree.com", { name: "Calibri", size: 10, color: { argb: SAND } }, 18],
      ["ISO 9001  •  ISO 14001  •  ISO 45001  •  CE CERTIFIED  •  RoHS COMPLIANT", { name: "Calibri", size: 8, color: { argb: INK_MUTED } }, 16],
    ];
    footerLines.forEach(([text, font, height]) => {
      mergeAndStyle(row, 1, 7, text, {
        font,
        fill: charcoalFill,
        alignment: { horizontal: "center", vertical: "middle" },
        height,
      });
      row++;
    });

    // Generate buffer
    const buffer = await wb.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="LaxRee_Quotation_${body.refNo}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("[EXCEL API ERROR]", err);
    return NextResponse.json({ ok: false, message: "Failed to generate Excel" }, { status: 500 });
  }
}
