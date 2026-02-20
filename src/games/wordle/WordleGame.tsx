"use client";

import { useCallback, useState } from "react";
import {
  createRandomGame,
  addLetter,
  removeLetter,
  submitGuess,
} from "./engine";
import {
  KEYBOARD_ROWS,
  MAX_ATTEMPTS,
  WORD_LENGTH,
  type LetterState,
  type WordleState,
} from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useKeyboard } from "@/hooks/useKeyboard";
import { RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

const GAME_INFO = gameRegistry.wordle;

const STATE_COLORS: Record<LetterState, string> = {
  correct: "bg-green-500 text-white border-green-500",
  present: "bg-yellow-500 text-white border-yellow-500",
  absent: "bg-gray-500 text-white border-gray-500",
  empty: "border-[hsl(var(--border))] bg-transparent",
};

export default function WordleGame() {
  const [state, setState] = useState<WordleState>(createRandomGame);
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKey = useCallback(
    (key: string) => {
      if (state.status !== "playing") return;

      if (key === "Enter" || key === "ENTER") {
        if (state.currentGuess.length !== WORD_LENGTH) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          toast.error("5 harfli bir kelime girin");
          return;
        }
        const newState = submitGuess(state);
        setState(newState);
        if (newState.status !== "playing") {
          setTimeout(() => setShowModal(true), 500);
        }
      } else if (key === "Backspace" || key === "⌫") {
        setState(removeLetter(state));
      } else if (/^[A-ZÇĞİÖŞÜa-zçğıöşü]$/.test(key)) {
        setState(addLetter(state, key));
      }
    },
    [state]
  );

  useKeyboard(handleKey, state.status === "playing");

  const initGame = useCallback(() => {
    setState(createRandomGame());
    setShowModal(false);
  }, []);

  // Build display grid
  const rows = [];
  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    const cells = [];
    for (let c = 0; c < WORD_LENGTH; c++) {
      let letter = "";
      let cellState: LetterState = "empty";

      if (r < state.guesses.length) {
        letter = state.guesses[r][c].letter;
        cellState = state.guesses[r][c].state;
      } else if (r === state.guesses.length) {
        letter = state.currentGuess[c] || "";
      }

      cells.push(
        <div
          key={c}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded border-2 text-lg font-bold uppercase transition-all sm:h-14 sm:w-14 sm:text-xl",
            STATE_COLORS[cellState],
            letter && cellState === "empty" && "border-[hsl(var(--muted-foreground))]"
          )}
        >
          {letter}
        </div>
      );
    }
    rows.push(
      <div
        key={r}
        className={cn(
          "flex gap-1.5",
          r === state.guesses.length && shake && "animate-[shake_0.5s_ease-in-out]"
        )}
      >
        {cells}
      </div>
    );
  }

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <Button size="sm" variant="secondary" onClick={initGame}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Yeni Kelime
        </Button>
      }
    >
      {/* Letter Grid */}
      <div className="flex flex-col items-center gap-1.5">{rows}</div>

      {/* On-screen Keyboard */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((key) => {
              const letterState = state.usedLetters[key];
              const isWide = key === "ENTER" || key === "⌫";

              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={cn(
                    "flex h-12 items-center justify-center rounded font-semibold text-sm transition-colors",
                    isWide ? "px-3 min-w-[52px]" : "w-8 sm:w-9",
                    letterState
                      ? STATE_COLORS[letterState]
                      : "bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))]"
                  )}
                >
                  {key === "ENTER" ? "↵" : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Reveal target on loss */}
      {state.status === "lost" && (
        <p className="mt-4 text-center text-sm">
          Doğru kelime:{" "}
          <strong className="text-primary-600">{state.target}</strong>
        </p>
      )}

      <GameOverModal
        open={showModal}
        won={state.status === "won"}
        score={state.guesses.length}
        scoreLabel="Tahmin"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
