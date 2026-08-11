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
 * Returns { overrides, loaded }:
 *   - overrides: the map (empty until fetch completes)
 *   - loaded: false until fetch completes — use this to suppress image
 *     rendering so the user doesn't see a flash of the old/default image
 *
 * Usage:
 *   const { overrides, loaded } = useImageOverrides();
 *   const img = overrides["category:room-amenities"] || defaultImage;
 *   // Only render <img> when loaded === true to avoid flash
 */
export function useImageOverrides(): {
  overrides: Record<string, string>;
  loaded: boolean;
} {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/cms?key=images", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) {
          setLoaded(true);
          return;
        }
        if (data?.value && typeof data.value === "object" && !Array.isArray(data.value)) {
          setOverrides(data.value as Record<string, string>);
        }
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { overrides, loaded };
}
