"use client";

import { useCallback, useState } from "react";
import { createGame, moveTile, moveDirection } from "./engine";
import type { PuzzleState } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";

const GAME_INFO = gameRegistry.puzzle15;

export default function Puzzle15Game() {
  const [state, setState] = useState<PuzzleState>(createGame);
  const [showModal, setShowModal] = useState(false);
  const timer = useGameTimer(state.status === "playing");
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("puzzle15", locale);

  const initGame = useCallback(() => {
    setState(createGame());
    setShowModal(false);
    timer.reset();
  }, [timer]);

  const handleTileClick = useCallback((r: number, c: number) => {
    setState((s) => {
      const next = moveTile(s, r, c);
      if (next.status === "won") {
        setTimeout(() => setShowModal(true), 300);
      }
      return next;
    });
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (state.status !== "playing") return;
      const dirMap: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up",
        w: "up",
        ArrowDown: "down",
        s: "down",
        ArrowLeft: "left",
        a: "left",
        ArrowRight: "right",
        d: "right",
      };
      const dir = dirMap[key];
      if (dir) {
        setState((s) => {
          const next = moveDirection(s, dir);
          if (next.status === "won") {
            setTimeout(() => setShowModal(true), 300);
          }
          return next;
        });
      }
    },
    [state.status]
  );

  useKeyboard(handleKey, state.status === "playing");

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <Button size="sm" variant="secondary" onClick={initGame}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> {t.puzzle15.shuffle}
        </Button>
      }
      stats={
        <>
          <span>{t.common.moves} {state.moves}</span>
          <span>{timer.formatted}</span>
        </>
      }
    >
      <div className="inline-grid grid-cols-4 gap-1.5 rounded-xl bg-[hsl(var(--muted))] p-2">
        {state.grid.map((row, r) =>
          row.map((tile, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => tile !== null && handleTileClick(r, c)}
              disabled={tile === null}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold transition-all sm:h-20 sm:w-20 sm:text-2xl",
                tile !== null
                  ? "bg-primary-500 text-white shadow-md hover:bg-primary-600 active:scale-95 cursor-pointer"
                  : "bg-transparent"
              )}
            >
              {tile}
            </button>
          ))
        )}
      </div>

      <GameOverModal
        open={showModal}
        won={true}
        score={state.moves}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="puzzle15"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
