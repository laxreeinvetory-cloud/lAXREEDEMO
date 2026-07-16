import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  message?: string;
  source?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadBody;

    // Minimal server-side validation
    const errors: Record<string, string> = {};
    if (!body.name || body.name.trim().length < 2) {
      errors.name = "Name is required";
    }
    if (!body.phone || body.phone.replace(/\D/g, "").length < 8) {
      errors.phone = "A valid contact number is required";
    }
    if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
      errors.email = "Invalid email format";
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, errors, message: "Validation failed" },
        { status: 400 }
      );
    }

    // Save to database (best-effort — don't fail the user-facing response
    // if the DB is unavailable on Vercel. The enquiry is still logged.)
    let leadId = `lead-${Date.now()}`;
    let dbSaved = false;
    try {
      const lead = await db.lead.create({
        data: {
          name: body.name!,
          phone: body.phone!,
          email: body.email || null,
          category: body.category || null,
          message: body.message || null,
          source: body.source || "contact-page",
        },
      });
      leadId = lead.id;
      dbSaved = true;
    } catch (dbErr) {
      // DB unavailable — log but still return success to the user.
      console.error("[LEAD DB SAVE ERROR]", dbErr);
    }

    return NextResponse.json({
      ok: true,
      id: leadId,
      dbSaved,
      message:
        "Thank you for your enquiry. Our team will reach out within 24 hours.",
    });
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Server error while processing your enquiry",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/lead",
    method: "POST",
    fields: ["name", "email", "phone", "category", "message", "source"],
  });
}
