"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  createGame,
  selectTile,
  isFree,
  getHint,
  applyHint,
  undo,
  shuffleRemaining,
  getRemainingCount,
} from "./engine";
import type { MahjongState, BoardTile, TileType } from "./types";
import { LAYOUTS } from "./layouts";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw, Undo2, Lightbulb, Shuffle } from "lucide-react";
import { cn } from "@/utils/cn";

const GAME_INFO = gameRegistry.mahjong;

/* ── Sound effects (Web Audio API) ───────────────────────── */

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

/** Click on a free tile — short bright tap */
function sfxSelect() {
  playTone(800, 0.08, "sine", 0.12);
}

/** Successful match — happy double note */
function sfxMatch() {
  playTone(660, 0.1, "sine", 0.12);
  setTimeout(() => playTone(880, 0.15, "sine", 0.12), 80);
}

/** Click on a blocked tile — low dull thud */
function sfxBlocked() {
  playTone(200, 0.12, "triangle", 0.1);
}

/** Mismatch — soft low tick */
function sfxMismatch() {
  playTone(500, 0.06, "sine", 0.06);
}

/* ── Tile sizing ─────────────────────────────────────────── */
const TILE_W = 48;
const TILE_H = 60;
const LAYER_OFFSET_X = 5;   // px shift per layer (matching mahjong.gg: 3/75 scaled)
const LAYER_OFFSET_Y = 5;   // px shift per layer
const EDGE_R = 5;   // visible right edge (dark shadow rect offset)
const EDGE_B = 5;   // visible bottom edge (dark shadow rect offset)
const FACE_W = TILE_W * 2 - 6; // 90px tile face
const FACE_H = TILE_H * 2 - 6; // 114px tile face

/* ── Traditional tile face rendering ─────────────────────── */

const CN = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

