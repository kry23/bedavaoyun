"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { createGame, changeDirection, tick } from "./engine";
import { renderGame } from "./renderer";
import type { SnakeState, Direction } from "./types";
import { GRID_SIZE } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSwipe } from "@/hooks/useSwipe";

const GAME_INFO = gameRegistry.snake;

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SnakeState>(createGame());
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "lost">("idle");
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cellSize = canvas.width / GRID_SIZE;
    renderGame(ctx, stateRef.current, cellSize, theme === "dark");
  }, [theme]);

  const stopLoop = useCallback(() => {
    if (loopRef.current) {
      clearTimeout(loopRef.current);
      loopRef.current = null;
    }
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "lost") return;

    const newState = tick(s);
    stateRef.current = newState;
    setScore(newState.score);
    draw();

    if (newState.status === "lost") {
      setGameStatus("lost");
      setTimeout(() => setShowModal(true), 300);
      return;
    }

    loopRef.current = setTimeout(gameLoop, newState.speed);
  }, [draw]);

  const startGame = useCallback(() => {
    if (gameStatus === "playing") return;
    setGameStatus("playing");
    stateRef.current = { ...stateRef.current, status: "playing" };
    gameLoop();
  }, [gameStatus, gameLoop]);

  const initGame = useCallback(() => {
    stopLoop();
    stateRef.current = createGame();
    setScore(0);
    setGameStatus("idle");
    setShowModal(false);
    draw();
  }, [draw, stopLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const size = Math.min(parent.clientWidth, 500);
    canvas.width = size;
    canvas.height = size;
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const parent = canvas.parentElement!;
      const size = Math.min(parent.clientWidth, 500);
      canvas.width = size;
      canvas.height = size;
      draw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  const handleDirection = useCallback(
    (dir: Direction) => {
      if (gameStatus === "idle") {
        stateRef.current = changeDirection(stateRef.current, dir);
        startGame();
      } else if (gameStatus === "playing") {
        stateRef.current = changeDirection(stateRef.current, dir);
      }
    },
    [gameStatus, startGame]
  );

  useKeyboard(
    useCallback(
      (key: string) => {
        const dir = KEY_MAP[key];
        if (dir) handleDirection(dir);
      },
      [handleDirection]
    ),
    gameStatus !== "lost"
  );

  useSwipe(handleDirection, gameStatus !== "lost");

  return (
    <GameShell
      game={GAME_INFO}
      stats={<span>Skor: {score}</span>}
    >
      <div className="w-full max-w-[500px]">
        {gameStatus === "idle" && (
          <div className="mb-4 text-center">
            <Button onClick={startGame}>Başla</Button>
            <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
              Yön tuşları / WASD / Swipe ile oyna
            </p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="touch-none mx-auto block rounded-lg border border-[hsl(var(--border))]"
        />
      </div>

      <GameOverModal
        open={showModal}
        won={false}
        score={score}
        scoreLabel="Puan"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
