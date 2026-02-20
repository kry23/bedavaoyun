import type { GameInfo } from "@/types/game";
import { SITE_NAME, SITE_URL } from "@/utils/constants";

interface JsonLdProps {
  game: GameInfo;
  slug: string;
}

export function GameJsonLd({ game, slug }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${game.name} — ${SITE_NAME}`,
    description: game.description,
    url: `${SITE_URL}/oyunlar/${slug}`,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    inLanguage: "tr",
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

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar",
    inLanguage: "tr",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/oyunlar?q={search_term_string}`,
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
