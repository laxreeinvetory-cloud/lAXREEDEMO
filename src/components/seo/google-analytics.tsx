import Script from "next/script";

/**
 * GoogleAnalytics — injects Google Analytics 4 (gtag.js).
 *
 * The GA Measurement ID is read from the CMS (key "analytics-config",
 * field "gaId") which is set by the admin from /admin/analytics.
 * Falls back to NEXT_PUBLIC_GA_MEASUREMENT_ID env var if CMS has no value.
 *
 * If no ID is configured, nothing is rendered.
 */
export function GoogleAnalytics({ gaId }: { gaId?: string }) {
  const id = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!id || !id.startsWith("G-")) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None; Secure',
          });
        `}
      </Script>
    </>
  );
}