/* Circle dot positions in a 3×3 grid (row, col) */
const DOT_POS: number[][][] = [
  [],
  [[1, 1]],
  [[0, 1], [2, 1]],
  [[0, 2], [1, 1], [2, 0]],
  [[0, 0], [0, 2], [2, 0], [2, 2]],
  [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
  [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
];

function TileFace({ type }: { type: TileType }) {
  const v = Number(type.value) || 0;

  switch (type.suit) {
    /* ── Characters (萬子) ─────────── */
    case "character":
      return (
        <div className="flex flex-col items-center justify-center gap-0">
          <span className="font-black text-[32px] leading-tight text-[#1a3ca0]">
            {CN[v - 1]}
          </span>
          <span className="font-black text-[20px] leading-tight text-[#c02020]">
            萬
          </span>
        </div>
      );

    /* ── Circles (筒子) ───────────── */
    case "circle": {
      const dots = DOT_POS[v] || [];
      const sz = v <= 4 ? 22 : v <= 6 ? 18 : 14;
      const gap = v <= 4 ? 24 : v <= 6 ? 20 : 16;
      return (
        <div className="relative" style={{ width: gap * 2 + sz, height: gap * 2 + sz }}>
          {dots.map(([r, c], i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: sz,
                height: sz,
                left: c * gap,
                top: r * gap,
                background:
                  v === 1
                    ? "radial-gradient(circle, #c02020 30%, #1a3ca0 60%, #16a34a 90%)"
                    : (r + c) % 2 === 0
                    ? "#1a3ca0"
                    : "#16a34a",
                border: v === 1 ? "none" : "2px solid rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      );
    }

    /* ── Bamboo (索子) ────────────── */
    case "bamboo": {
      if (v === 1) {
        return (
          <div className="flex flex-col items-center">
            <span className="text-[36px] leading-none">🐦</span>
          </div>
        );
      }
      const stickH = v <= 4 ? 34 : v <= 6 ? 26 : 22;
      const stickW = v <= 4 ? 9 : v <= 6 ? 7 : 6;
      const sticks: { color: string }[] = [];
      for (let i = 0; i < v; i++) {
        sticks.push({ color: i % 2 === 0 ? "#16a34a" : "#c02020" });
      }
      const cols = v <= 3 ? v : v <= 6 ? Math.ceil(v / 2) : Math.ceil(v / 3);
      const rows = Math.ceil(v / cols);
      return (
        <div
          className="grid items-center justify-center"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${stickW + 3}px)`,
            gap: "3px 2px",
          }}
        >
          {sticks.map((s, i) => (
            <div
              key={i}
              className="rounded-sm mx-auto"
              style={{
                width: stickW,
                height: stickH,
                background: `linear-gradient(90deg, ${s.color} 0%, ${s.color}dd 40%, ${s.color}88 50%, ${s.color}dd 60%, ${s.color} 100%)`,
                borderRadius: stickW / 2,
              }}
            >
              {/* Bamboo joint */}
              <div
                className="mx-auto"
                style={{
                  width: stickW + 3,
                  height: 4,
                  marginTop: stickH / 2 - 1,
                  marginLeft: -1,
                  background: s.color,
                  borderRadius: 1,
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    /* ── Winds (風牌) ─────────────── */
    case "wind":
      return (
        <span className="font-black text-[44px] leading-none text-[#1e293b]">
          {type.label}
        </span>
      );

    /* ── Dragons (三元牌) ─────────── */
    case "dragon":
      if (type.value === "white") {
        return (
          <div
            className="rounded"
            style={{
              width: 44,
              height: 56,
              border: "3.5px solid #6b7280",
            }}
          />
        );
      }
      return (
        <span
          className="font-black text-[48px] leading-none"
          style={{ color: type.color }}
        >
          {type.label}
        </span>
      );

    /* ── Seasons (季節) ───────────── */
    case "season":
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[32px] leading-none">{type.emoji}</span>
          <span className="font-black text-[16px] leading-none text-amber-700">
            {type.label}
          </span>
        </div>
      );

    /* ── Flowers (花牌) ───────────── */
    case "flower":
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[32px] leading-none">{type.emoji}</span>
          <span className="font-black text-[16px] leading-none text-fuchsia-700">
            {type.label}
          </span>
        </div>
      );
  }
}

/* ── 3D tile edge colors (matching mahjong.gg: rgb(25,25,25)) */
const EDGE_COLOR = "#191919";       // nearly black, like mahjong.gg
const EDGE_COLOR_DARK = "#111111";  // bottom edge

/* ── Main Component ──────────────────────────────────────── */

export default function MahjongGame() {
  const [state, setState] = useState<MahjongState>(() => createGame("turtle"));
  const [showModal, setShowModal] = useState(false);
  const [hintPair, setHintPair] = useState<[number, number] | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [shakeId, setShakeId] = useState<number | null>(null);
  const timer = useGameTimer(state.status === "playing");
  const t = useTranslation();
  const locale = useLocale();
  const gameT = getGameTranslation("mahjong", locale);
  const boardRef = useRef<HTMLDivElement>(null);

  const isFinished = state.status === "won" || state.status === "stuck";
  const remaining = getRemainingCount(state);

  const ct = useMemo(
    () =>
      locale === "tr"
        ? {
            tilesLeft: "Kalan:",
            shuffle: "Karıştır",
            hint: "İpucu",
            undo: "Geri Al",
            newGame: "Yeni Oyun",
            stuck: "Hamle kalmadı! Karıştırın veya geri alın.",
            hintsUsed: "İpucu:",
          }
        : {
            tilesLeft: "Left:",
            shuffle: "Shuffle",
            hint: "Hint",
            undo: "Undo",
            newGame: "New Game",
            stuck: "No moves left! Shuffle or undo.",
            hintsUsed: "Hints:",
          },
    [locale],
  );

  const initGame = useCallback(
    (layoutName?: string) => {
      const ln = layoutName ?? state.layoutName;
      setState(createGame(ln));
      setShowModal(false);
      setHintPair(null);
      setRemovingIds(new Set());
      timer.reset();
    },
    [state.layoutName, timer],
  );

  const handleTileClick = useCallback(
    (tileId: number) => {
      if (isFinished) return;
      setHintPair(null);

      const result = selectTile(state, tileId);
      setState(result.state);

      if (result.blocked) {
        sfxBlocked();
        return;
      }

      if (result.matched) {
        sfxMatch();
        const entry = result.state.history[result.state.history.length - 1];
        setRemovingIds(new Set([entry.tile1Id, entry.tile2Id]));
        setTimeout(() => setRemovingIds(new Set()), 400);
        if (result.state.status === "won") {
          setTimeout(() => setShowModal(true), 600);
        }
      } else if (result.mismatch) {
        sfxMismatch();
        setShakeId(tileId);
        setTimeout(() => setShakeId(null), 400);
      } else {
        sfxSelect();
      }
    },
    [state, isFinished],
  );

  const handleHint = useCallback(() => {
    if (isFinished) return;
    const pair = getHint(state);
    if (pair) {
      setHintPair(pair);
      setState(applyHint(state));
      setTimeout(() => setHintPair(null), 3000);
    }
  }, [state, isFinished]);

  const handleUndo = useCallback(() => {
    if (isFinished && state.status !== "stuck") return;
    setState((s) => undo(s));
    setHintPair(null);
  }, [isFinished, state.status]);

  const handleShuffle = useCallback(() => {
    setState((s) => shuffleRemaining(s));
    setHintPair(null);
  }, []);

  /* ── Board layout ──────────────────────────────────────── */
  const boardBounds = useMemo(() => {
    const activeTiles = state.tiles.filter((t) => !t.removed);
    if (activeTiles.length === 0) return { width: 0, height: 0, maxLayer: 0, padLeft: 0, padTop: 0 };
    let maxCol = 0,
      maxRow = 0,
      maxLayer = 0;
    for (const tile of state.tiles) {
      maxCol = Math.max(maxCol, tile.col + 2);
      maxRow = Math.max(maxRow, tile.row + 2);
      maxLayer = Math.max(maxLayer, tile.layer);
    }
    // Extra padding: upper layers shift left+up, so add offset for top-left margin
    const padX = maxLayer * LAYER_OFFSET_X;
    const padY = maxLayer * LAYER_OFFSET_Y;
    return {
      width: maxCol * TILE_W + padX + TILE_W,
      height: maxRow * TILE_H + padY + TILE_H,
      maxLayer,
      padLeft: padX,
      padTop: padY,
    };
  }, [state.tiles]);

  const freeTileIds = useMemo(() => {
    const free = new Set<number>();
    for (const tile of state.tiles) {
      if (!tile.removed && isFree(state, tile.id)) {
        free.add(tile.id);
      }
    }
    return free;
  }, [state]);

  const sortedTiles = useMemo(
    () =>
      [...state.tiles]
        .filter((t) => !t.removed || removingIds.has(t.id))
        .sort((a, b) => {
          if (a.layer !== b.layer) return a.layer - b.layer;
          if (a.row !== b.row) return a.row - b.row;
          return a.col - b.col;
        }),
    [state.tiles, removingIds],
  );

  const [scale, setScale] = useState(1);
  useEffect(() => {
    function updateScale() {
      if (!boardRef.current) return;
      const parent = boardRef.current.parentElement;
      if (!parent) return;
      const parentW = parent.clientWidth - 16;
      const parentH = window.innerHeight * 0.55;
      const scaleX = boardBounds.width > 0 ? Math.min(1, parentW / boardBounds.width) : 1;
      const scaleY = boardBounds.height > 0 ? Math.min(1, parentH / boardBounds.height) : 1;
      setScale(Math.min(scaleX, scaleY));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [boardBounds]);

  /* ── Single tile renderer ──────────────────────────────── */
  function renderTile(tile: BoardTile) {
    const isTileFree = freeTileIds.has(tile.id);
    const isSelected = state.selectedTileId === tile.id;
    const isHinted = hintPair !== null && (tile.id === hintPair[0] || tile.id === hintPair[1]);
    const isRemoving = removingIds.has(tile.id);
    const isShaking = shakeId === tile.id;

    // Upper layers shift left+up so lower tile edges peek out on right+bottom
    const left = boardBounds.padLeft + tile.col * TILE_W - tile.layer * LAYER_OFFSET_X;
    const top = boardBounds.padTop + tile.row * TILE_H - tile.layer * LAYER_OFFSET_Y;

    return (
      /* Outer: tile body — the visible right/bottom edge */
      <div
        key={tile.id}
        onClick={() => handleTileClick(tile.id)}
        className={cn(
          "absolute select-none",
          isTileFree ? "cursor-pointer" : "cursor-default",
          isRemoving && "opacity-0 scale-75 transition-all duration-300",
          isShaking && "animate-sudoku-error",
        )}
        style={{
          left,
          top,
          width: FACE_W + EDGE_R,
          height: FACE_H + EDGE_B,
          zIndex: tile.layer * 100 + tile.row * 2 + (isSelected ? 50 : 0),
          borderRadius: 8,
          background: EDGE_COLOR,
          border: "1px solid #000",
          boxShadow: isRemoving
            ? "none"
            : isSelected
            ? "0 0 0 2px rgba(59,130,246,0.7)"
            : isHinted
            ? "0 0 0 2px rgba(234,179,8,0.7)"
            : "none",
        }}
      >
        {/* Inner: tile face — cream top surface */}
        <div
          className="flex items-center justify-center"
          style={{
            width: FACE_W,
            height: FACE_H,
            borderRadius: 8,
            background: isSelected
              ? "#dbeafe"
              : isHinted
              ? "#fef9c3"
              : "#FFF9E5",
            border: isSelected
              ? "1.5px solid #3b82f6"
              : isHinted
              ? "1.5px solid #eab308"
              : "1px solid #000",
          }}
        >
          <TileFace type={tile.type} />
        </div>
      </div>
    );
  }

  /* ── JSX ────────────────────────────────────────────────── */
  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <div className="flex flex-wrap items-center gap-2">
          {LAYOUTS.map((layout) => (
            <Button
              key={layout.name}
              size="sm"
              variant={state.layoutName === layout.name ? "primary" : "secondary"}
              onClick={() => initGame(layout.name)}
            >
              {locale === "tr" ? layout.nameTr : layout.nameEn}
            </Button>
          ))}
          <Button size="sm" variant="secondary" onClick={() => initGame()}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            {ct.newGame}
          </Button>
        </div>
      }
      stats={
        <div className="flex items-center gap-4 text-sm">
          <span>
            <span className="text-[hsl(var(--muted-foreground))]">{ct.tilesLeft} </span>
            <span className="font-bold">{remaining}/144</span>
          </span>
          {state.hintsUsed > 0 && (
            <span>
              <span className="text-[hsl(var(--muted-foreground))]">{ct.hintsUsed} </span>
              <span className="font-bold">{state.hintsUsed}</span>
            </span>
          )}
          <span className="font-mono font-medium tabular-nums">{timer.formatted}</span>
        </div>
      }
    >
      {state.status === "stuck" && (
        <div className="mb-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-center text-sm font-medium text-yellow-800 dark:text-yellow-200">
          {ct.stuck}
        </div>
      )}

      {/* Board with dark background */}
      <div
        className="flex justify-center overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(145deg, #343a5e 0%, #2a2f4e 50%, #252a45 100%)",
          padding: `${12 * scale}px`,
        }}
      >
        <div
          ref={boardRef}
          className="relative"
          style={{
            width: boardBounds.width,
            height: boardBounds.height,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {sortedTiles.map(renderTile)}
        </div>
      </div>

      <div style={{ height: Math.min(0, boardBounds.height * scale - boardBounds.height) }} />

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={handleUndo}
          disabled={state.history.length === 0 && state.status !== "stuck"}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            "hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          <Undo2 className="h-6 w-6" />
          <span className="text-[11px] font-medium">{ct.undo}</span>
        </button>

        <button
          onClick={handleHint}
          disabled={isFinished}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            "hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          <Lightbulb className="h-6 w-6" />
          <span className="text-[11px] font-medium">{ct.hint}</span>
        </button>

        <button
          onClick={handleShuffle}
          disabled={state.status === "won"}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
            "hover:bg-[hsl(var(--muted))] disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          <Shuffle className="h-6 w-6" />
          <span className="text-[11px] font-medium">{ct.shuffle}</span>
        </button>
      </div>

      <GameOverModal
        open={showModal}
        won={state.status === "won"}
        score={timer.elapsed}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="mahjong"
        onClose={() => setShowModal(false)}
        onRestart={() => initGame()}
      />
    </GameShell>
  );
}
