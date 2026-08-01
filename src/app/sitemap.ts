import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/laxree/site-data";
import {
  CATALOGUE_PARENTS,
  getCategoriesByParent,
} from "@/lib/laxree/catalogue-data";

const BASE_URL = "https://l-axreedemo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/clients`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/catalogue`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/dealers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/career`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/contact-us`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/experience-center`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Category pages (parent level: /products/[parentSlug])
  const categoryPages: MetadataRoute.Sitemap = CATALOGUE_PARENTS.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Item type pages (child level: /products/[parentSlug]/[childSlug])
  // Build the correct parent→child URL for each sub-category instead of
  // hardcoding "/products/amenities/..." which only matches 1 of 8 parents.
  const itemTypePages: MetadataRoute.Sitemap = CATALOGUE_PARENTS.flatMap((parent) => {
    const children = getCategoriesByParent(parent.slug);
    return children.map((child) => ({
      url: `${BASE_URL}/products/${parent.slug}/${child.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  });

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...itemTypePages, ...blogPages];
}
