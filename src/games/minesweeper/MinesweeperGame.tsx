"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { createGame, revealCell, toggleFlag } from "./engine";
import { renderBoard, getCellSize, getCellFromClick } from "./renderer";
import { DIFFICULTIES, type Difficulty, type MinesweeperState } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { Flag } from "lucide-react";

const GAME_INFO = gameRegistry.minesweeper;

export default function MinesweeperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<MinesweeperState>(createGame(9, 9, 10));
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [flagCount, setFlagCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const { elapsed, start, stop, reset, formatTime } = useGameTimer();
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("minesweeper", locale);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const cellSize = getCellSize(canvas.width, canvas.height, s.width, s.height);
    renderBoard(ctx, s, cellSize, theme === "dark");
  }, [theme]);

  const initGame = useCallback(
    (diff: Difficulty) => {
      const config = DIFFICULTIES[diff];
      stateRef.current = createGame(config.width, config.height, config.mines);
      setDifficulty(diff);
      setFlagCount(0);
      setGameStatus("idle");
      setShowModal(false);
      reset();

      const canvas = canvasRef.current;
      if (canvas) {
        const parent = canvas.parentElement!;
        const maxWidth = Math.min(parent.clientWidth, 700);
        const MIN_CELL = 28;
        const cellSize = Math.max(MIN_CELL, Math.floor(maxWidth / config.width));
        canvas.width = cellSize * config.width;
        canvas.height = cellSize * config.height;
      }

      requestAnimationFrame(draw);
    },
    [draw, reset]
  );

  useEffect(() => {
    initGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
  }, [draw, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const parent = canvas.parentElement!;
      const config = DIFFICULTIES[difficulty];
      const maxWidth = Math.min(parent.clientWidth, 700);
      const MIN_CELL = 28;
      const cellSize = Math.max(MIN_CELL, Math.floor(maxWidth / config.width));
      canvas.width = cellSize * config.width;
      canvas.height = cellSize * config.height;
      draw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [difficulty, draw]);

  const handleAction = useCallback(
    (row: number, col: number, isFlag: boolean) => {
      const s = stateRef.current;
      if (s.status === "won" || s.status === "lost") return;

      let newState: MinesweeperState;
      if (isFlag) {
        newState = toggleFlag(s, row, col);
      } else {
        newState = revealCell(s, row, col);
      }

      stateRef.current = newState;
      setFlagCount(newState.flagCount);
      draw();

      if (newState.status === "playing" && s.status === "idle") {
        start();
        setGameStatus("playing");
      }

      if (newState.status === "won" || newState.status === "lost") {
        stop();
        setGameStatus(newState.status);
        setTimeout(() => setShowModal(true), 300);
      }
    },
    [draw, start, stop]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const s = stateRef.current;
      const cellSize = getCellSize(canvas.width, canvas.height, s.width, s.height);
      const { row, col } = getCellFromClick(x, y, cellSize);
      handleAction(row, col, false);
    },
    [handleAction]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const s = stateRef.current;
      const cellSize = getCellSize(canvas.width, canvas.height, s.width, s.height);
      const { row, col } = getCellFromClick(x, y, cellSize);
      handleAction(row, col, true);
    },
    [handleAction]
  );

  // Mobile: tap = reveal, long press = flag
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      longPressTriggered.current = false;
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        const s = stateRef.current;
        const cellSize = getCellSize(canvas.width, canvas.height, s.width, s.height);
        const { row, col } = getCellFromClick(x, y, cellSize);
        handleAction(row, col, true);
      }, 500);
    },
    [handleAction]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      if (longPressTriggered.current) {
        longPressTriggered.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const s = stateRef.current;
      const cellSize = getCellSize(canvas.width, canvas.height, s.width, s.height);
      const { row, col } = getCellFromClick(x, y, cellSize);
      handleAction(row, col, false);
    },
    [handleAction]
  );

  const config = DIFFICULTIES[difficulty];

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <>
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={difficulty === d ? "primary" : "secondary"}
              onClick={() => initGame(d)}
            >
              {t.difficulty[DIFFICULTIES[d].label as keyof typeof t.difficulty]}
            </Button>
          ))}
        </>
      }
      stats={
        <>
          <span>⏱ {formatTime(elapsed)}</span>
          <span className="flex items-center gap-1">
            <Flag className="h-3.5 w-3.5" />
            {flagCount}/{config.mines}
          </span>
        </>
      }
    >
      <div className="w-full overflow-x-auto">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="touch-none mx-auto block cursor-pointer"
        />
        <p className="mt-2 text-center text-xs text-[hsl(var(--muted-foreground))]">
          {t.minesweeper.instructions}
        </p>
      </div>

      <GameOverModal
        open={showModal}
        won={gameStatus === "won"}
        score={Math.floor(elapsed / 1000)}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="minesweeper"
        onClose={() => setShowModal(false)}
        onRestart={() => initGame(difficulty)}
      />
    </GameShell>
  );
}
