"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { WatermelonEngine, type MergeEffect } from "./engine";
import { renderGame } from "./renderer";
import { CONTAINER_WIDTH, CONTAINER_HEIGHT, FRUITS } from "./types";
import { playDropSound, playMergeSound, resumeAudioContext } from "./sounds";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { gameRegistry } from "@/lib/game-registry";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";

const GAME_INFO = gameRegistry.watermelon;

export default function WatermelonGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WatermelonEngine | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameStatusRef = useRef<"idle" | "playing" | "lost">("idle");
  const mergeEffectsRef = useRef<MergeEffect[]>([]);

  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "lost">("idle");
  const [showModal, setShowModal] = useState(false);
  const { resolvedTheme } = useTheme();
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("watermelon", locale);

  // Refs for render loop — avoids recreating renderLoop on theme/translation change
  const themeRef = useRef(resolvedTheme);
  const tRef = useRef(t);
  useEffect(() => { themeRef.current = resolvedTheme; }, [resolvedTheme]);
  useEffect(() => { tRef.current = t; }, [t]);

  // Sync ref with state for use in animation loop
  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  const createEngine = useCallback(() => {
    if (engineRef.current) engineRef.current.destroy();

    const engine = new WatermelonEngine({
      onScoreChange: (s) => setScore(s),
      onGameOver: () => {
        setGameStatus("lost");
        gameStatusRef.current = "lost";
        setTimeout(() => setShowModal(true), 600);
      },
      onMerge: (x, y, fruitIndex) => {
        const def = FRUITS[fruitIndex];
        mergeEffectsRef.current.push({
          x, y,
          radius: def.radius,
          color: def.color,
          t: 0,
          fruitIndex,
        });
        playMergeSound(fruitIndex);
      },
    });
    engineRef.current = engine;
    mergeEffectsRef.current = [];
    setScore(0);
    setGameStatus("idle");
    gameStatusRef.current = "idle";
    setShowModal(false);
  }, []);

  // Canvas sizing
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const maxW = Math.min(parent.clientWidth, 420);
    const aspect = (CONTAINER_HEIGHT + 80) / CONTAINER_WIDTH;
    canvas.width = maxW * window.devicePixelRatio;
    canvas.height = maxW * aspect * window.devicePixelRatio;
    canvas.style.width = `${maxW}px`;
    canvas.style.height = `${maxW * aspect}px`;
  }, []);

  // Animation loop
  const renderLoop = useCallback(
    (time: number) => {
      const engine = engineRef.current;
      const canvas = canvasRef.current;
      if (!engine || !canvas) return;

      const delta = lastTimeRef.current ? time - lastTimeRef.current : 16.67;
      lastTimeRef.current = time;

      // Step physics only when playing
      if (gameStatusRef.current === "playing") {
        engine.update(Math.min(delta, 33.33));
      }

      // Advance merge effects
      const dt = Math.min(delta, 33.33) / 1000;
      const effects = mergeEffectsRef.current;
      for (let i = effects.length - 1; i >= 0; i--) {
        effects[i].t += dt * 2.5; // ~0.4s full animation
        if (effects[i].t >= 1) effects.splice(i, 1);
      }

      // Render
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        const displayW = canvas.width / window.devicePixelRatio;
        const displayH = canvas.height / window.devicePixelRatio;
        renderGame(
          ctx,
          displayW,
          displayH,
          engine.fruits,
          engine.getState(),
          themeRef.current === "dark",
          tRef.current.watermelon?.next ?? "Next",
          effects
        );
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    },
    []
  );

  // Init
  useEffect(() => {
    createEngine();
    resizeCanvas();
    rafRef.current = requestAnimationFrame(renderLoop);

    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      engineRef.current?.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [createEngine, resizeCanvas, renderLoop]);

  // Convert client X to game world X
  const getGameX = useCallback((clientX: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return CONTAINER_WIDTH / 2;
    const rect = canvas.getBoundingClientRect();
    const displayW = canvas.width / window.devicePixelRatio;
    const displayH = canvas.height / window.devicePixelRatio;

    const topPadding = 80;
    const sidePadding = 8;
    const availW = displayW - sidePadding * 2;
    const availH = displayH - topPadding - sidePadding;
    const scale = Math.min(availW / CONTAINER_WIDTH, availH / CONTAINER_HEIGHT);
    const offsetX = (displayW - CONTAINER_WIDTH * scale) / 2;

    const canvasX = ((clientX - rect.left) / rect.width) * displayW;
    return (canvasX - offsetX) / scale;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const engine = engineRef.current;
      if (!engine || engine.gameOver) return;
      engine.setDropX(getGameX(e.clientX));
    },
    [getGameX]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const engine = engineRef.current;
      if (!engine || engine.gameOver) return;

      resumeAudioContext();

      if (gameStatusRef.current === "idle") {
        setGameStatus("playing");
        gameStatusRef.current = "playing";
      }

      engine.setDropX(getGameX(e.clientX));
      if (engine.canDrop) {
        playDropSound();
      }
      engine.drop();
    },
    [getGameX]
  );

  const initGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    createEngine();
    lastTimeRef.current = 0;
    resizeCanvas();
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [createEngine, resizeCanvas, renderLoop]);

  return (
    <GameShell
      game={GAME_INFO}
      stats={
        <span className="font-bold tabular-nums">
          {t.common.score} {score}
        </span>
      }
    >
      <div className="flex flex-col items-center gap-3 w-full max-w-[420px] mx-auto">
        {gameStatus === "idle" && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {t.watermelon?.instructions ?? "Tıklayarak meyve bırak!"}
          </p>
        )}

        <canvas
          ref={canvasRef}
          className="touch-none mx-auto block rounded-xl cursor-pointer"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
        />

        {gameStatus === "lost" && (
          <button
            onClick={initGame}
            className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            {t.common.newGame}
          </button>
        )}
      </div>

      <GameOverModal
        open={showModal}
        won={false}
        score={score}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="watermelon"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
