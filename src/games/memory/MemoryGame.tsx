"use client";

import { useCallback, useEffect, useState } from "react";
import { createGame, flipCard, unflipCards } from "./engine";
import { DIFFICULTY_CONFIG, type Difficulty, type MemoryState } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";

const GAME_INFO = gameRegistry.memory;

export default function MemoryGame() {
  const [state, setState] = useState<MemoryState>(() => createGame("medium"));
  const [showModal, setShowModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const timer = useGameTimer(state.status === "playing");
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("memory", locale);

  const initGame = useCallback(
    (diff?: Difficulty) => {
      const d = diff ?? difficulty;
      setDifficulty(d);
      setState(createGame(d));
      setShowModal(false);
      timer.reset();
    },
    [difficulty, timer]
  );

  // Handle mismatch: auto-unflip after delay
  useEffect(() => {
    if (state.locked && state.flippedIndices.length === 2) {
      const timeout = setTimeout(() => {
        setState((s) => unflipCards(s));
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [state.locked, state.flippedIndices]);

  // Check win
  useEffect(() => {
    if (state.status === "won") {
      setTimeout(() => setShowModal(true), 500);
    }
  }, [state.status]);

  const handleCardClick = useCallback((index: number) => {
    setState((s) => flipCard(s, index));
  }, []);

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={difficulty === d ? "primary" : "secondary"}
              onClick={() => initGame(d)}
            >
              {t.difficulty[DIFFICULTY_CONFIG[d].label as keyof typeof t.difficulty]}
            </Button>
          ))}
          <Button size="sm" variant="secondary" onClick={() => initGame()}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            {t.memory.refresh}
          </Button>
        </div>
      }
      stats={
        <>
          <span>{t.common.moves} {state.moves}</span>
          <span>
            {t.memory.matches} {state.matches}/{state.totalPairs}
          </span>
          <span>{timer.formatted}</span>
        </>
      }
    >
      {/* Card Grid */}
      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          maxWidth: config.cols * 80,
        }}
      >
        {state.cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={card.flipped || card.matched || state.locked}
            className={cn(
              "aspect-square rounded-xl text-2xl sm:text-3xl transition-all duration-300 font-bold",
              "flex items-center justify-center",
              card.flipped || card.matched
                ? "bg-white dark:bg-gray-700 rotate-0 scale-100 shadow-sm"
                : "bg-primary-500 hover:bg-primary-600 cursor-pointer scale-[0.95]",
              card.matched && "opacity-70 ring-2 ring-green-400"
            )}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>

      <GameOverModal
        open={showModal}
        won={true}
        score={state.moves}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="memory"
        onClose={() => setShowModal(false)}
        onRestart={() => initGame()}
      />
    </GameShell>
  );
}
