"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { createGame, movePaddle, launchBall, shootLaser, tick } from "./engine";
import { renderGame } from "./renderer";
import type { BlockBreakerState } from "./types";
import { GAME_WIDTH, GAME_HEIGHT } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { resumeAudioContext, playBlockBreak, playBallLost, playPowerUp, playLevelComplete } from "./sounds";
import { RotateCcw, Pause, Play } from "lucide-react";
import { TOTAL_LEVELS } from "./levels";

const GAME_INFO = gameRegistry.blockbreaker;
const TICK_MS = 1000 / 60; // 60 fps
const STORAGE_KEY = "blockbreaker_unlocked_level";

function getSavedLevel(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) {
      const n = parseInt(v, 10);
      if (!isNaN(n) && n >= 0 && n < TOTAL_LEVELS) return n;
    }
  } catch { /* SSR / blocked */ }
  return 0;
}

function saveLevel(level: number): void {
  try {
    const current = getSavedLevel();
    if (level > current) {
      localStorage.setItem(STORAGE_KEY, String(level));
    }
  } catch { /* SSR / blocked */ }
}

export default function BlockBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<BlockBreakerState>(createGame(getSavedLevel()));
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number>(0);
  const laserTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLivesRef = useRef(3);
  const prevBlockCountRef = useRef(0);
  const prevLevelRef = useRef(getSavedLevel());

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(getSavedLevel());
  const [savedLevel, setSavedLevel] = useState(getSavedLevel());
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "paused" | "lost" | "won">("idle");
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("blockbreaker", locale);

  /* ── Draw ──────────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderGame(ctx, canvas.width, canvas.height, stateRef.current, theme === "dark");
  }, [theme]);

  /* ── Game loop ─────────────────────────────────────── */
  const stopLoop = useCallback(() => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    if (laserTimerRef.current) { clearInterval(laserTimerRef.current); laserTimerRef.current = null; }
  }, []);

  const renderLoop = useCallback(() => {
    draw();
    if (stateRef.current.status === "playing" || stateRef.current.status === "paused") {
      rafRef.current = requestAnimationFrame(renderLoop);
    }
  }, [draw]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing") return;

    const prevBlocks = s.blocks.length;
    const prevPowerUps = s.powerUps.length;
    const wasBallOnPaddle = s.ballOnPaddle;
    const newState = tick(s);
    stateRef.current = newState;

    // Sound effects
    if (newState.blocks.length < prevBlocks) {
      playBlockBreak();
    }
    if (!wasBallOnPaddle && newState.ballOnPaddle) {
      // Ball was reset to paddle (paddle "caught" it after life loss) — no sound here
    }
    if (newState.powerUps.length < prevPowerUps) {
      playPowerUp();
    }
    if (newState.lives < prevLivesRef.current) {
      playBallLost();
    }
    if (newState.level > prevLevelRef.current) {
      playLevelComplete();
      // Save progress — unlock the new level
      saveLevel(newState.level);
      setSavedLevel(Math.max(newState.level, getSavedLevel()));
    }

    prevLivesRef.current = newState.lives;
    prevBlockCountRef.current = newState.blocks.length;
    prevLevelRef.current = newState.level;

    // Sync React state
    setScore(newState.score);
    setLives(newState.lives);
    setLevel(newState.level);

    if (newState.status === "lost" || newState.status === "won") {
      if (newState.status === "won") {
        saveLevel(TOTAL_LEVELS - 1);
        setSavedLevel(TOTAL_LEVELS - 1);
      }
      setGameStatus(newState.status);
      stopLoop();
      draw();
      setTimeout(() => setShowModal(true), 400);
    }
  }, [draw, stopLoop]);

  const startLoop = useCallback(() => {
    stopLoop();
    loopRef.current = setInterval(gameLoop, TICK_MS);
    rafRef.current = requestAnimationFrame(renderLoop);
    // Laser auto-fire every 200ms
    laserTimerRef.current = setInterval(() => {
      if (stateRef.current.status === "playing") {
        stateRef.current = shootLaser(stateRef.current);
      }
    }, 200);
  }, [gameLoop, renderLoop, stopLoop]);

  /* ── Start / init ──────────────────────────────────── */
  const startGame = useCallback(() => {
    resumeAudioContext();
    const s = stateRef.current;
    if (s.status === "idle") {
      const launched = launchBall({ ...s, status: "playing" });
      stateRef.current = launched;
      setGameStatus("playing");
      prevLivesRef.current = launched.lives;
      prevBlockCountRef.current = launched.blocks.length;
      prevLevelRef.current = launched.level;
      startLoop();
    } else if (s.ballOnPaddle && s.status === "playing") {
      stateRef.current = launchBall(s);
    }
  }, [startLoop]);

  /** Continue from saved level */
  const initGame = useCallback(() => {
    stopLoop();
    const startLevel = getSavedLevel();
    stateRef.current = createGame(startLevel);
    setScore(0);
    setLives(3);
    setLevel(startLevel);
    setGameStatus("idle");
    setShowModal(false);
    prevLivesRef.current = 3;
    prevBlockCountRef.current = 0;
    prevLevelRef.current = startLevel;
    setSavedLevel(startLevel);
    draw();
  }, [draw, stopLoop]);

  /** Restart from level 1 */
  const restartFromBeginning = useCallback(() => {
    stopLoop();
    stateRef.current = createGame(0);
    setScore(0);
    setLives(3);
    setLevel(0);
    setGameStatus("idle");
    setShowModal(false);
    prevLivesRef.current = 3;
    prevBlockCountRef.current = 0;
    prevLevelRef.current = 0;
    draw();
  }, [draw, stopLoop]);

  const togglePause = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "playing") {
      stateRef.current = { ...s, status: "paused" };
      setGameStatus("paused");
      stopLoop();
      draw();
    } else if (s.status === "paused") {
      stateRef.current = { ...s, status: "playing" };
      setGameStatus("playing");
      startLoop();
    }
  }, [draw, stopLoop, startLoop]);

  /* ── Canvas sizing ─────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement!;
      const maxW = Math.min(parent.clientWidth, 480);
      const ratio = GAME_HEIGHT / GAME_WIDTH;
      canvas.width = maxW;
      canvas.height = Math.round(maxW * ratio);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  /* ── Cleanup ───────────────────────────────────────── */
  useEffect(() => () => stopLoop(), [stopLoop]);

  /* ── Pointer / mouse input ─────────────────────────── */
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = GAME_WIDTH / canvas.width;
    const x = (e.clientX - rect.left) * scale;
    stateRef.current = movePaddle(stateRef.current, x);
  }, []);

  const handlePointerDown = useCallback(() => {
    resumeAudioContext();
    const s = stateRef.current;
    if (s.status === "idle") {
      startGame();
    } else if (s.ballOnPaddle && s.status === "playing") {
      stateRef.current = launchBall(s);
    }
  }, [startGame]);

  /* ── Keyboard input ────────────────────────────────── */
  const handleKey = useCallback(
    (key: string) => {
      if (key === "p" || key === "P" || key === "Escape") {
        togglePause();
        return;
      }
      const s = stateRef.current;
      if (s.status !== "playing" && s.status !== "idle") return;

      const step = 20;
      switch (key) {
        case "ArrowLeft":
        case "a":
          stateRef.current = movePaddle(s, s.paddle.x + s.paddle.width / 2 - step);
          break;
        case "ArrowRight":
        case "d":
          stateRef.current = movePaddle(s, s.paddle.x + s.paddle.width / 2 + step);
          break;
        case " ":
          if (s.status === "idle") {
            startGame();
          } else if (s.ballOnPaddle) {
            stateRef.current = launchBall(s);
          }
          break;
      }
    },
    [togglePause, startGame]
  );

  useKeyboard(handleKey, gameStatus !== "lost" && gameStatus !== "won");

  /* ── Render ────────────────────────────────────────── */
  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {gameStatus === "playing" || gameStatus === "paused" ? (
            <Button size="sm" variant="secondary" onClick={togglePause}>
              {gameStatus === "paused" ? (
                <><Play className="mr-1 h-3.5 w-3.5" /> {t.blockbreaker.continue}</>
              ) : (
                <><Pause className="mr-1 h-3.5 w-3.5" /> {t.blockbreaker.pause}</>
              )}
            </Button>
          ) : null}
          {savedLevel > 0 && gameStatus === "idle" ? (
            <Button size="sm" variant="secondary" onClick={restartFromBeginning}>
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> {t.blockbreaker.restartAll}
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={initGame}>
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> {t.common.newGame}
            </Button>
          )}
        </div>
      }
      stats={
        <>
          <span>{t.common.score} {score}</span>
          <span>{t.blockbreaker.level} {level + 1}</span>
          <span>{t.blockbreaker.lives} {lives}</span>
        </>
      }
    >
      <div className="w-full max-w-[480px]">
        <canvas
          ref={canvasRef}
          className="touch-none mx-auto block cursor-none rounded-lg"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
        />
      </div>

      <GameOverModal
        open={showModal}
        won={gameStatus === "won"}
        score={score}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="blockbreaker"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
