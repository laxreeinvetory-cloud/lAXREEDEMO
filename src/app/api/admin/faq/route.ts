import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * FAQ admin API — backed by the SiteContent key-value store.
 *
 * All FAQ items are persisted as a single JSON array under the
 * `faq` key in the SiteContent table. CRUD operations read the
 * full array, modify it, and write it back.
 *
 * Item shape:
 *   { id, question, answer, category, sortOrder, published }
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  published: boolean;
};

const FAQ_KEY = "faq";

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "What products does LaxRee Amenities manufacture?",
    answer:
      "LaxRee Amenities manufactures 700+ SKUs across 5 categories: Room Amenities (minibars, kettles, safes, door locks), Furniture (room, lobby, outdoor), Linen (bed, bath, table), Roofing Solutions (metal sheets, insulated panels), and Dome Structures (geodesic domes for resorts and events).",
    category: "Products",
    sortOrder: 0,
    published: true,
  },
  {
    id: "faq-2",
    question: "Do you supply pan-India?",
    answer:
      "Yes, we supply to hotels, resorts, and hospitality projects across all states in India. We have delivered to 1,347+ properties in our 11+ years of operation, with a dedicated logistics network ensuring timely delivery to even remote locations.",
    category: "Logistics",
    sortOrder: 1,
    published: true,
  },
  {
    id: "faq-3",
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "MOQ varies by product. For most room amenities like minibars and kettles, the MOQ is 10 units. For furniture and linen, it's typically 20-50 units. For roofing and dome structures, projects are custom-quoted. Contact us with your specific requirement for exact MOQ details.",
    category: "Ordering",
    sortOrder: 2,
    published: true,
  },
  {
    id: "faq-4",
    question: "Can I get a custom quotation for my hotel project?",
    answer:
      "Absolutely. Use our Quotation Cart to add the products you need, then submit a quotation request with your project details. Our sales team will provide a detailed rate list within 24 hours. You can also call us at +91-92516 83662 or WhatsApp for immediate assistance.",
    category: "Ordering",
    sortOrder: 3,
    published: true,
  },
  {
    id: "faq-5",
    question: "Are your products certified?",
    answer:
      "Yes, our products carry ISO 9001, ISO 14001, ISO 45001, CE, and RoHS certifications. We follow stringent quality control processes at our Ajmer manufacturing facility to ensure every product meets international hospitality standards.",
    category: "Quality",
    sortOrder: 4,
    published: true,
  },
  {
    id: "faq-6",
    question: "Do you offer dealer or distributor partnerships?",
    answer:
      "Yes, we actively expand our dealer network across India. If you have an existing hospitality supplies business and want to partner with LaxRee, visit our Dealers page and submit the application form. Our sales team will evaluate and respond within 48 hours.",
    category: "Partnership",
    sortOrder: 5,
    published: true,
  },
  {
    id: "faq-7",
    question: "What warranty do you provide on your products?",
    answer:
      "Warranty periods vary by product category: Minibars and electronic items carry 1-2 years warranty, furniture has 2-5 years structural warranty, linen products have 6 months manufacturing defect warranty, and roofing sheets carry 10-15 years warranty against manufacturing defects.",
    category: "Quality",
    sortOrder: 6,
    published: true,
  },
  {
    id: "faq-8",
    question: "Can I visit your showroom or manufacturing facility?",
    answer:
      "Yes, our showroom and manufacturing facility is located at Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001. We're open Monday to Saturday, 9:30 AM to 6:30 PM. We recommend calling ahead to schedule a guided tour of our hospitality exhibition centre.",
    category: "General",
    sortOrder: 7,
    published: true,
  },
  {
    id: "faq-9",
    question: "Do you provide installation support?",
    answer:
      "Yes, for bulk orders and project supplies, we provide on-site installation support across India. This includes minibar installation, door lock system setup, furniture assembly, and roofing installation. Installation charges vary by location and scope — contact us for details.",
    category: "Services",
    sortOrder: 8,
    published: true,
  },
  {
    id: "faq-10",
    question: "How can I download your product catalogue?",
    answer:
      "Visit our Catalogue page to download our master catalogue (covering all 700+ SKUs) and category-specific catalogues. Most catalogues are available for instant download without email registration. Use discount code LAXREE10 for 10% off your first order.",
    category: "General",
    sortOrder: 9,
    published: true,
  },
];

