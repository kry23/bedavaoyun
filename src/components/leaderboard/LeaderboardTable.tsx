"use client";

import { useEffect, useState } from "react";
import { RankBadge } from "./RankBadge";

interface ScoreEntry {
  id: string;
  score: number;
  difficulty: string | null;
  duration: number | null;
  created_at: string;
  profiles: {
    username: string | null;
    avatar: string | null;
  } | null;
}

interface LeaderboardTableProps {
  gameSlug: string;
  scoreLabel: string;
}

function formatTimeScore(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const remainder = ms % 1000;
  return `${seconds}.${String(remainder).padStart(3, "0")}s`;
}

export function LeaderboardTable({
  gameSlug,
  scoreLabel,
}: LeaderboardTableProps) {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/leaderboard/${gameSlug}?period=${period}&limit=50`)
      .then((res) => {
        if (!res.ok) throw new Error("Veriler yüklenemedi");
        return res.json();
      })
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [gameSlug, period]);

  const displayScore = (entry: ScoreEntry) => {
    if (gameSlug === "minesweeper") return formatTimeScore(entry.score);
    return entry.score.toLocaleString("tr-TR");
  };

  const periods = [
    { value: "daily" as const, label: "Bugün" },
    { value: "weekly" as const, label: "Bu Hafta" },
    { value: "all" as const, label: "Tüm Zamanlar" },
  ];

  return (
    <div>
      {/* Period Filter */}
      <div className="mb-4 flex gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p.value
                ? "bg-primary-600 text-white"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-[hsl(var(--muted))]"
            />
          ))}
        </div>
      ) : error ? (
        <p className="py-8 text-center text-[hsl(var(--muted-foreground))]">
          {error}
        </p>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-[hsl(var(--muted-foreground))]">
          Henüz skor kaydı yok. İlk sen ol!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] text-left text-[hsl(var(--muted-foreground))]">
                <th className="pb-2 pl-2 pr-4 font-medium">Sıra</th>
                <th className="pb-2 pr-4 font-medium">Oyuncu</th>
                <th className="pb-2 pr-4 font-medium">{scoreLabel}</th>
                <th className="pb-2 pr-4 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-[hsl(var(--border))] last:border-0"
                >
                  <td className="py-2.5 pl-2 pr-4">
                    <RankBadge rank={i + 1} />
                  </td>
                  <td className="py-2.5 pr-4 font-medium">
                    {entry.profiles?.username || "Anonim"}
                  </td>
                  <td className="py-2.5 pr-4">{displayScore(entry)}</td>
                  <td className="py-2.5 pr-4 text-[hsl(var(--muted-foreground))]">
                    {new Date(entry.created_at).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
