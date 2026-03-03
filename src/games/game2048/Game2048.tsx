"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { createGame, move } from "./engine";
import { renderGame, renderAnimatedFrame } from "./renderer";
import type { Game2048State, Direction, TileMove, MergedCell, SpawnedTile } from "./types";
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
const ANIM_DURATION = 200; // ms

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export default function Game2048() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<Game2048State>(createGame());
  const animRef = useRef<{
    active: boolean;
    startTime: number;
    prevGrid: number[][];
    nextState: Game2048State;
    tileMoves: TileMove[];
    mergedCells: MergedCell[];
    spawnedTile: SpawnedTile | null;
    rafId: number;
  } | null>(null);

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

  const animationLoop = useCallback(() => {
    const anim = animRef.current;
    if (!anim || !anim.active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = performance.now() - anim.startTime;
    const progress = Math.min(1, elapsed / ANIM_DURATION);

    renderAnimatedFrame(
      ctx,
      canvas.width,
      theme === "dark",
      progress,
      anim.prevGrid,
      anim.nextState,
      anim.tileMoves,
      anim.mergedCells,
      anim.spawnedTile
    );

    if (progress < 1) {
      anim.rafId = requestAnimationFrame(animationLoop);
    } else {
      // Animation complete — render final static state
      anim.active = false;
      renderGame(ctx, anim.nextState, canvas.width, theme === "dark");
    }
  }, [theme]);

  const initGame = useCallback(() => {
    // Cancel any running animation
    if (animRef.current?.active) {
      cancelAnimationFrame(animRef.current.rafId);
      animRef.current.active = false;
    }
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
      // Block input during animation
      if (animRef.current?.active) return;

      const prevGrid = stateRef.current.grid.map((row) => [...row]);
      const result = move(stateRef.current, dir);
      if (!result.moved) return;

      stateRef.current = result.state;
      setScore(result.state.score);
      setBestTile(result.state.bestTile);
      setGameStatus(result.state.status === "lost" ? "lost" : "playing");

      // Start animation
      animRef.current = {
        active: true,
        startTime: performance.now(),
        prevGrid,
        nextState: result.state,
        tileMoves: result.tileMoves,
        mergedCells: result.mergedCells,
        spawnedTile: result.spawnedTile,
        rafId: 0,
      };
      animRef.current.rafId = requestAnimationFrame(animationLoop);

      if (result.state.status === "lost") {
        setTimeout(() => setShowModal(true), ANIM_DURATION + 300);
      }
    },
    [animationLoop, gameStatus]
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
