"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGame,
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotate,
  getDropSpeed,
} from "./engine";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TETROMINO_COLORS,
  type TetrisState,
} from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useKeyboard } from "@/hooks/useKeyboard";
import { RotateCcw, Pause, Play } from "lucide-react";
import { cn } from "@/utils/cn";

const GAME_INFO = gameRegistry.tetris;
const CELL_SIZE = 28;

export default function TetrisGame() {
  const [state, setState] = useState<TetrisState>(createGame);
  const [showModal, setShowModal] = useState(false);
  const dropRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initGame = useCallback(() => {
    setState(createGame());
    setShowModal(false);
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => {
      if (s.status === "playing") return { ...s, status: "paused" };
      if (s.status === "paused") return { ...s, status: "playing" };
      return s;
    });
  }, []);

  // Auto drop
  useEffect(() => {
    if (state.status !== "playing") {
      if (dropRef.current) clearInterval(dropRef.current);
      dropRef.current = null;
      if (state.status === "gameover") {
        setTimeout(() => setShowModal(true), 300);
      }
      return;
    }
    const speed = getDropSpeed(state.level);
    dropRef.current = setInterval(() => {
      setState((s) => moveDown(s));
    }, speed);
    return () => {
      if (dropRef.current) clearInterval(dropRef.current);
    };
  }, [state.status, state.level]);

  const handleKey = useCallback(
    (key: string) => {
      if (key === "p" || key === "P" || key === "Escape") {
        togglePause();
        return;
      }
      if (state.status !== "playing") return;
      switch (key) {
        case "ArrowLeft":
        case "a":
          setState((s) => moveLeft(s));
          break;
        case "ArrowRight":
        case "d":
          setState((s) => moveRight(s));
          break;
        case "ArrowDown":
        case "s":
          setState((s) => moveDown(s));
          break;
        case "ArrowUp":
        case "w":
          setState((s) => rotate(s));
          break;
        case " ":
          setState((s) => hardDrop(s));
          break;
      }
    },
    [state.status, togglePause]
  );

  useKeyboard(handleKey, state.status !== "gameover");

  // Render board with current piece overlaid
  const displayBoard = state.board.map((row) => [...row]);
  if (state.status !== "gameover") {
    const { shape, pos, type } = state.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const ny = pos.y + r;
          const nx = pos.x + c;
          if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
            displayBoard[ny][nx] = type;
          }
        }
      }
    }
  }

  // Next piece preview
  const nextShape = state.next.shape;

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={togglePause}>
            {state.status === "paused" ? (
              <><Play className="mr-1 h-3.5 w-3.5" /> Devam</>
            ) : (
              <><Pause className="mr-1 h-3.5 w-3.5" /> Duraklat</>
            )}
          </Button>
          <Button size="sm" variant="secondary" onClick={initGame}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Yeni Oyun
          </Button>
        </div>
      }
      stats={
        <>
          <span>Skor: {state.score}</span>
          <span>Satır: {state.lines}</span>
          <span>Seviye: {state.level}</span>
        </>
      }
    >
      <div className="flex gap-4">
        {/* Board */}
        <div
          className="inline-grid border-2 border-[hsl(var(--foreground))]"
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          }}
        >
          {displayBoard.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={cn(
                  "border border-[hsl(var(--border))]",
                  !cell && "bg-[hsl(var(--background))]"
                )}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: cell
                    ? TETROMINO_COLORS[cell as keyof typeof TETROMINO_COLORS]
                    : undefined,
                }}
              />
            ))
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1 text-xs font-medium text-[hsl(var(--muted-foreground))]">
              Sonraki
            </p>
            <div className="inline-grid grid-cols-4 gap-0">
              {Array.from({ length: 4 }, (_, r) =>
                Array.from({ length: 4 }, (_, c) => {
                  const filled =
                    r < nextShape.length &&
                    c < nextShape[0].length &&
                    nextShape[r][c];
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="rounded-sm"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: filled
                          ? TETROMINO_COLORS[state.next.type]
                          : "transparent",
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex flex-col gap-1.5 sm:hidden">
            <button
              onTouchStart={() => setState((s) => rotate(s))}
              className="rounded-lg bg-[hsl(var(--muted))] p-3 text-xs font-bold"
            >
              Dön
            </button>
            <div className="flex gap-1.5">
              <button
                onTouchStart={() => setState((s) => moveLeft(s))}
                className="flex-1 rounded-lg bg-[hsl(var(--muted))] p-3 text-xs font-bold"
              >
                Sol
              </button>
              <button
                onTouchStart={() => setState((s) => moveDown(s))}
                className="flex-1 rounded-lg bg-[hsl(var(--muted))] p-3 text-xs font-bold"
              >
                Aşağı
              </button>
              <button
                onTouchStart={() => setState((s) => moveRight(s))}
                className="flex-1 rounded-lg bg-[hsl(var(--muted))] p-3 text-xs font-bold"
              >
                Sağ
              </button>
            </div>
            <button
              onTouchStart={() => setState((s) => hardDrop(s))}
              className="rounded-lg bg-primary-500 p-3 text-xs font-bold text-white"
            >
              Düşür
            </button>
          </div>
        </div>
      </div>

      {state.status === "paused" && (
        <div className="mt-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
          Duraklatıldı — devam etmek için P tuşuna basın
        </div>
      )}

      <GameOverModal
        open={showModal}
        won={false}
        score={state.score}
        scoreLabel="Puan"
        gameName="Tetris"
        gameSlug="tetris"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
