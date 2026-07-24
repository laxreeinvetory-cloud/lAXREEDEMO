"use client";

import { useState, useEffect } from "react";
import { SITE } from "@/lib/laxree/site-data";

/**
 * Resolved site settings — CMS values overlay the static SITE defaults
 * so every field always has a value (CMS wins when set).
 */
export type SiteSettings = {
  siteName: string;
  tagline: string;
  logo: string;
  copyright: string;
  companyDescription: string;
  gst: string;
  pan: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  tollFreeDisplay: string;
  tollFreeHref: string;
  whatsapp: string;
  email: string;
  careersEmail: string;
  workingHours: string;
  mapEmbed: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  x: string;
};

const DEFAULTS: SiteSettings = {
  siteName: SITE.name,
  tagline: SITE.tagline,
  logo: "/images/laxree-logo.png",
  copyright: "LaxRee Amenities © 2026 — All Rights Reserved",
  companyDescription: "",
  gst: "",
  pan: "",
  address: SITE.address,
  phoneDisplay: SITE.phoneDisplay,
  phoneHref: SITE.phoneHref,
  tollFreeDisplay: SITE.tollFreeDisplay,
  tollFreeHref: SITE.tollFreeHref,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  careersEmail: SITE.careersEmail,
  workingHours: "Mon–Sat, 9:30 AM – 6:30 PM IST",
  mapEmbed: "",
  facebook: SITE.socials.facebook,
  linkedin: SITE.socials.linkedin,
  youtube: SITE.socials.youtube,
  x: SITE.socials.x,
};

/**
 * useSiteSettings — fetches the admin-managed site:settings from the CMS
 * and overlays them on the static defaults. Used by Navbar, Footer,
 * Contact page, and any component that must reflect admin edits live.
 *
 * The fetch runs on mount with `cache: "no-store"` so every page load
 * reflects the latest saved settings (no stale CDN cache).
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/cms?key=site:settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.value) {
          setSettings({ ...DEFAULTS, ...data.value });
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loaded };
}
