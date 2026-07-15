import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const PYTHON_SCRIPT = `/tmp/laxree_gen_xlsx.py`;

// Write the Python script once (cached)
function ensureScript() {
  if (fs.existsSync(PYTHON_SCRIPT)) return;
  fs.writeFileSync(PYTHON_SCRIPT, `import openpyxl, json, sys
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

body = json.loads(sys.argv[1])
out = sys.argv[2]

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Quotation"
ws.sheet_view.showGridLines = False

C = "FF12100D"  # charcoal
B = "FFC6A15B"  # brass
I = "FFF7F3EA"  # ivory
S = "FFB7AC97"  # sand
K = "FF1A1712"  # ink
M = "FF6B6455"  # muted
A = "FFFAF8F2"  # alt row

f_brand = Font(name="Georgia", size=22, bold=True, color=B)
f_tag = Font(name="Calibri", size=8, color=S)
f_ref_l = Font(name="Calibri", size=9, color=S)
f_ref = Font(name="Courier New", size=14, bold=True, color=B)
f_date = Font(name="Calibri", size=10, color=S)
f_title = Font(name="Georgia", size=14, bold=True, color=C)
f_sect = Font(name="Calibri", size=10, bold=True, color=C)
f_label = Font(name="Calibri", size=10, bold=True, color=M)
f_val = Font(name="Calibri", size=11, color=K)
f_model = Font(name="Courier New", size=11, bold=True, color=B)
f_hdr = Font(name="Calibri", size=9, bold=True, color=B)
f_data = Font(name="Calibri", size=11, color=K)
f_qty = Font(name="Calibri", size=12, bold=True, color=K)
f_muted = Font(name="Calibri", size=11, color=S)
f_sl = Font(name="Calibri", size=11, bold=True, color=M)
f_sv = Font(name="Calibri", size=11, bold=True, color=K)
f_total = Font(name="Calibri", size=13, bold=True, color=C)
f_note = Font(name="Calibri", size=10, color=M)
f_foot = Font(name="Calibri", size=10, color=S)
f_foot_b = Font(name="Georgia", size=14, bold=True, color=B)
f_foot_c = Font(name="Calibri", size=8, color=M)

fc = PatternFill("solid", fgColor=C)
fb = PatternFill("solid", fgColor=B)
fi = PatternFill("solid", fgColor=I)
fa = PatternFill("solid", fgColor=A)
fn = PatternFill("solid", fgColor="FFFFFAF0")

t = Side(style="thin", color="FFD4CDB8")
bd = Border(left=t, right=t, top=t, bottom=t)
al = Alignment(horizontal="left", vertical="center", wrap_text=True)
ac = Alignment(horizontal="center", vertical="center")
ar = Alignment(horizontal="right", vertical="center")

for i, w in enumerate([6, 16, 35, 18, 8, 16, 18], 1):
    ws.column_dimensions[get_column_letter(i)].width = w

r = 1

# Header
ws.merge_cells(f"A{r}:D{r}")
ws.merge_cells(f"E{r}:G{r}")
c = ws.cell(row=r, column=1, value="LaxRee")
c.font = f_brand; c.fill = fc; c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
for col in range(2, 8): ws.cell(row=r, column=col).fill = fc
c = ws.cell(row=r, column=5, value="Quotation Request")
c.font = f_ref_l; c.fill = fc; c.alignment = ar
ws.row_dimensions[r].height = 36
r += 1

ws.merge_cells(f"A{r}:D{r}")
ws.merge_cells(f"E{r}:G{r}")
c = ws.cell(row=r, column=1, value="AMENITIES  \u2022  HOTEL SUPPLIES REDEFINED")
c.font = f_tag; c.fill = fc; c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
for col in range(2, 5): ws.cell(row=r, column=col).fill = fc
c = ws.cell(row=r, column=5, value=body["refNo"])
c.font = f_ref; c.fill = fc; c.alignment = ar
for col in range(6, 8): ws.cell(row=r, column=col).fill = fc
ws.row_dimensions[r].height = 20
r += 1

ws.merge_cells(f"A{r}:D{r}")
ws.merge_cells(f"E{r}:G{r}")
for col in range(1, 5): ws.cell(row=r, column=col).fill = fc
c = ws.cell(row=r, column=5, value=body["date"])
c.font = f_date; c.fill = fc; c.alignment = ar
for col in range(6, 8): ws.cell(row=r, column=col).fill = fc
ws.row_dimensions[r].height = 18
r += 2

# Title
ws.merge_cells(f"A{r}:G{r}")
c = ws.cell(row=r, column=1, value="Product Quotation Request")
c.font = f_title; c.fill = fb; c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
for col in range(2, 8): ws.cell(row=r, column=col).fill = fb
ws.row_dimensions[r].height = 28
r += 2

def section(title):
    global r
    ws.merge_cells(f"A{r}:G{r}")
    c = ws.cell(row=r, column=1, value=title)
    c.font = f_sect; c.fill = fb; c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    for col in range(2, 8): ws.cell(row=r, column=col).fill = fb
    ws.row_dimensions[r].height = 22
    r += 1

def field_row(l1, v1, l2, v2):
    global r
    c = ws.cell(row=r, column=1, value=l1)
    c.font = f_label; c.fill = fi; c.alignment = al; c.border = bd
    ws.merge_cells(f"B{r}:C{r}")
    c = ws.cell(row=r, column=2, value=v1)
    c.font = f_val; c.alignment = al; c.border = bd
    ws.cell(row=r, column=3).border = bd
    c = ws.cell(row=r, column=4, value=l2)
    c.font = f_label; c.fill = fi; c.alignment = al; c.border = bd
    ws.merge_cells(f"E{r}:G{r}")
    c = ws.cell(row=r, column=5, value=v2)
    c.font = f_val; c.alignment = al; c.border = bd
    ws.cell(row=r, column=6).border = bd
    ws.cell(row=r, column=7).border = bd
    ws.row_dimensions[r].height = 22
    r += 1

section("CUSTOMER DETAILS")
field_row("Name", body["name"], "Phone", body["phone"])
field_row("Email", body.get("email") or "\u2014", "Hotel / Company", body.get("hotel") or "\u2014")
r += 1

prop = "New Property" if body.get("propertyType") == "new" else "Renovation"
section("PROJECT DETAILS")
field_row("Avg Room Rent", body.get("avgRoomRent") or "\u2014", "Timeline", body.get("timeline") or "\u2014")
field_row("Property Type", prop, "Project Stage" if body.get("propertyType") == "new" else "Message", body.get("projectStage") if body.get("propertyType") == "new" else (body.get("message") or "\u2014"))
r += 1

items = body["items"]
tu = sum(i["quantity"] for i in items)
section(f"SELECTED PRODUCTS ({len(items)} ITEMS, {tu} UNITS)")

hdrs = ["S.No", "Model", "Product Name", "Category", "Qty", "Rate (INR)", "Amount (INR)"]
for col, h in enumerate(hdrs, 1):
    c = ws.cell(row=r, column=col, value=h)
    c.font = f_hdr; c.fill = fc; c.alignment = ac if col in [1, 5] else al; c.border = bd
ws.row_dimensions[r].height = 24
r += 1

for i, item in enumerate(items):
    fill = fa if i % 2 == 1 else None
    vals = [(1, str(i+1), ac, f_data), (2, item["model"], al, f_model),
            (3, item["name"], al, f_data), (4, item["category"], al, Font(name="Calibri", size=11, color=M)),
            (5, item["quantity"], ac, f_qty), (6, "To be quoted", ac, f_muted), (7, "To be quoted", ar, f_muted)]
    for col, val, alg, fnt in vals:
        c = ws.cell(row=r, column=col, value=val)
        c.font = fnt; c.alignment = alg; c.border = bd
        if fill: c.fill = fill
    ws.row_dimensions[r].height = 24
    r += 1
r += 1

for label, value in [("Total Items", str(len(items))), ("Total Units", str(tu)), ("Estimated Total", "To be quoted")]:
    ws.merge_cells(f"E{r}:F{r}")
    c = ws.cell(row=r, column=5, value=label)
    c.font = f_sl; c.alignment = ar; c.border = bd
    ws.cell(row=r, column=6).border = bd
    c = ws.cell(row=r, column=7, value=value)
    c.font = f_sv; c.alignment = ar; c.border = bd
    ws.row_dimensions[r].height = 22
    r += 1

ws.merge_cells(f"E{r}:F{r}")
c = ws.cell(row=r, column=5, value="Grand Total")
c.font = f_total; c.fill = fb; c.alignment = ar; c.border = bd
ws.cell(row=r, column=6).fill = fb; ws.cell(row=r, column=6).border = bd
c = ws.cell(row=r, column=7, value="To be quoted")
c.font = f_total; c.fill = fb; c.alignment = ar; c.border = bd
ws.row_dimensions[r].height = 26
r += 2

ws.merge_cells(f"A{r}:G{r}")
c = ws.cell(row=r, column=1, value="Note: This is a quotation request, not a confirmed order. Rates, taxes, and delivery charges will be provided by the LaxRee sales team upon confirmation.")
c.font = f_note; c.fill = fn; c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
for col in range(2, 8): ws.cell(row=r, column=col).fill = fn
ws.row_dimensions[r].height = 36
r += 2

for text, fnt, h in [
    ("LaxRee Amenities", f_foot_b, 24),
    ("Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001", f_foot, 18),
    ("Phone: +91-92516 83662  |  Toll Free: 1800 120 7001  |  Email: contactus@laxree.com", f_foot, 18),
    ("ISO 9001  \u2022  ISO 14001  \u2022  ISO 45001  \u2022  CE CERTIFIED  \u2022  RoHS COMPLIANT", f_foot_c, 16),
]:
    ws.merge_cells(f"A{r}:G{r}")
    c = ws.cell(row=r, column=1, value=text)
    c.font = fnt; c.fill = fc; c.alignment = ac
    for col in range(2, 8): ws.cell(row=r, column=col).fill = fc
    ws.row_dimensions[r].height = h
    r += 1

ws.page_setup.orientation = "portrait"
ws.page_setup.paperSize = 9
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0
ws.sheet_properties.pageSetUpPr.fitToPage = True

wb.save(out)
`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    ensureScript();

    const outputPath = path.join(os.tmpdir(), `LaxRee_Quotation_${body.refNo}.xlsx`);
    const bodyJson = JSON.stringify(body);

    execSync(`/home/z/.venv/bin/python3 "${PYTHON_SCRIPT}" '${bodyJson.replace(/'/g, "'\\''")}' "${outputPath}"`, {
      timeout: 30000,
    });

    const fileBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);

    return new NextResponse(fileBuffer, {
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
