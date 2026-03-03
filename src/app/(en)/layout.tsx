import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { WebsiteJsonLd } from "@/components/game/JsonLd";
import { SITE_NAME_EN, SITE_URL, SITE_URL_EN } from "@/utils/constants";
import Script from "next/script";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME_EN} — Free puzzle and classic games in your browser`,
    template: `%s | ${SITE_NAME_EN}`,
  },
  description: "Free puzzle and classic games in your browser",
  metadataBase: new URL(SITE_URL_EN),
  openGraph: {
    title: SITE_NAME_EN,
    description: "Free puzzle and classic games in your browser",
    url: SITE_URL_EN,
    siteName: SITE_NAME_EN,
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME_EN,
    description: "Free puzzle and classic games in your browser",
    images: ["/og/default.png"],
  },
  keywords: [
    "free games", "browser games", "online games", "minesweeper",
    "2048", "snake game", "wordle", "word guess", "sudoku online",
    "memory game", "tetris online", "15 puzzle", "brain games",
    "puzzle games", "mobile games", "play without download",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
  },
  alternates: {
    canonical: SITE_URL_EN,
    languages: {
      "tr": SITE_URL,
      "en": SITE_URL_EN,
    },
  },
};

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.en.json" />
        <WebsiteJsonLd locale="en" />
        {process.env.NEXT_PUBLIC_GA_ID_EN && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID_EN}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init-en" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID_EN}');
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <AppShell locale="en">{children}</AppShell>
    </html>
  );
}
