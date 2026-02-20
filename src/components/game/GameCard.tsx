"use client";

import Link from "next/link";
import type { GameInfo } from "@/types/game";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getLocalizedPath } from "@/i18n/navigation";

interface GameCardProps {
  game: GameInfo;
}

export function GameCard({ game }: GameCardProps) {
  const t = useTranslation();
  const locale = useLocale();

  return (
    <Link
      href={getLocalizedPath("games", locale, game.slug)}
      className="group relative flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={{ backgroundColor: `${game.color}15` }}
      >
        {game.icon}
      </div>
      <h3 className="text-lg font-semibold">{game.name}</h3>
      <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
        {game.description}
      </p>
      <span
        className="mt-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: game.color }}
      >
        {t.common.play}
      </span>
    </Link>
  );
}
