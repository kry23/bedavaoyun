import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { WebsiteJsonLd } from "@/components/game/JsonLd";
import { SITE_NAME, SITE_URL } from "@/utils/constants";
import Script from "next/script";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Tarayıcıda ücretsiz bulmaca ve klasik oyunlar`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar",
    images: ["/og/default.png"],
  },
  keywords: [
    "bedava oyun", "ücretsiz oyun", "tarayıcı oyunları", "online oyun",
    "mayın tarlası", "2048", "yılan oyunu", "wordle türkçe", "kelime tahmin",
    "sudoku oyna", "hafıza oyunu", "tetris oyna", "15 bulmaca",
    "beyin oyunları", "bulmaca oyunları", "mobil oyun", "indirmeden oyna",
  ],
  alternates: {
    canonical: SITE_URL,
    languages: {
      "tr": SITE_URL,
      "en": `${SITE_URL}/en`,
    },
  },
  verification: {
    google: "zxhKXzL9Hnn3v5DzPKQp4z35Uuj6fZxTFMVzcrqC_CU",
  },
};

export default function TurkishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <WebsiteJsonLd />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <AppShell locale="tr">{children}</AppShell>
    </html>
  );
}
