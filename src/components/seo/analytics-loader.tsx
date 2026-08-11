"use client";

import { useEffect } from "react";

/**
 * AnalyticsLoader — client-side component that fetches analytics config
 * from the CMS and injects GA script + GSC meta tag at runtime.
 *
 * This avoids making the root layout async (which breaks CSS prerendering).
 * The GA script loads slightly later (after hydration) but this is fine —
 * GA4 handles this gracefully and still tracks all page views.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsLoader() {
  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/cms?key=analytics-config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.value) return;
        const config = data.value;
        const gaId = typeof config.gaId === "string" ? config.gaId : "";
        const gscToken =
          typeof config.gscToken === "string" ? config.gscToken : "";

        // Inject GSC verification meta tag if not already present
        if (
          gscToken &&
          !document.querySelector('meta[name="google-site-verification"]')
        ) {
          const meta = document.createElement("meta");
          meta.name = "google-site-verification";
          meta.content = gscToken;
          document.head.appendChild(meta);
        }

        // Inject GA4 script if not already present
        if (gaId && gaId.startsWith("G-") && !window.gtag) {
          const script1 = document.createElement("script");
          script1.async = true;
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(script1);

          window.dataLayer = window.dataLayer || [];
          window.gtag = function (...args: unknown[]) {
            window.dataLayer!.push(args);
          };
          window.gtag("js", new Date());
          window.gtag("config", gaId, {
            page_path: window.location.pathname,
          });
        }
      })
      .catch(() => {
        // Analytics is optional — don't crash
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
