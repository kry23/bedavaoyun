import type { Metadata } from "next";
import { GameCard } from "@/components/game/GameCard";
import { gameList } from "@/lib/game-registry";
import { getDictionary } from "@/i18n/get-dictionary";
import { getGameTranslation } from "@/i18n/game-translations";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "All Games",
  description:
    "Free browser games. Minesweeper, 2048, Snake and more!",
  alternates: enAlternates("/oyunlar", "/en/games"),
};

export default async function EnglishGamesPage() {
  const t = await getDictionary("en");
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t.games.allGames}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gameList.map((game) => {
          const gt = getGameTranslation(game.slug, "en");
          return <GameCard key={game.slug} game={{ ...game, ...gt }} />;
        })}
      </div>
    </div>
  );
}
