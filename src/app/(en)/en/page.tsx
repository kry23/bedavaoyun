import type { Metadata } from "next";
import { Gamepad2, Trophy, Users } from "lucide-react";
import { GameCard } from "@/components/game/GameCard";
import { gameList } from "@/lib/game-registry";
import { getDictionary } from "@/i18n/get-dictionary";
import { getGameTranslation } from "@/i18n/game-translations";
import { SITE_NAME_EN, SITE_URL, SITE_URL_EN } from "@/utils/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME_EN} — Free puzzle and classic games in your browser`,
  description: "Free browser games. Minesweeper, 2048, Snake, Wordle and more!",
  alternates: {
    canonical: SITE_URL_EN,
    languages: {
      "tr": SITE_URL,
      "en": SITE_URL_EN,
    },
  },
};

export default async function EnglishHomePage() {
  const t = await getDictionary("en");
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {t.home.hero}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
          {t.home.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-primary-500" />
            <span>
              {gameList.length} {t.home.gamesCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{t.home.leaderboardLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span>{t.common.free}</span>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">{t.nav.games}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gameList.map((game) => {
            const gt = getGameTranslation(game.slug, "en");
            return <GameCard key={game.slug} game={{ ...game, ...gt }} />;
          })}
        </div>
      </section>
    </div>
  );
}
