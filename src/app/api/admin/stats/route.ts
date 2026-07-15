import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStaticBlogPosts } from "@/lib/admin/static-fallback";

export const runtime = "nodejs";

// GET — dashboard stats
// Falls back to static counts when DB is empty (Vercel serverless).
export async function GET() {
  try {
    let totalLeads = 0;
    let newLeads = 0;
    let totalBlogPosts = 0;
    let publishedPosts = 0;
    let recentLeads: Array<{
      id: string;
      name: string;
      phone: string;
      hotel: string | null;
      source: string;
      status: string;
      refNo: string | null;
      createdAt: Date | string;
    }> = [];

    const leadsBySource = {
      contact: 0,
      quotation: 0,
      catalogue: 0,
      dealer: 0,
      career: 0,
      enquiry: 0,
    };

    try {
      const [
        leadCount,
        newLeadCount,
        blogCount,
        publishedCount,
        recent,
        contactLeads,
        quotationLeads,
        catalogueLeads,
        dealerLeads,
        careerLeads,
        enquiryLeads,
      ] = await Promise.all([
        db.lead.count(),
        db.lead.count({ where: { status: "new" } }),
        db.blogPost.count(),
        db.blogPost.count({ where: { published: true } }),
        db.lead.findMany({
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
        }),
        db.lead.count({ where: { source: "contact-page" } }),
        db.lead.count({ where: { source: "quotation" } }),
        db.lead.count({ where: { source: "catalogue-page" } }),
        db.lead.count({ where: { source: "dealer-application" } }),
        db.lead.count({ where: { source: "career-application" } }),
        db.lead.count({ where: { source: "enquiry-modal" } }),
      ]);

      totalLeads = leadCount;
      newLeads = newLeadCount;
      totalBlogPosts = blogCount;
      publishedPosts = publishedCount;
      recentLeads = recent;
      leadsBySource.contact = contactLeads;
      leadsBySource.quotation = quotationLeads;
      leadsBySource.catalogue = catalogueLeads;
      leadsBySource.dealer = dealerLeads;
      leadsBySource.career = careerLeads;
      leadsBySource.enquiry = enquiryLeads;
    } catch (dbErr) {
      console.error("[ADMIN STATS DB ERROR]", dbErr);
    }

    // Fallback: if blog DB is empty, use static blog post count
    if (totalBlogPosts === 0) {
      const staticPosts = getStaticBlogPosts();
      totalBlogPosts = staticPosts.length;
      publishedPosts = staticPosts.filter((p) => p.published).length;
    }

    return NextResponse.json({
      ok: true,
      stats: {
        totalLeads,
        newLeads,
        totalBlogPosts,
        publishedPosts,
        leadsBySource,
      },
      recentLeads,
    });
  } catch (err) {
    console.error("[ADMIN STATS ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
