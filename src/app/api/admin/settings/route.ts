import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Generic key-value settings store backed by the SiteContent table.
 * Each row's `value` column is a JSON-encoded object. The owner edits
 * these through /admin/appearance (theme + homepage) — and a future
 * follow-up can wire the persisted values into the live site.
 */

const DEFAULTS: Record<string, Record<string, unknown>> = {
  theme: {
    primaryColor: "#12100D", // charcoal
    secondaryColor: "#F5F1E8", // ivory
    accentColor: "#B08D57", // brass
    successColor: "#1E4638", // emerald
    textColor: "#F5F1E8",
    mutedColor: "#A89B8C", // sand
    fontDisplay: "Fraunces",
    fontBody: "Work Sans",
    fontMono: "IBM Plex Mono",
    cardRadius: "24px",
    pillRadius: "999px",
  },
  homepage: {
    heroEyebrow: "Hotel Supplies Redefined",
    heroTitle: "LaxRee Amenities",
    heroSubtitle:
      "India's most comprehensive hospitality procurement partner — from minibars to roofing systems, delivered to 1,347+ properties.",
    heroPrimaryCta: "Request Quotation",
    heroSecondaryCta: "Download Catalogue",
    heroStats: [
      { value: 1347, suffix: "+", label: "Projects" },
      { value: 11, suffix: "+", label: "Years" },
      { value: 700, suffix: "+", label: "SKUs" },
      { value: 7, suffix: "+", label: "Certifications" },
    ],
  },
  seo: {
    siteTitle: "LaxRee Amenities — Hotel Supplies Redefined",
    siteDescription:
      "India's leading hospitality procurement partner. 700+ SKUs across minibars, furniture, linen, roofing & dome structures. Trusted by 1,347+ properties.",
    defaultKeywords: [
      "hotel supplies",
      "hospitality procurement",
      "hotel minibar",
      "hotel furniture",
      "hotel linen",
      "roofing solutions",
      "dome structures",
      "India hotel supplier",
    ],
    ogImage: "/images/og/default.jpg",
    twitterHandle: "@laxree",
    robots: "index, follow",
    googleVerification: "",
    pages: [
      { path: "/", title: "LaxRee Amenities — Hotel Supplies Redefined", description: "India's leading hospitality procurement partner with 700+ SKUs." },
      { path: "/about-us", title: "About Us — LaxRee Amenities", description: "11+ years of hospitality procurement expertise." },
      { path: "/products", title: "Products — LaxRee Amenities", description: "Browse 700+ hotel supply SKUs across 5 categories." },
      { path: "/catalogue", title: "Catalogue — LaxRee Amenities", description: "Download our master and category catalogues." },
      { path: "/contact-us", title: "Contact Us — LaxRee Amenities", description: "Get in touch for quotations and dealer opportunities." },
    ],
  },
  company: {
    name: "LaxRee Amenities",
    tagline: "Hotel Supplies Redefined",
    phoneDisplay: "+91-92516 83662",
    phoneHref: "+919251683662",
    tollFreeDisplay: "1800 120 7001",
    tollFreeHref: "18001207001",
    whatsapp: "919251683662",
    email: "contactus@laxree.com",
    careersEmail: "hr@laxree.com",
    address:
      "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001",
    socials: {
      facebook: "https://facebook.com",
      x: "https://x.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    },
  },
};

// Lightweight deep merge — DB wins over defaults for any key present.
function mergeWithDefaults(
  key: string,
  stored: unknown
): Record<string, unknown> {
  const base = DEFAULTS[key];
  if (!base) {
    // Unknown key — return whatever is stored (or empty object) verbatim.
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      return stored as Record<string, unknown>;
    }
    return {};
  }
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return { ...base };
  }
  return { ...base, ...(stored as Record<string, unknown>) };
}

export async function GET() {
  try {
    const rows = await db.siteContent.findMany();
    const storedMap: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        storedMap[row.key] = JSON.parse(row.value);
      } catch {
        // Corrupt JSON — skip; the default will be used.
        storedMap[row.key] = null;
      }
    }

    // Build response: every known default key is guaranteed present,
    // plus any extra keys the owner has stashed (e.g. seo, company).
    const settings: Record<string, Record<string, unknown>> = {};
    for (const key of Object.keys(DEFAULTS)) {
      settings[key] = mergeWithDefaults(key, storedMap[key]);
    }
    for (const key of Object.keys(storedMap)) {
      if (!settings[key]) {
        settings[key] = mergeWithDefaults(key, storedMap[key]);
      }
    }

    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("[ADMIN SETTINGS ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const key: unknown = body?.key;
    const value: unknown = body?.value;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { ok: false, message: "`key` (string) is required" },
        { status: 400 }
      );
    }
    if (value === undefined || value === null) {
      return NextResponse.json(
        { ok: false, message: "`value` is required" },
        { status: 400 }
      );
    }

    await db.siteContent.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ADMIN SETTINGS ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
