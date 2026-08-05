"use client";

import { useState, useEffect } from "react";

/**
 * usePageContent — fetches page content from the CMS API.
 * Returns the stored content merged with defaults.
 *
 * Usage:
 * const { content, loaded } = usePageContent("page:about-us", defaults);
 */
export function usePageContent<T extends Record<string, unknown>>(
  storageKey: string,
  defaults: T,
): { content: T; loaded: boolean } {
  const [content, setContent] = useState<T>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/cms?key=${storageKey}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.value) {
          setContent({ ...defaults, ...data.value });
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  return { content, loaded };
}
