import type { GameInfo } from "@/types/game";
import type { Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/utils/constants";
import { getLocalizedPath } from "@/i18n/navigation";

interface JsonLdProps {
  game: GameInfo;
  slug: string;
  locale?: Locale;
}

export function GameJsonLd({ game, slug, locale = "tr" }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${game.name} — ${SITE_NAME}`,
    description: game.description,
    url: `${SITE_URL}${getLocalizedPath("games", locale, slug)}`,
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
      name: SITE_NAME,
      url: SITE_URL,
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
  const description =
    locale === "en"
      ? "Free puzzle and classic games in your browser"
      : "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}${getLocalizedPath("games", locale)}?q={search_term_string}`,
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
