/**
 * Seed script — populates the Neon Postgres database with initial data.
 *
 * Run with:  DATABASE_URL="<neon-url>" bun run db:seed
 *
 * Seeds:
 *  - Default admin user (admin / laxree2026)
 *  - 5 categories from site-data.ts CATEGORIES
 *  - 28 products from catalogue-data.ts CATALOGUE_CATEGORIES
 *  - 12 blog posts from site-data.ts BLOG_POSTS
 *  - Default theme/homepage/seo/company settings via SiteContent
 */

import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { CATALOGUE_CATEGORIES } from "../src/lib/laxree/catalogue-data";
import { CATEGORIES, BLOG_POSTS } from "../src/lib/laxree/site-data";

const db = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding Neon Postgres database...\n");

  // ── 1. Admin user ──────────────────────────────────────────
  const existingAdmin = await db.adminUser.count();
  if (existingAdmin === 0) {
    await db.adminUser.create({
      data: {
        username: "admin",
        password: hashPassword("laxree2026"),
        name: "LaxRee Admin",
        role: "superadmin",
      },
    });
    console.log("✓ Admin user created (admin / laxree2026)");
  } else {
    console.log("→ Admin user already exists, skipping");
  }

  // ── 2. Categories ──────────────────────────────────────────
  const existingCats = await db.category.count();
  if (existingCats === 0) {
    for (let i = 0; i < CATEGORIES.length; i++) {
      const c = CATEGORIES[i];
      await db.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: {
          slug: c.slug,
          name: c.name,
          count: c.count,
          blurb: c.blurb,
          image: c.image,
          span: c.span || "default",
          sortOrder: i,
        },
      });
    }
    console.log(`✓ ${CATEGORIES.length} categories created`);
  } else {
    console.log("→ Categories already exist, skipping");
  }

  // ── 3. Products ────────────────────────────────────────────
  const existingProducts = await db.product.count();
  if (existingProducts === 0) {
    let order = 0;
    for (const cat of CATALOGUE_CATEGORIES) {
      for (const p of cat.products) {
        await db.product.upsert({
          where: { model: p.model },
          update: {},
          create: {
            model: p.model,
            name: p.name,
            category: p.category,
            image: p.image,
            description: p.description,
            specs: JSON.stringify(p.specs),
            price: "",
            featured: false,
            published: true,
            sortOrder: order,
          },
        });
        order++;
      }
    }
    console.log(`✓ ${order} products created`);
  } else {
    console.log("→ Products already exist, skipping");
  }

  // ── 4. Blog posts ──────────────────────────────────────────
  const existingPosts = await db.blogPost.count();
  if (existingPosts === 0) {
    for (let i = 0; i < BLOG_POSTS.length; i++) {
      const p = BLOG_POSTS[i];
      await db.blogPost.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          title: p.title,
          category: p.category,
          excerpt: p.excerpt,
          content: JSON.stringify([{ type: "paragraph", text: p.excerpt }]),
          image: p.image,
          author: "LaxRee Editorial Team",
          authorRole: "Hospitality Procurement Insights",
          date: p.date,
          readTime: p.readTime,
          published: true,
        },
      });
    }
    console.log(`✓ ${BLOG_POSTS.length} blog posts created`);
  } else {
    console.log("→ Blog posts already exist, skipping");
  }

  // ── 5. Default settings (theme/homepage/seo/company) ──────
  const defaultSettings: Record<string, Record<string, unknown>> = {
    theme: {
      primaryColor: "#12100D",
      secondaryColor: "#F5F1E8",
      accentColor: "#B08D57",
      successColor: "#1E4638",
      textColor: "#F5F1E8",
      mutedColor: "#A89B8C",
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

  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await db.siteContent.findUnique({ where: { key } });
    if (!existing) {
      await db.siteContent.create({
        data: { key, value: JSON.stringify(value) },
      });
      console.log(`✓ Settings: "${key}" created`);
    } else {
      console.log(`→ Settings: "${key}" already exists, skipping`);
    }
  }

  console.log("\n✅ Seeding complete!\n");

  // Final counts
  const counts = {
    admins: await db.adminUser.count(),
    categories: await db.category.count(),
    products: await db.product.count(),
    blogPosts: await db.blogPost.count(),
    leads: await db.lead.count(),
    settings: await db.siteContent.count(),
  };
  console.log("📊 Final counts:");
  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
