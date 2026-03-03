"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { gameRegistry } from "@/lib/game-registry";
import type { Country, Guess, GlobleState } from "./types";
import { COUNTRIES } from "./countries";
import { LANDMASSES } from "./world-data";
import {
  createGame,
  makeGuess,
  searchCountries,
  proximityColor,
  directionArrow,
} from "./engine";

/* ── Orthographic Globe SVG ────────────────────────── */
const DEG = Math.PI / 180;
const R = 190;
const CX = 200;
const CY = 200;

function project(
  lat: number,
  lng: number,
  cLat: number,
  cLng: number
): { x: number; y: number; visible: boolean } {
  const la = lat * DEG;
  const lo = lng * DEG;
  const cla = cLat * DEG;
  const clo = cLng * DEG;
  const x = Math.cos(la) * Math.sin(lo - clo);
  const y = Math.cos(cla) * Math.sin(la) - Math.sin(cla) * Math.cos(la) * Math.cos(lo - clo);
  const z = Math.sin(cla) * Math.sin(la) + Math.cos(cla) * Math.cos(la) * Math.cos(lo - clo);
  return { x, y: -y, visible: z > 0 };
}

/** Build SVG path for a polygon, clipped to visible hemisphere */
function polygonPath(coords: [number, number][], cLat: number, cLng: number): string {
  let d = "";
  let started = false;
  for (const [lat, lng] of coords) {
    const p = project(lat, lng, cLat, cLng);
    if (!p.visible) { started = false; continue; }
    const sx = CX + p.x * R;
    const sy = CY + p.y * R;
    d += started ? `L${sx.toFixed(1)},${sy.toFixed(1)} ` : `M${sx.toFixed(1)},${sy.toFixed(1)} `;
    started = true;
  }
  return d ? d + "Z" : "";
}

/** Build graticule lines */
function buildGraticule(cLat: number, cLng: number): string[] {
  const paths: string[] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    let p2 = "";
    for (let lng = -180; lng <= 180; lng += 5) {
      const pt = project(lat, lng, cLat, cLng);
      if (pt.visible) {
        const sx = CX + pt.x * R;
        const sy = CY + pt.y * R;
        p2 += p2 ? ` L${sx.toFixed(1)},${sy.toFixed(1)}` : `M${sx.toFixed(1)},${sy.toFixed(1)}`;
      } else if (p2) { paths.push(p2); p2 = ""; }
    }
    if (p2) paths.push(p2);
  }
  for (let lng = -180; lng < 180; lng += 30) {
    let p2 = "";
    for (let lat = -90; lat <= 90; lat += 5) {
      const pt = project(lat, lng, cLat, cLng);
      if (pt.visible) {
        const sx = CX + pt.x * R;
        const sy = CY + pt.y * R;
        p2 += p2 ? ` L${sx.toFixed(1)},${sy.toFixed(1)}` : `M${sx.toFixed(1)},${sy.toFixed(1)}`;
      } else if (p2) { paths.push(p2); p2 = ""; }
    }
    if (p2) paths.push(p2);
  }
  return paths;
}

