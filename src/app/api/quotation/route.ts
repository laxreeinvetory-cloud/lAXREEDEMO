import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type QuotationItem = {
  model: string;
  name: string;
  category: string;
  quantity: number;
};

type QuotationBody = {
  name: string;
  email: string;
  phone: string;
  hotel: string;
  message: string;
  items: QuotationItem[];
};

const SALES_WHATSAPP = "919251683660";
const SALES_EMAIL = "contactus@laxree.com";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuotationBody;

    // Validation
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ ok: false, message: "Name is required" }, { status: 400 });
    }
    if (!body.phone || body.phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ ok: false, message: "Valid phone is required" }, { status: 400 });
    }
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ ok: false, message: "Cart is empty" }, { status: 400 });
    }

    // Generate quotation reference number
    const refNo = `LXQ-${Date.now().toString().slice(-8)}`;
    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Build quotation text for WhatsApp message
    const itemLines = body.items
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} (${item.model}) — Qty: ${item.quantity}`
      )
      .join("\n");

    const whatsappMessage = `*New Quotation Request — LaxRee Amenities*
━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Ref:* ${refNo}
📅 *Date:* ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━
*Customer Details:*
👤 Name: ${body.name}
📞 Phone: ${body.phone}
📧 Email: ${body.email || "—"}
🏨 Hotel: ${body.hotel || "—"}
💬 Message: ${body.message || "—"}
━━━━━━━━━━━━━━━━━━━━━━━━━
*Selected Products (${body.items.length} items):*
${itemLines}
━━━━━━━━━━━━━━━━━━━━━━━━━
Please provide rates for the above items.`;

    // Encode for WhatsApp URL
    const whatsappUrl = `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

    // Build CSV/Excel data
    const csvRows = [
      ["LaxRee Amenities — Quotation Request"],
      [`Reference: ${refNo}`],
      [`Date: ${date}`],
      [],
      ["Customer Details"],
      ["Name", body.name],
      ["Phone", body.phone],
      ["Email", body.email || "—"],
      ["Hotel/Company", body.hotel || "—"],
      ["Message", body.message || "—"],
      [],
      ["S.No", "Model", "Product Name", "Category", "Quantity", "Rate (INR)", "Amount (INR)"],
      ...body.items.map((item, i) => [
        String(i + 1),
        item.model,
        item.name,
        item.category,
        String(item.quantity),
        "—",
        "—",
      ]),
      [],
      ["Note: Rates will be provided by LaxRee sales team upon confirmation."],
      ["Contact: +91-92516 83662 | contactus@laxree.com"],
    ];
    const csv = csvRows.map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");

    // Log the quotation
    console.log(`[QUOTATION] ${refNo} — ${body.name} — ${body.items.length} items`);

    return NextResponse.json({
      ok: true,
      refNo,
      date,
      whatsappUrl,
      csv,
      itemCount: body.items.length,
      message: "Quotation request generated successfully.",
    });
  } catch (err) {
    console.error("[QUOTATION ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error generating quotation" },
      { status: 500 }
    );
  }
}
