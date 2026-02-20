import { Gamepad2, Trophy, Users } from "lucide-react";
import { GameCard } from "@/components/game/GameCard";
import { gameList } from "@/lib/game-registry";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Ücretsiz Tarayıcı Oyunları
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
          Kayıt olmadan hemen oyna! Klasik bulmaca ve arcade oyunlarını
          tarayıcında ücretsiz oyna, skorunu kaydet ve sıralamada yarış.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-primary-500" />
            <span>{gameList.length} Oyun</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>Liderlik Tablosu</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span>Ücretsiz</span>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Oyunlar</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gameList.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
