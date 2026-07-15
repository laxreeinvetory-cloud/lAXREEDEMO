import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [totalLeads, newLeads, totalBlogPosts, publishedPosts] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "new" } }),
      db.blogPost.count(),
      db.blogPost.count({ where: { published: true } }),
    ]);

    // Get recent leads
    const recentLeads = await db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        hotel: true,
        source: true,
        status: true,
        refNo: true,
        createdAt: true,
      },
    });

    // Get leads by source
    const contactLeads = await db.lead.count({ where: { source: "contact-page" } });
    const quotationLeads = await db.lead.count({ where: { source: "quotation" } });
    const catalogueLeads = await db.lead.count({ where: { source: "catalogue-page" } });
    const dealerLeads = await db.lead.count({ where: { source: "dealer-application" } });
    const careerLeads = await db.lead.count({ where: { source: "career-application" } });
    const enquiryLeads = await db.lead.count({ where: { source: "enquiry-modal" } });

    return NextResponse.json({
      ok: true,
      stats: {
        totalLeads,
        newLeads,
        totalBlogPosts,
        publishedPosts,
        leadsBySource: {
          contact: contactLeads,
          quotation: quotationLeads,
          catalogue: catalogueLeads,
          dealer: dealerLeads,
          career: careerLeads,
          enquiry: enquiryLeads,
        },
      },
      recentLeads,
    });
  } catch (err) {
    console.error("[ADMIN STATS ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
