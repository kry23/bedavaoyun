import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { gameRegistry, gameSlugs } from "@/lib/game-registry";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { trAlternates } from "@/i18n/alternates";

interface Props {
  params: { gameSlug: string };
}

export function generateStaticParams() {
  return gameSlugs.map((slug) => ({ gameSlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = gameRegistry[params.gameSlug];
  if (!game) return {};
  return {
    title: `${game.name} Sıralaması`,
    description: `${game.name} liderlik tablosu — en iyi oyuncuları gör!`,
    alternates: trAlternates(`/siralama/${params.gameSlug}`, `/en/leaderboard/${params.gameSlug}`),
  };
}

export default function GameLeaderboardPage({ params }: Props) {
  const game = gameRegistry[params.gameSlug];
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/siralama"
          className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          Sıralama
        </Link>
        <span className="text-[hsl(var(--muted-foreground))]">/</span>
        <h1 className="text-2xl font-bold">
          {game.icon} {game.name}
        </h1>
      </div>

      <LeaderboardTable
        gameSlug={params.gameSlug}
        scoreLabel={game.scoreLabel}
      />

      <div className="mt-8 text-center">
        <Link
          href={`/oyunlar/${params.gameSlug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {game.icon} {game.name} Oyna
        </Link>
      </div>
    </div>
  );
}
