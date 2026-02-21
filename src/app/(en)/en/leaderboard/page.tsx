import type { Metadata } from "next";
import Link from "next/link";
import { gameList } from "@/lib/game-registry";
import { getDictionary } from "@/i18n/get-dictionary";
import { getGameTranslation } from "@/i18n/game-translations";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Game leaderboards. See the best players!",
  alternates: enAlternates("/siralama", "/en/leaderboard"),
};

export default async function EnglishLeaderboardPage() {
  const t = await getDictionary("en");
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t.leaderboard.title}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {gameList.map((game) => {
          const gt = getGameTranslation(game.slug, "en");
          return (
            <Link
              key={game.slug}
              href={`/en/leaderboard/${game.slug}`}
              className="flex items-center gap-4 rounded-xl border border-[hsl(var(--border))] p-4 transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <span className="text-3xl">{game.icon}</span>
              <div>
                <h2 className="font-semibold">{gt.name}</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {t.leaderboard.viewLeaderboard}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
