"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import {
  createGame,
  selectCell,
  moveSelection,
  placeNumber,
  eraseCell,
  toggleNote,
  undo,
  useHint as applyHint,
  getNumberCounts,
} from "./engine";
import { DIFFICULTY_CONFIG, type Difficulty, type SudokuState } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw, Eraser, Pencil, Undo2, Lightbulb, Pause, Play } from "lucide-react";
import { cn } from "@/utils/cn";

const GAME_INFO = gameRegistry.sudoku;

export default function SudokuGame() {
  const [state, setState] = useState<SudokuState>(() => createGame("medium"));
  const [showModal, setShowModal] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [paused, setPaused] = useState(false);
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [popCell, setPopCell] = useState<string | null>(null);
  const timer = useGameTimer(state.status === "playing" && !paused);
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("sudoku", locale);
  const gridRef = useRef<HTMLDivElement>(null);

  const isFinished = state.status === "won" || state.status === "lost";
  const numberCounts = getNumberCounts(state.grid);

  const initGame = useCallback(
    (diff?: Difficulty) => {
      const d = diff ?? difficulty;
      setDifficulty(d);
      setState(createGame(d));
      setShowModal(false);
      setNoteMode(false);
      setPaused(false);
      setErrorCells(new Set());
      timer.reset();
    },
    [difficulty, timer]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isFinished || paused) return;
      setState((s) => selectCell(s, row, col));
    },
    [isFinished, paused]
  );

  const handleNumber = useCallback(
    (num: number) => {
      if (isFinished || paused) return;
      setState((s) => {
        if (noteMode) return toggleNote(s, num);
        const next = placeNumber(s, num);

        // Trigger error animation
        if (next.mistakes > s.mistakes && s.selectedCell) {
          const key = `${s.selectedCell[0]}-${s.selectedCell[1]}`;
          setErrorCells((prev) => new Set(prev).add(key));
          setTimeout(() => {
            setErrorCells((prev) => {
              const next = new Set(prev);
              next.delete(key);
              return next;
            });
          }, 400);
        }

        // Trigger pop animation on correct placement
        if (next.mistakes === s.mistakes && s.selectedCell && s.grid[s.selectedCell[0]][s.selectedCell[1]].value === 0) {
          const key = `${s.selectedCell[0]}-${s.selectedCell[1]}`;
          setPopCell(key);
          setTimeout(() => setPopCell(null), 200);
        }

        if (next.status === "won" || next.status === "lost") {
          setTimeout(() => setShowModal(true), 500);
        }
        return next;
      });
    },
    [noteMode, isFinished, paused]
  );

  const handleErase = useCallback(() => {
    if (isFinished || paused) return;
    setState((s) => eraseCell(s));
  }, [isFinished, paused]);

  const handleUndo = useCallback(() => {
    if (isFinished || paused) return;
    setState((s) => undo(s));
  }, [isFinished, paused]);

  const handleHint = useCallback(() => {
    if (isFinished || paused) return;
    setState((s) => {
      const next = applyHint(s);
      if (next.status === "won") {
        setTimeout(() => setShowModal(true), 500);
      }
      return next;
    });
  }, [isFinished, paused]);

  const handleKey = useCallback(
    (key: string) => {
      if (isFinished || paused) return;
      const num = parseInt(key);
      if (num >= 1 && num <= 9) {
        handleNumber(num);
      } else if (key === "Backspace" || key === "Delete") {
        handleErase();
      } else if (key === "n" || key === "N") {
        setNoteMode((m) => !m);
      } else if (key === "z" || key === "Z") {
        handleUndo();
      } else if (key === "h" || key === "H") {
        handleHint();
      } else if (key === "ArrowUp") {
        setState((s) => moveSelection(s, "up"));
      } else if (key === "ArrowDown") {
        setState((s) => moveSelection(s, "down"));
      } else if (key === "ArrowLeft") {
        setState((s) => moveSelection(s, "left"));
      } else if (key === "ArrowRight") {
        setState((s) => moveSelection(s, "right"));
      }
    },
    [isFinished, paused, handleNumber, handleErase, handleUndo, handleHint]
  );

  useKeyboard(handleKey, state.status === "playing" && !paused);

  // Focus grid on mount
  useEffect(() => {
    gridRef.current?.focus();
  }, []);

  const selected = state.selectedCell;
  const selectedValue = selected ? state.grid[selected[0]][selected[1]].value : 0;

  function getCellHighlight(r: number, c: number): string {
    if (!selected) return "";
    const [sr, sc] = selected;
    if (r === sr && c === sc) return "bg-[#BBDEFB] dark:bg-primary-800";
    const sameRow = r === sr;
    const sameCol = c === sc;
    const sameBox =
      Math.floor(r / 3) === Math.floor(sr / 3) &&
      Math.floor(c / 3) === Math.floor(sc / 3);
    if (sameRow || sameCol || sameBox)
      return "bg-[#E2EBFA] dark:bg-primary-900/30";
    return "";
  }

  // Mistakes dots indicator (sudoku.com style)
  const mistakeDots = Array.from({ length: state.maxMistakes }, (_, i) => (
    <span
      key={i}
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full transition-colors",
        i < state.mistakes
          ? "bg-red-500"
          : "bg-gray-300 dark:bg-gray-600"
      )}
    />
  ));

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
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[hsl(var(--muted-foreground))]">{t.sudoku.errors}</span>
            <div className="flex items-center gap-1">
              {mistakeDots}
            </div>
            <span className="font-medium">{state.mistakes}/{state.maxMistakes}</span>
          </div>
          {state.hintsUsed > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[hsl(var(--muted-foreground))]">{t.sudoku.hintsUsed}</span>
              <span className="font-medium">{state.hintsUsed}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (!isFinished) setPaused((p) => !p);
              }}
              className="p-0.5 rounded hover:bg-[hsl(var(--muted))] transition-colors"
              title={paused ? t.sudoku.resume : t.sudoku.pause}
            >
              {paused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
            <span className="font-mono font-medium tabular-nums">{timer.formatted}</span>
          </div>
        </div>
      }
    >
      {/* Sudoku Grid */}
      <div className="relative">
        <div
          ref={gridRef}
          tabIndex={0}
          className="inline-grid grid-cols-9 rounded-lg border-2 border-[hsl(var(--foreground))] outline-none overflow-hidden"
        >
          {state.grid.map((row, r) =>
            row.map((cell, c) => {
              const cellKey = `${r}-${c}`;
              const isSelected = selected && r === selected[0] && c === selected[1];
              const hasError = errorCells.has(cellKey);
              const hasPop = popCell === cellKey;
              const sameValueHighlight =
                selectedValue && cell.value === selectedValue && !cell.isError && !isSelected;

              return (
                <button
                  key={cellKey}
                  onClick={() => handleCellClick(r, c)}
                  className={cn(
                    "flex items-center justify-center text-base font-semibold transition-colors duration-100",
                    "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12",
                    "border-[0.5px] border-gray-300 dark:border-gray-600",
                    // 3x3 box thick borders
                    c % 3 === 2 && c !== 8 && "border-r-[2px] border-r-[hsl(var(--foreground))]",
                    r % 3 === 2 && r !== 8 && "border-b-[2px] border-b-[hsl(var(--foreground))]",
                    c % 3 === 0 && c !== 0 && "border-l-[2px] border-l-[hsl(var(--foreground))]",
                    r % 3 === 0 && r !== 0 && "border-t-[2px] border-t-[hsl(var(--foreground))]",
                    // Cell states - sudoku.com inspired colors
                    cell.given
                      ? "text-[hsl(var(--foreground))] font-bold"
                      : cell.isError
                        ? "text-red-500 dark:text-red-400"
                        : "text-[#325AAF] dark:text-primary-400",
                    // Same value highlight (soft blue like sudoku.com)
                    sameValueHighlight
                      ? "bg-[#C3D7F7] dark:bg-primary-900/50"
                      : getCellHighlight(r, c),
                    // Animations
                    hasError && "animate-sudoku-error",
                    hasPop && "animate-sudoku-pop",
                    // Paused state - hide values
                    paused && "text-transparent select-none"
                  )}
                >
                  {cell.value !== 0 ? (
                    <span className={cn("leading-none", cell.given ? "text-[1.1em]" : "")}>
                      {cell.value}
                    </span>
                  ) : cell.notes.size > 0 && !paused ? (
                    <span className="grid grid-cols-3 gap-0 text-[8px] leading-[11px] sm:text-[9px] sm:leading-[12px] text-[hsl(var(--muted-foreground))]">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <span key={n} className="text-center">
                          {cell.notes.has(n) ? n : ""}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {/* Pause overlay */}
        {paused && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setPaused(false)}
          >
            <div className="flex flex-col items-center gap-2">
              <Play className="h-10 w-10 text-primary-600" />
              <span className="text-lg font-semibold">{t.sudoku.resume}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls Row: Undo, Erase, Notes, Hint */}
      <div className="mt-4 flex items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={handleUndo}
          disabled={isFinished || paused || state.history.length === 0}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            "hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Z"
        >
          <Undo2 className="h-6 w-6" />
          <span className="text-[11px] font-medium">{t.sudoku.undo}</span>
        </button>

        <button
          onClick={handleErase}
          disabled={isFinished || paused}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            "hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Delete"
        >
          <Eraser className="h-6 w-6" />
          <span className="text-[11px] font-medium">{t.sudoku.delete}</span>
        </button>

        <button
          onClick={() => setNoteMode((m) => !m)}
          disabled={isFinished || paused}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            noteMode
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              : "hover:bg-[hsl(var(--muted))]",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="N"
        >
          <Pencil className="h-6 w-6" />
          <span className="text-[11px] font-medium">
            {noteMode ? t.sudoku.noteOn : t.sudoku.noteOff}
          </span>
        </button>

        <button
          onClick={handleHint}
          disabled={isFinished || paused}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            "hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="H"
        >
          <Lightbulb className="h-6 w-6" />
          <span className="text-[11px] font-medium">{t.sudoku.hint}</span>
        </button>
      </div>

      {/* Number Pad */}
      <div className="mt-3 flex justify-center gap-1 sm:gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isCompleted = numberCounts[num] >= 9;
          return (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              disabled={isFinished || paused || isCompleted}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl transition-all",
                "h-12 w-10 sm:h-14 sm:w-12 md:h-14 md:w-13",
                isCompleted
                  ? "opacity-25 cursor-not-allowed"
                  : selectedValue === num
                    ? "bg-primary-600 text-white dark:bg-primary-500 shadow-md scale-105"
                    : "bg-[hsl(var(--muted))] hover:bg-primary-100 dark:hover:bg-primary-900",
                "disabled:hover:bg-[hsl(var(--muted))]"
              )}
            >
              <span className="text-xl sm:text-2xl font-bold leading-none">{num}</span>
              {!isCompleted && (
                <span className="text-[9px] leading-none mt-0.5 opacity-60">
                  {9 - numberCounts[num]}
                </span>
              )}
            </button>
          );
        })}
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
