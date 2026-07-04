import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  message?: string;
  source?: string;
};

/**
 * POST /api/lead
 * Accepts enquiry/catalogue form submissions. In a real deployment this
 * would persist to the database + notify the sales team. For this build
 * we log to server stdout and echo back a success payload.
 */
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

    // Persist: log to stdout (would be db.lead.create({...}) in prod)
    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      receivedAt: new Date().toISOString(),
      ...body,
    };
    console.log("[LEAD]", JSON.stringify(lead));

    return NextResponse.json({
      ok: true,
      id: lead.id,
      message:
        "Thank you for your enquiry. Our team will reach out within 24 hours.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message: "Server error while processing your enquiry",
        detail: err instanceof Error ? err.message : "Unknown error",
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