function GlobeSvg({
  guesses,
  target,
  won,
  centerLat,
  centerLng,
  onDrag,
}: {
  guesses: Guess[];
  target: Country;
  won: boolean;
  centerLat: number;
  centerLng: number;
  onDrag: (dlat: number, dlng: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      // Convert pixel drag to degrees (sensitivity)
      onDrag(-dy * 0.4, dx * 0.4);
    },
    [onDrag]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Precompute graticule
  const graticulePaths = useMemo(() => buildGraticule(centerLat, centerLng), [centerLat, centerLng]);

  // Precompute land mass paths
  const landPaths = useMemo(
    () => LANDMASSES.map((coords) => polygonPath(coords, centerLat, centerLng)).filter(Boolean),
    [centerLat, centerLng]
  );

  // Guessed codes lookup
  const guessMap = useMemo(() => {
    const m = new Map<string, Guess>();
    for (const g of guesses) m.set(g.country.code, g);
    return m;
  }, [guesses]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className="w-full max-w-[400px] mx-auto cursor-grab active:cursor-grabbing select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <defs>
        <radialGradient id="globe-ocean" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="60%" stopColor="#2563a8" />
          <stop offset="100%" stopColor="#1a3d6e" />
        </radialGradient>
        <radialGradient id="globe-shine" cx="30%" cy="25%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="globe-land" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#5cb85c" />
          <stop offset="100%" stopColor="#3d8b3d" />
        </radialGradient>
        <filter id="globe-shadow">
          <feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.35)" />
        </filter>
        <clipPath id="globe-clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {/* Globe shadow */}
      <circle cx={CX} cy={CY} r={R} fill="url(#globe-ocean)" filter="url(#globe-shadow)" />

      <g clipPath="url(#globe-clip)">
        {/* Graticule */}
        {graticulePaths.map((d, i) => (
          <path key={`g${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        ))}

        {/* Landmasses – solid fill for realism */}
        {landPaths.map((d, i) => (
          <path
            key={`l${i}`}
            d={d}
            fill="#5cb85c"
            fillOpacity={0.65}
            stroke="#2d6a2d"
            strokeWidth="0.4"
            strokeOpacity={0.7}
          />
        ))}

        {/* Country markers – colored by proximity */}
        {COUNTRIES.map((c) => {
          const p = project(c.lat, c.lng, centerLat, centerLng);
          if (!p.visible) return null;
          const guess = guessMap.get(c.code);
          const isTarget = won && c.code === target.code;
          const isGuessed = !!guess;

          const sx = CX + p.x * R;
          const sy = CY + p.y * R;

          if (!isGuessed && !isTarget) {
            // Unguessed: tiny faint dot
            return (
              <circle key={c.code} cx={sx} cy={sy} r={1.5} fill="rgba(255,255,255,0.12)" />
            );
          }

          const radius = isTarget ? 10 : 7;
          const color = isTarget ? "#16a34a" : proximityColor(guess!.proximity);

          return (
            <g key={c.code}>
              {/* Glow */}
              <circle cx={sx} cy={sy} r={radius + 4} fill={color} fillOpacity={0.25} />
              {/* Main circle */}
              <circle
                cx={sx}
                cy={sy}
                r={radius}
                fill={color}
                stroke={isTarget ? "#fff" : "rgba(0,0,0,0.4)"}
                strokeWidth={isTarget ? 2.5 : 1}
              />
              {/* Flag label */}
              <text
                x={sx}
                y={sy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isTarget ? 12 : 9}
                style={{ pointerEvents: "none" }}
              >
                {c.flag}
              </text>
            </g>
          );
        })}
      </g>

      {/* Shine overlay */}
      <circle cx={CX} cy={CY} r={R} fill="url(#globe-shine)" />

      {/* Globe border */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
    </svg>
  );
}

/* ── Guess List Item ───────────────────────────────── */
function GuessItem({
  guess,
  locale,
  isCorrect,
}: {
  guess: Guess;
  locale: "tr" | "en";
  isCorrect: boolean;
}) {
  const name = locale === "tr" ? guess.country.nameTr : guess.country.nameEn;
  const color = proximityColor(guess.proximity);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl border transition-all ${
        isCorrect
          ? "border-green-400 bg-green-50 dark:bg-green-900/30"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <span className="text-xl sm:text-2xl">{guess.country.flag}</span>
      <span className="font-semibold text-sm sm:text-base flex-1 truncate">{name}</span>
      {!isCorrect && (
        <>
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums w-16 text-right">
            {guess.distance.toLocaleString()} km
          </span>
          <span className="text-base">{directionArrow(guess.direction)}</span>
        </>
      )}
      {isCorrect && <span className="text-lg">🎉</span>}
      {/* Proximity bar */}
      <div className="w-16 sm:w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${guess.proximity}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

/* ── Main Game Component ───────────────────────────── */
const GAME_INFO = gameRegistry.globle;

export default function GlobleGame() {
  const locale = useLocale();
  const t = useTranslation();
  const g = t.globle;
  const gameT = getGameTranslation("globle", locale);

  const [state, setState] = useState<GlobleState>(() => createGame());
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [centerLat, setCenterLat] = useState(20);
  const [centerLng, setCenterLng] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Drag handler for globe rotation
  const handleDrag = useCallback((dlat: number, dlng: number) => {
    setCenterLat((prev) => Math.max(-80, Math.min(80, prev + dlat)));
    setCenterLng((prev) => prev + dlng);
  }, []);

  // Track guessed codes
  const guessedCodes = useMemo(
    () => new Set(state.guesses.map((g) => g.country.code)),
    [state.guesses]
  );

  // Sort guesses by proximity (closest first)
  const sortedGuesses = useMemo(
    () => [...state.guesses].sort((a, b) => b.proximity - a.proximity),
    [state.guesses]
  );

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setSelectedIdx(-1);
      if (q.trim().length >= 1) {
        const results = searchCountries(q, locale, guessedCodes);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [locale, guessedCodes]
  );

  const handleGuess = useCallback(
    (country: Country) => {
      const newState = makeGuess(state, country);
      setState(newState);
      setQuery("");
      setSuggestions([]);
      setShowSuggestions(false);

      // Rotate globe to show the guessed country
      setCenterLat(country.lat);
      setCenterLng(country.lng);

      if (newState.status === "won") {
        setShowModal(true);
      } else {
        inputRef.current?.focus();
      }
    },
    [state]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedIdx >= 0) {
        e.preventDefault();
        handleGuess(suggestions[selectedIdx]);
      }
    },
    [showSuggestions, suggestions, selectedIdx, handleGuess]
  );

  // Close suggestions on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNewGame = useCallback(() => {
    setState(createGame());
    setQuery("");
    setCenterLat(20);
    setCenterLng(0);
    setShowModal(false);
  }, []);

  return (
    <GameShell game={GAME_INFO}>
      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
        {/* Globe */}
        <GlobeSvg
          guesses={state.guesses}
          target={state.target}
          won={state.status === "won"}
          centerLat={centerLat}
          centerLng={centerLng}
          onDrag={handleDrag}
        />

        {/* Input area */}
        {state.status === "playing" && (
          <div className="relative w-full max-w-sm">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder={g.placeholder}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-base font-medium transition-colors"
                autoComplete="off"
              />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden"
              >
                {suggestions.map((c, i) => {
                  const name = locale === "tr" ? c.nameTr : c.nameEn;
                  return (
                    <button
                      key={c.code}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                        i === selectedIdx
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : ""
                      }`}
                      onClick={() => handleGuess(c)}
                      onMouseEnter={() => setSelectedIdx(i)}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="font-medium text-sm">{name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Hint text */}
        {state.status === "playing" && state.guesses.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {g.hint}
          </p>
        )}

        {/* Guess count */}
        {state.guesses.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {g.guessCount}: {state.guesses.length}
          </div>
        )}

        {/* Proximity legend */}
        {state.guesses.length > 0 && state.status === "playing" && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
            <span>{g.far}</span>
            <div className="flex gap-[2px]">
              {["#fde68a", "#fbbf24", "#f59e0b", "#ea580c", "#dc2626", "#991b1b", "#16a34a"].map(
                (c) => (
                  <div
                    key={c}
                    className="w-4 h-2.5 rounded-sm"
                    style={{ backgroundColor: c }}
                  />
                )
              )}
            </div>
            <span>{g.close}</span>
          </div>
        )}

        {/* Guess list */}
        {sortedGuesses.length > 0 && (
          <div className="w-full space-y-2 max-h-[300px] overflow-y-auto">
            {sortedGuesses.map((guess) => (
              <GuessItem
                key={guess.country.code}
                guess={guess}
                locale={locale}
                isCorrect={guess.country.code === state.target.code}
              />
            ))}
          </div>
        )}

        {/* Game Over Modal */}
        <GameOverModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onRestart={handleNewGame}
          won={state.status === "won"}
          score={state.guesses.length}
          scoreLabel={gameT.scoreLabel}
          gameName={gameT.name}
          gameSlug={GAME_INFO.slug}
        />
      </div>
    </GameShell>
  );
}
