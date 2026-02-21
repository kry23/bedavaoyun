import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
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
        <link rel="manifest" href="/manifest.json" />
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
