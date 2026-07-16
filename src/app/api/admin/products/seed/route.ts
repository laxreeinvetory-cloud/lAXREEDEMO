import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CATALOGUE_CATEGORIES } from "@/lib/laxree/catalogue-data";
import { CATEGORIES } from "@/lib/laxree/site-data";

export const runtime = "nodejs";

// POST — seed Product & Category tables from existing static data.
// Only seeds each table if it is empty (count === 0).
// Categories come from CATEGORIES in site-data.ts (the 5 site categories).
// Products come from CATALOGUE_CATEGORIES (flattened nested product lists).
// Uses upsert by model (products) and slug (categories) for idempotency.
export async function POST() {
  try {
    const [productCount, categoryCount] = await Promise.all([
      db.product.count(),
      db.category.count(),
    ]);

    let categoriesSeeded = 0;
    if (categoryCount === 0) {
      for (let i = 0; i < CATEGORIES.length; i++) {
        const c = CATEGORIES[i];
        await db.category.upsert({
          where: { slug: c.slug },
          update: {
            name: c.name,
            count: c.count,
            blurb: c.blurb,
            image: c.image,
            span: c.span || "default",
            sortOrder: i,
          },
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
        categoriesSeeded++;
      }
    }

    let productsSeeded = 0;
    if (productCount === 0) {
      let order = 0;
      for (const cat of CATALOGUE_CATEGORIES) {
        for (const p of cat.products) {
          await db.product.upsert({
            where: { model: p.model },
            update: {
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
          productsSeeded++;
          order++;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      seeded: { products: productsSeeded, categories: categoriesSeeded },
      skipped: {
        products: productCount > 0,
        categories: categoryCount > 0,
      },
    });
  } catch (err) {
    console.error("[ADMIN PRODUCTS SEED ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
