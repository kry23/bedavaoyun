"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createRandomGame,
  addLetter,
  removeLetter,
  submitGuess,
} from "./engine";
import type { WordleLocale } from "./engine";
import {
  KEYBOARD_ROWS_TR,
  KEYBOARD_ROWS_EN,
  MAX_ATTEMPTS,
  WORD_LENGTH,
  type LetterState,
  type WordleState,
} from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/Button";
import { gameRegistry } from "@/lib/game-registry";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";
import { RotateCcw, Share2, Delete } from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { SITE_NAME } from "@/utils/constants";

const GAME_INFO = gameRegistry.wordle;

const FLIP_DELAY_PER_TILE = 300; // ms between each tile flip
const FLIP_DURATION = 500; // ms for one tile flip

export default function WordleGame() {
  const locale = useLocale() as WordleLocale;
  const keyboardRows = locale === "en" ? KEYBOARD_ROWS_EN : KEYBOARD_ROWS_TR;
  const letterRegex = locale === "en"
    ? /^[A-Za-z]$/
    : /^[A-ZÇĞİÖŞÜa-zçğıöşü]$/;

  const [state, setState] = useState<WordleState>(() => createRandomGame(locale));
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);
  const [flippingRow, setFlippingRow] = useState<number | null>(null);
  const [revealedCols, setRevealedCols] = useState<Set<number>>(new Set());
  const [popCol, setPopCol] = useState<number | null>(null);
  const [bounceRow, setBounceRow] = useState<number | null>(null);
  const inputLockedRef = useRef(false);

  const t = useTranslation();
  const gameT = getGameTranslation("wordle", locale);

  // Flip animation sequence: reveal tiles one by one
  const animateFlip = useCallback((rowIndex: number, onDone: () => void) => {
    inputLockedRef.current = true;
    setFlippingRow(rowIndex);
    setRevealedCols(new Set());

    for (let c = 0; c < WORD_LENGTH; c++) {
      setTimeout(() => {
        setRevealedCols((prev) => new Set(prev).add(c));
      }, c * FLIP_DELAY_PER_TILE + FLIP_DURATION / 2);
    }

    // All flips done
    const totalTime = (WORD_LENGTH - 1) * FLIP_DELAY_PER_TILE + FLIP_DURATION;
    setTimeout(() => {
      setFlippingRow(null);
      setRevealedCols(new Set());
      inputLockedRef.current = false;
      onDone();
    }, totalTime);
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (state.status !== "playing") return;
      if (inputLockedRef.current) return;

      if (key === "Enter" || key === "ENTER") {
        if (state.currentGuess.length !== WORD_LENGTH) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          toast.error(t.wordle.enterFiveLetters);
          return;
        }
        const newState = submitGuess(state);
        const rowIndex = state.guesses.length;
        setState(newState);

        animateFlip(rowIndex, () => {
          if (newState.status === "won") {
            setBounceRow(rowIndex);
            setTimeout(() => setBounceRow(null), 1500);
            setTimeout(() => setShowModal(true), 1500);
          } else if (newState.status === "lost") {
            setTimeout(() => setShowModal(true), 500);
          }
        });
      } else if (key === "Backspace" || key === "⌫") {
        setState(removeLetter(state));
      } else if (letterRegex.test(key)) {
        // Pop animation for typed letter
        if (state.currentGuess.length < WORD_LENGTH) {
          setPopCol(state.currentGuess.length);
          setTimeout(() => setPopCol(null), 150);
        }
        setState(addLetter(state, key));
      }
    },
    [state, animateFlip, letterRegex, t.wordle.enterFiveLetters]
  );

  useKeyboard(handleKey, state.status === "playing");

  const initGame = useCallback(() => {
    setState(createRandomGame(locale));
    setShowModal(false);
    setFlippingRow(null);
    setRevealedCols(new Set());
    setBounceRow(null);
    inputLockedRef.current = false;
  }, [locale]);

  // Reinitialize when locale changes
  useEffect(() => {
    initGame();
  }, [locale]);

  const shareResult = useCallback(() => {
    const emojiMap: Record<LetterState, string> = {
      correct: "🟩",
      present: "🟨",
      absent: "⬛",
      empty: "⬜",
    };
    const grid = state.guesses
      .map((row) => row.map((cell) => emojiMap[cell.state]).join(""))
      .join("\n");
    const result = state.status === "won" ? `${state.guesses.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
    const slug = locale === "en" ? "en/games/wordle" : "oyunlar/wordle";
    const domain = locale === "en" ? "freegames4you.online" : "bedava-oyun.com";
    const text = `${SITE_NAME} - ${gameT.name} ${result}\n\n${grid}\n\n${domain}/${slug}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success(t.wordle.resultCopied);
    });
  }, [state, locale, gameT.name, t.wordle.resultCopied]);

  // Build display grid
  const rows = [];
  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    const cells = [];
    for (let c = 0; c < WORD_LENGTH; c++) {
      let letter = "";
      let cellState: LetterState = "empty";
      const isCurrentRow = r === state.guesses.length;
      const isGuessedRow = r < state.guesses.length;

      if (isGuessedRow) {
        letter = state.guesses[r][c].letter;
        cellState = state.guesses[r][c].state;
      } else if (isCurrentRow) {
        letter = state.currentGuess[c] || "";
      }

      // Determine if this tile is being animated
      const isFlipping = flippingRow === r;
      const isRevealed = isFlipping && revealedCols.has(c);
      const showColor = isGuessedRow && (flippingRow !== r || isRevealed);
      const isPop = isCurrentRow && popCol === c && letter;

      // Bounce animation for won row
      const isBouncing = bounceRow === r;

      cells.push(
        <div
          key={c}
          className="perspective-[400px]"
          style={
            isBouncing
              ? {
                  animation: `wordle-bounce 1s ease ${c * 100}ms`,
                }
              : undefined
          }
        >
          <div
            className={cn(
              "flex items-center justify-center font-bold uppercase select-none",
              "w-[52px] h-[52px] sm:w-[62px] sm:h-[62px] text-2xl sm:text-[32px]",
              "border-2 transition-colors duration-100",
              // Colors
              showColor && cellState === "correct" && "bg-[#6aaa64] text-white border-[#6aaa64]",
              showColor && cellState === "present" && "bg-[#c9b458] text-white border-[#c9b458]",
              showColor && cellState === "absent" && "bg-[#787c7e] text-white border-[#787c7e] dark:bg-[#3a3a3c] dark:border-[#3a3a3c]",
              !showColor && letter && cellState === "empty" && "border-[#878a8c] dark:border-[#565758] text-[hsl(var(--foreground))]",
              !showColor && !letter && "border-[#d3d6da] dark:border-[#3a3a3c]",
              // Flip animation
              isFlipping && !isRevealed && "border-[#878a8c] dark:border-[#565758]",
              isPop && "animate-wordle-pop",
            )}
            style={
              isFlipping
                ? {
                    animation: `wordle-flip ${FLIP_DURATION}ms ease-in-out ${c * FLIP_DELAY_PER_TILE}ms`,
                    transformStyle: "preserve-3d",
                  }
                : undefined
            }
          >
            {letter}
          </div>
        </div>
      );
    }
    rows.push(
      <div
        key={r}
        className={cn(
          "flex gap-[5px] justify-center",
          r === state.guesses.length && shake && "animate-wordle-shake"
        )}
      >
        {cells}
      </div>
    );
  }

  // Determine keyboard letter colors (only use revealed letters)
  const keyboardLetterStates = { ...state.usedLetters };
  // Note: flippingRow is used only for visual animation above, keyboard states stay as-is

  return (
    <GameShell
      game={GAME_INFO}
      controls={
        <Button size="sm" variant="secondary" onClick={initGame}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          {t.wordle.newWord}
        </Button>
      }
    >
      {/* Letter Grid */}
      <div className="flex flex-col items-center gap-[5px] py-2">{rows}</div>

      {/* On-screen Keyboard */}
      <div className="mt-3 flex flex-col items-center gap-[6px] w-full max-w-[500px] px-2">
        {keyboardRows.map((row, ri) => (
          <div key={ri} className="flex gap-[6px] justify-center w-full">
            {row.map((key) => {
              const letterState = keyboardLetterStates[key];
              const isWide = key === "ENTER" || key === "⌫";

              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={cn(
                    "flex items-center justify-center rounded-md font-bold transition-colors select-none",
                    "h-[52px] sm:h-[58px] text-[13px] sm:text-[15px]",
                    isWide ? "px-3 min-w-[58px] sm:min-w-[65px] text-xs sm:text-sm" : "flex-1 min-w-[28px] max-w-[43px]",
                    // Color states
                    letterState === "correct" && "bg-[#6aaa64] text-white",
                    letterState === "present" && "bg-[#c9b458] text-white",
                    letterState === "absent" && "bg-[#787c7e] text-white dark:bg-[#3a3a3c]",
                    !letterState && "bg-[#d3d6da] dark:bg-[#818384] text-[hsl(var(--foreground))] hover:bg-[#c4c7cb] dark:hover:bg-[#6e7073]",
                  )}
                >
                  {key === "⌫" ? (
                    <Delete className="h-5 w-5" />
                  ) : key === "ENTER" ? (
                    locale === "en" ? "ENTER" : "GİR"
                  ) : (
                    key
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Share + reveal on game end */}
      {state.status !== "playing" && !inputLockedRef.current && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <Button size="sm" variant="primary" onClick={shareResult}>
            <Share2 className="mr-1 h-3.5 w-3.5" />
            {t.wordle.shareResult}
          </Button>
          {state.status === "lost" && (
            <p className="text-center text-sm">
              {t.wordle.correctWord}{" "}
              <strong className="text-[#6aaa64] font-bold">{state.target}</strong>
            </p>
          )}
        </div>
      )}

      <GameOverModal
        open={showModal}
        won={state.status === "won"}
        score={state.guesses.length}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug="wordle"
        onClose={() => setShowModal(false)}
        onRestart={initGame}
      />
    </GameShell>
  );
}
