"use client";

import type { ReactNode } from "react";
import type { GameInfo } from "@/types/game";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getLocalizedPath } from "@/i18n/navigation";

interface GameShellProps {
  game: GameInfo;
  children: ReactNode;
  controls?: ReactNode;
  stats?: ReactNode;
}

export function GameShell({ game, children, controls, stats }: GameShellProps) {
  const t = useTranslation();
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[600px] items-center justify-between">
        <Link
          href={getLocalizedPath("games", locale)}
          className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.nav.games}
        </Link>
        <h1 className="text-xl font-bold">
          {game.icon} {game.name}
        </h1>
        <div className="w-16" />
      </div>

      {controls && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {controls}
        </div>
      )}

      {stats && (
        <div className="flex items-center gap-4 text-sm font-medium">
          {stats}
        </div>
      )}

      {children}

      {/* Ad below game */}
      <AdBanner slot="GAME_BOTTOM_AD" format="horizontal" className="mt-4 w-full max-w-[600px]" />
    </div>
  );
}
