import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { gameRegistry, gameSlugs } from "@/lib/game-registry";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { getGameTranslation } from "@/i18n/game-translations";
import { enAlternates } from "@/i18n/alternates";

interface Props {
  params: { gameSlug: string };
}

export function generateStaticParams() {
  return gameSlugs.map((slug) => ({ gameSlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = gameRegistry[params.gameSlug];
  if (!game) return {};
  const gt = getGameTranslation(params.gameSlug, "en");
  return {
    title: `${gt.name} Leaderboard`,
    description: `${gt.name} leaderboard — see the best players!`,
    alternates: enAlternates(`/siralama/${params.gameSlug}`, `/en/leaderboard/${params.gameSlug}`),
  };
}

export default function EnglishGameLeaderboardPage({ params }: Props) {
  const game = gameRegistry[params.gameSlug];
  if (!game) notFound();

  const gt = getGameTranslation(params.gameSlug, "en");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/en/leaderboard"
          className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          Leaderboard
        </Link>
        <span className="text-[hsl(var(--muted-foreground))]">/</span>
        <h1 className="text-2xl font-bold">
          {game.icon} {gt.name}
        </h1>
      </div>

      <LeaderboardTable
        gameSlug={params.gameSlug}
        scoreLabel={gt.scoreLabel}
      />

      <div className="mt-8 text-center">
        <Link
          href={`/en/games/${params.gameSlug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {game.icon} Play {gt.name}
        </Link>
      </div>
    </div>
  );
}
