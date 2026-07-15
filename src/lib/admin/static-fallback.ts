/**
 * Static-data fallbacks for admin endpoints.
 *
 * On Vercel serverless, SQLite writes don't persist across cold starts,
 * so the DB is effectively empty on every request. These helpers return
 * the existing static catalogue / blog data in the same shape the DB
 * would return, so the admin panel always shows real content.
 *
 * Each helper is only used as a fallback when the DB query returns empty
 * (or throws). On local dev (persistent SQLite) the real DB data wins.
 */

import { CATALOGUE_CATEGORIES } from "@/lib/laxree/catalogue-data";
import { CATEGORIES, BLOG_POSTS } from "@/lib/laxree/site-data";

// ── Products ─────────────────────────────────────────────────
export type ProductRow = {
  id: string;
  model: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specs: string; // JSON string
  price: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function getStaticProducts(categoryFilter?: string): ProductRow[] {
  const all: ProductRow[] = [];
  let order = 0;
  for (const cat of CATALOGUE_CATEGORIES) {
    for (const p of cat.products) {
      all.push({
        id: `static-product-${p.model}`,
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
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      });
      order++;
    }
  }
  if (categoryFilter && categoryFilter !== "all") {
    return all.filter((p) => p.category === categoryFilter);
  }
  return all;
}

// ── Categories ───────────────────────────────────────────────
export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  count: number;
  blurb: string;
  image: string;
  span: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function getStaticCategories(): CategoryRow[] {
  return CATEGORIES.map((c, i) => ({
    id: `static-category-${c.slug}`,
    slug: c.slug,
    name: c.name,
    count: c.count,
    blurb: c.blurb,
    image: c.image,
    span: c.span || "default",
    sortOrder: i,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  }));
}

// ── Blog Posts ───────────────────────────────────────────────
export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string; // JSON string
  image: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export function getStaticBlogPosts(): BlogPostRow[] {
  return BLOG_POSTS.map((p, i) => ({
    id: `static-blog-${p.slug}`,
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    content: JSON.stringify([
      {
        type: "paragraph",
        text: p.excerpt,
      },
    ]),
    image: p.image,
    author: "LaxRee Editorial Team",
    authorRole: "Hospitality Procurement Insights",
    date: p.date,
    readTime: p.readTime,
    published: true,
    createdAt: new Date(2025, 0, i + 1).toISOString(),
    updatedAt: new Date(2025, 0, i + 1).toISOString(),
  }));
}
