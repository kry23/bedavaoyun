"use client";

import Script from "next/script";

const GA_ID_TR = process.env.NEXT_PUBLIC_GA_ID;
const GA_ID_EN = process.env.NEXT_PUBLIC_GA_ID_EN;

export function GoogleAnalytics({ locale = "tr" }: { locale?: string }) {
  const gaId = locale === "en" ? GA_ID_EN : GA_ID_TR;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
