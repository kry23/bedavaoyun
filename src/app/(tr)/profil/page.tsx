"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { gameList } from "@/lib/game-registry";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || user.email || "Oyuncu");
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" />
          <div className="h-32 animate-pulse rounded-xl bg-[hsl(var(--muted))]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">Profil</h1>
        <p className="mb-6 text-[hsl(var(--muted-foreground))]">
          Profilinizi görmek için giriş yapmalısınız.
        </p>
        <Link
          href="/giris"
          className="inline-flex rounded-lg bg-primary-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  // Empty stats — will be populated from Supabase when connected
  const emptyGameStats: Record<
    string,
    { played: number; won: number; bestScore: number | null }
  > = {};
  gameList.forEach((game) => {
    emptyGameStats[game.slug] = { played: 0, won: 0, bestScore: null };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
          {username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{username}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {user.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid totalGames={0} totalWins={0} gameStats={emptyGameStats} />

      {/* Quick Links */}
      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold">Hızlı Erişim</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gameList.map((game) => (
            <Link
              key={game.slug}
              href={`/oyunlar/${game.slug}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-[hsl(var(--border))] p-3 text-center transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <span className="text-2xl">{game.icon}</span>
              <span className="text-xs font-medium">{game.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
