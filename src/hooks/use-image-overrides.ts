"use client";

import { useEffect, useState } from "react";

/**
 * useImageOverrides
 *
 * Fetches admin-controlled image overrides from the CMS (key "images").
 * The override map uses prefixed keys:
 *   - "category:<slug>"      → homepage category bento image
 *   - "parent:<slug>"        → /products page parent category card image
 *   - "subcategory:<slug>"   → /products/[slug] "Browse by Type" sub-category card image
 *
 * Usage:
 *   const overrides = useImageOverrides();
 *   const img = overrides["category:room-amenities"] || defaultImage;
 *
 * The hook returns an empty map on first render and fills in once the
 * fetch resolves. Components default to their static fallback while loading.
 */
export function useImageOverrides(): Record<string, string> {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/cms?key=images", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.value) return;
        const map = data.value;
        if (typeof map === "object" && !Array.isArray(map)) {
          setOverrides(map as Record<string, string>);
        }
      })
      .catch(() => {
        // keep empty overrides — components use static fallbacks
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return overrides;
}
