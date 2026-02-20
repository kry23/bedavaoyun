"use client";

import { useCallback, useState } from "react";
import { createGame, selectCell, placeNumber, eraseCell, toggleNote } from "./engine";
import { DIFFICULTY_CONFIG, type Difficulty, type SudokuState } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw, Eraser, Pencil } from "lucide-react";
import { cn } from "@/utils/cn";

const GAME_INFO = gameRegistry.sudoku;

export default function SudokuGame() {
  const [state, setState] = useState<SudokuState>(() => createGame("medium"));
  const [showModal, setShowModal] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const timer = useGameTimer(state.status === "playing");
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("sudoku", locale);

  const initGame = useCallback(
    (diff?: Difficulty) => {
      const d = diff ?? difficulty;
      setDifficulty(d);
      setState(createGame(d));
      setShowModal(false);
      setNoteMode(false);
      timer.reset();
    },
    [difficulty, timer]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setState((s) => selectCell(s, row, col));
    },
    []
  );

  const handleNumber = useCallback(
    (num: number) => {
      setState((s) => {
        if (noteMode) return toggleNote(s, num);
        const next = placeNumber(s, num);
        if (next.status === "won") {
          setTimeout(() => setShowModal(true), 300);
        }
        return next;
      });
    },
    [noteMode]
  );

  const handleErase = useCallback(() => {
    setState((s) => eraseCell(s));
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (state.status !== "playing") return;
      const num = parseInt(key);
      if (num >= 1 && num <= 9) {
        handleNumber(num);
      } else if (key === "Backspace" || key === "Delete") {
        handleErase();
      } else if (key === "n" || key === "N") {
        setNoteMode((m) => !m);
      }
    },
    [state.status, handleNumber, handleErase]
  );

  useKeyboard(handleKey, state.status === "playing");

  // Determine which cells share row/col/box with selected
  const selected = state.selectedCell;
  const selectedValue = selected ? state.grid[selected[0]][selected[1]].value : 0;

  function getCellHighlight(r: number, c: number): string {
    if (!selected) return "";
    const [sr, sc] = selected;
    if (r === sr && c === sc) return "bg-primary-200 dark:bg-primary-800";
    const sameRow = r === sr;
    const sameCol = c === sc;
    const sameBox =
      Math.floor(r / 3) === Math.floor(sr / 3) &&
      Math.floor(c / 3) === Math.floor(sc / 3);
    if (sameRow || sameCol || sameBox)
      return "bg-primary-50 dark:bg-primary-900/30";
    return "";
  }

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
            {t.sudoku.refresh}
          </Button>
        </div>
      }
      stats={
        <>
          <span>{t.sudoku.errors} {state.mistakes}/{state.maxMistakes}</span>
          <span>{timer.formatted}</span>
        </>
      }
    >
      {/* Sudoku Grid */}
      <div className="inline-grid grid-cols-9 border-2 border-[hsl(var(--foreground))]">
        {state.grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={cn(
                "flex h-9 w-9 items-center justify-center text-sm font-semibold sm:h-10 sm:w-10 sm:text-base transition-colors",
                "border border-[hsl(var(--border))]",
                // Thick borders for 3x3 boxes
                c % 3 === 2 && c !== 8 && "border-r-2 border-r-[hsl(var(--foreground))]",
                r % 3 === 2 && r !== 8 && "border-b-2 border-b-[hsl(var(--foreground))]",
                // Cell states
                cell.given
                  ? "text-[hsl(var(--foreground))] font-bold"
                  : cell.isError
                    ? "text-red-500"
                    : "text-primary-600 dark:text-primary-400",
                // Highlight same value
                selectedValue && cell.value === selectedValue && !cell.isError
                  ? "bg-primary-100 dark:bg-primary-900/50"
                  : getCellHighlight(r, c)
              )}
            >
              {cell.value !== 0 ? (
                cell.value
              ) : cell.notes.size > 0 ? (
                <span className="grid grid-cols-3 gap-0 text-[7px] leading-[10px] text-[hsl(var(--muted-foreground))]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n}>{cell.notes.has(n) ? n : ""}</span>
                  ))}
                </span>
              ) : null}
            </button>
          ))
        )}
      </div>

      {/* Number Pad + Controls */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-lg font-bold transition-colors hover:bg-primary-200 dark:hover:bg-primary-800 sm:h-11 sm:w-11"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={noteMode ? "primary" : "secondary"}
            onClick={() => setNoteMode((m) => !m)}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            {noteMode ? t.sudoku.noteOn : t.sudoku.noteOff}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleErase}>
            <Eraser className="mr-1 h-3.5 w-3.5" />
            {t.sudoku.delete}
          </Button>
        </div>
      </div>

      <GameOverModal
        open={showModal}
        won={state.status === "won"}
        score={timer.elapsed}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="sudoku"
        onClose={() => setShowModal(false)}
        onRestart={() => initGame()}
      />
    </GameShell>
  );
}
