import type { GameInfo } from "@/types/game";
import type { Locale } from "@/i18n/config";
import { SITE_NAME, SITE_NAME_EN, SITE_URL, SITE_URL_EN } from "@/utils/constants";
import { getLocalizedPath } from "@/i18n/navigation";

function getSiteUrl(locale: Locale) {
  return locale === "en" ? SITE_URL_EN : SITE_URL;
}

function getSiteName(locale: Locale) {
  return locale === "en" ? SITE_NAME_EN : SITE_NAME;
}

interface JsonLdProps {
  game: GameInfo;
  slug: string;
  locale?: Locale;
}

export function GameJsonLd({ game, slug, locale = "tr" }: JsonLdProps) {
  const siteUrl = getSiteUrl(locale);
  const siteName = getSiteName(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${game.name} — ${siteName}`,
    description: game.description,
    url: `${siteUrl}${getLocalizedPath("games", locale, slug)}`,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: locale === "tr" ? "TRY" : "USD",
    },
    inLanguage: locale,
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd({ locale = "tr" }: { locale?: Locale }) {
  const siteUrl = getSiteUrl(locale);
  const siteName = getSiteName(locale);
  const description =
    locale === "en"
      ? "Free puzzle and classic games in your browser"
      : "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}${getLocalizedPath("games", locale)}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
