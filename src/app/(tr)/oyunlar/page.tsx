import type { Metadata } from "next";
import { GameCard } from "@/components/game/GameCard";
import { gameList } from "@/lib/game-registry";

export const metadata: Metadata = {
  title: "Tüm Oyunlar",
  description: "Ücretsiz tarayıcı oyunları. Mayın Tarlası, 2048, Yılan ve daha fazlası!",
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Tüm Oyunlar</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gameList.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