function isFaqItem(value: unknown): value is FaqItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.question === "string" &&
    typeof v.answer === "string" &&
    typeof v.category === "string" &&
    typeof v.sortOrder === "number" &&
    typeof v.published === "boolean"
  );
}

async function readFaqs(): Promise<FaqItem[]> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: FAQ_KEY } });
    if (!row) return [...DEFAULT_FAQS];
    try {
      const parsed = JSON.parse(row.value);
      if (Array.isArray(parsed) && parsed.every(isFaqItem)) {
        return parsed as FaqItem[];
      }
      return [...DEFAULT_FAQS];
    } catch {
      return [...DEFAULT_FAQS];
    }
  } catch (err) {
    console.error("[ADMIN FAQ READ ERROR]", err);
    return [...DEFAULT_FAQS];
  }
}

async function writeFaqs(items: FaqItem[]): Promise<void> {
  await db.siteContent.upsert({
    where: { key: FAQ_KEY },
    update: { value: JSON.stringify(items) },
    create: { key: FAQ_KEY, value: JSON.stringify(items) },
  });
}

function sortByOrder(items: FaqItem[]): FaqItem[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

/* ─────────────────────────────────────────────────────────────
   GET — list all FAQs (sorted by sortOrder asc). Returns
   defaults if DB is empty / corrupt / unreachable.
   ?published=true filters out unpublished items (public site).
   ───────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  let items = await readFaqs();
  items = sortByOrder(items);

  const onlyPublished = req.nextUrl.searchParams.get("published") === "true";
  if (onlyPublished) {
    items = items.filter((i) => i.published);
  }

  return NextResponse.json({ ok: true, faqs: items });
}

/* ─────────────────────────────────────────────────────────────
   POST — create a new FAQ item. Body:
   { question, answer, category, sortOrder?, published? }
   ───────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, category, sortOrder, published } = body ?? {};

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { ok: false, message: "`question` is required" },
        { status: 400 }
      );
    }
    if (!answer || typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json(
        { ok: false, message: "`answer` is required" },
        { status: 400 }
      );
    }
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { ok: false, message: "`category` is required" },
        { status: 400 }
      );
    }

    const items = await readFaqs();
    const newItem: FaqItem = {
      id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      question: question.trim(),
      answer: answer.trim(),
      category,
      sortOrder:
        typeof sortOrder === "number" && Number.isFinite(sortOrder)
          ? sortOrder
          : items.length,
      published: typeof published === "boolean" ? published : true,
    };

    items.push(newItem);
    await writeFaqs(items);

    return NextResponse.json({ ok: true, faq: newItem });
  } catch (err) {
    console.error("[ADMIN FAQ POST ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   PATCH — update an existing FAQ item by id. Body: { id, ...fields }
   ───────────────────────────────────────────────────────────── */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...fields } = body ?? {};

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { ok: false, message: "`id` is required" },
        { status: 400 }
      );
    }

    const items = await readFaqs();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { ok: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    const current = items[idx];
    const updated: FaqItem = {
      id: current.id,
      question:
        typeof fields.question === "string"
          ? fields.question.trim()
          : current.question,
      answer:
        typeof fields.answer === "string"
          ? fields.answer.trim()
          : current.answer,
      category:
        typeof fields.category === "string"
          ? fields.category
          : current.category,
      sortOrder:
        typeof fields.sortOrder === "number" &&
        Number.isFinite(fields.sortOrder)
          ? fields.sortOrder
          : current.sortOrder,
      published:
        typeof fields.published === "boolean"
          ? fields.published
          : current.published,
    };

    items[idx] = updated;
    await writeFaqs(items);

    return NextResponse.json({ ok: true, faq: updated });
  } catch (err) {
    console.error("[ADMIN FAQ PATCH ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   DELETE — remove an FAQ item by id. Query: ?id=...
   ───────────────────────────────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, message: "`id` query parameter is required" },
        { status: 400 }
      );
    }

    const items = await readFaqs();
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) {
      return NextResponse.json(
        { ok: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    await writeFaqs(next);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ADMIN FAQ DELETE ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
