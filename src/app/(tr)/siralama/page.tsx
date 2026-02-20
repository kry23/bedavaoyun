import type { Metadata } from "next";
import Link from "next/link";
import { gameList } from "@/lib/game-registry";

export const metadata: Metadata = {
  title: "Sıralama",
  description: "Oyun liderlik tabloları. En iyi oyuncuları gör!",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Sıralama</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {gameList.map((game) => (
          <Link
            key={game.slug}
            href={`/siralama/${game.slug}`}
            className="flex items-center gap-4 rounded-xl border border-[hsl(var(--border))] p-4 transition-colors hover:bg-[hsl(var(--muted))]"
          >
            <span className="text-3xl">{game.icon}</span>
            <div>
              <h2 className="font-semibold">{game.name}</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Liderlik tablosunu gör
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
