"use client";

import { gameList } from "@/lib/game-registry";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[hsl(var(--border))] p-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

interface StatsGridProps {
  totalGames: number;
  totalWins: number;
  gameStats: Record<
    string,
    { played: number; won: number; bestScore: number | null }
  >;
}

export function StatsGrid({ totalGames, totalWins, gameStats }: StatsGridProps) {
  const t = useTranslation();
  const locale = useLocale();
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
  const dateLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label={t.profile.totalGames} value={totalGames} icon="🎮" />
        <StatCard label={t.profile.wins} value={totalWins} icon="🏆" />
        <StatCard label={t.profile.winRate} value={`%${winRate}`} icon="📊" />
      </div>

      {/* Per-game Stats */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">{t.profile.perGame}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {gameList.map((game) => {
            const stats = gameStats[game.slug];
            const played = stats?.played || 0;
            const won = stats?.won || 0;
            const best = stats?.bestScore;
            const gt = getGameTranslation(game.slug, locale);

            return (
              <div
                key={game.slug}
                className="rounded-xl border border-[hsl(var(--border))] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{game.icon}</span>
                  <h4 className="font-medium">{gt.name}</h4>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[hsl(var(--muted-foreground))]">{t.profile.game}</p>
                    <p className="font-medium">{played}</p>
                  </div>
                  <div>
                    <p className="text-[hsl(var(--muted-foreground))]">{t.profile.wins}</p>
                    <p className="font-medium">{won}</p>
                  </div>
                  <div>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      {t.profile.bestScore} {gt.scoreLabel}
                    </p>
                    <p className="font-medium">
                      {best !== null && best !== undefined
                        ? best.toLocaleString(dateLocale)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
