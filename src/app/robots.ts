import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/cart"],
      },
    ],
    sitemap: "https://l-axreedemo.vercel.app/sitemap.xml",
  };
}
