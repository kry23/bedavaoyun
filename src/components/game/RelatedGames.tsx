"use client";

import Link from "next/link";
import { gameList } from "@/lib/game-registry";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getLocalizedPath } from "@/i18n/navigation";
import { getGameTranslation } from "@/i18n/game-translations";

interface RelatedGamesProps {
  currentSlug: string;
}

export function RelatedGames({ currentSlug }: RelatedGamesProps) {
  const t = useTranslation();
  const locale = useLocale();
  const others = gameList.filter((g) => g.slug !== currentSlug);

  return (
    <section className="mt-12 border-t border-[hsl(var(--border))] pt-8">
      <h2 className="mb-4 text-center text-lg font-bold">{t.games.relatedGames}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {others.map((game) => {
          const gt = getGameTranslation(game.slug, locale);
          return (
            <Link
              key={game.slug}
              href={getLocalizedPath("games", locale, game.slug)}
              className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(var(--border))] p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-2xl">{game.icon}</span>
              <span className="text-sm font-medium">{gt.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
