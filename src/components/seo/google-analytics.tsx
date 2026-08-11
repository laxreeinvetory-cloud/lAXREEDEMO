import Script from "next/script";

/**
 * GoogleAnalytics — injects Google Analytics 4 (gtag.js) only when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Set the env var on Vercel:
 *   Project Settings → Environment Variables → NEXT_PUBLIC_GA_MEASUREMENT_ID
 *   Value: G-XXXXXXXXXX (from Google Analytics → Admin → Data Streams)
 *
 * Once set, this component renders the gtag.js script tags. If the env var
 * is not set, nothing is rendered (no error, no console noise).
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || !gaId.startsWith("G-")) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
