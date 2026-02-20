"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { createGame, move } from "./engine";
import { renderGame } from "./renderer";
import type { Game2048State, Direction } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSwipe } from "@/hooks/useSwipe";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw } from "lucide-react";

const GAME_INFO = gameRegistry.game2048;

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export default function Game2048() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<Game2048State>(createGame());

  const [score, setScore] = useState(0);
  const [bestTile, setBestTile] = useState(0);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "lost">("idle");
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("game2048", locale);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderGame(ctx, stateRef.current, canvas.width, theme === "dark");
  }, [theme]);

  const initGame = useCallback(() => {
    stateRef.current = createGame();
    setScore(0);
    setBestTile(0);
    setGameStatus("idle");
    setShowModal(false);
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const size = Math.min(parent.clientWidth, 450);
    canvas.width = size;
    canvas.height = size;
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const parent = canvas.parentElement!;
      const size = Math.min(parent.clientWidth, 450);
      canvas.width = size;
      canvas.height = size;
      draw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const handleMove = useCallback(
    (dir: Direction) => {
      if (gameStatus === "lost") return;

      const newState = move(stateRef.current, dir);
      if (newState === stateRef.current) return; // no change

      stateRef.current = newState;
      setScore(newState.score);
      setBestTile(newState.bestTile);
      setGameStatus(newState.status === "lost" ? "lost" : "playing");
      draw();

      if (newState.status === "lost") {
        setTimeout(() => setShowModal(true), 300);
      }
    },
    [draw, gameStatus]
  );

  useKeyboard(
    useCallback(
      (key: string) => {
        const dir = KEY_MAP[key];
        if (dir) handleMove(dir);
      },
      [handleMove]
    ),
    gameStatus !== "lost"
  );

  useSwipe(handleMove, gameStatus !== "lost");

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <Button size="sm" variant="secondary" onClick={initGame}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          {t.common.newGame}
        </Button>
      }
      stats={
        <>
          <span>{t.common.score} {score}</span>
          <span>{t.common.best} {bestTile}</span>
        </>
      }
    >
      <div className="w-full max-w-[450px]">
        <canvas
          ref={canvasRef}
          className="touch-none mx-auto block"
        />
        <p className="mt-2 text-center text-xs text-[hsl(var(--muted-foreground))]">
          {t.game2048.instructions}
        </p>
      </div>

      <GameOverModal
        open={showModal}
        won={stateRef.current.won2048}
        score={score}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="game2048"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
