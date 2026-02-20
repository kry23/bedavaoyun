import Link from "next/link";
import { gameList } from "@/lib/game-registry";

interface RelatedGamesProps {
  currentSlug: string;
}

export function RelatedGames({ currentSlug }: RelatedGamesProps) {
  const others = gameList.filter((g) => g.slug !== currentSlug);

  return (
    <section className="mt-12 border-t border-[hsl(var(--border))] pt-8">
      <h2 className="mb-4 text-center text-lg font-bold">Diğer Oyunlar</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {others.map((game) => (
          <Link
            key={game.slug}
            href={`/oyunlar/${game.slug}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(var(--border))] p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-2xl">{game.icon}</span>
            <span className="text-sm font-medium">{game.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
