"use client";

import { useCallback, useEffect, useState } from "react";
import { createGame, guessLetter, getRevealedWord } from "./engine";
import type { HangmanState } from "./types";
import { MAX_WRONG_GUESSES, TR_KEYBOARD, EN_KEYBOARD } from "./types";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { gameRegistry } from "@/lib/game-registry";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getGameTranslation } from "@/i18n/game-translations";

const GAME_INFO = gameRegistry.hangman;

/* ── Sound effects ────────────────────────────────────────── */

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.12) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch {}
}

function sfxCorrect() { playTone(700, 0.08, "sine", 0.1); }
function sfxWrong() { playTone(250, 0.15, "triangle", 0.1); }
function sfxWin() {
  playTone(523, 0.12, "sine", 0.12);
  setTimeout(() => playTone(659, 0.12, "sine", 0.12), 100);
  setTimeout(() => playTone(784, 0.2, "sine", 0.12), 200);
}
function sfxLose() {
  playTone(350, 0.2, "sine", 0.1);
  setTimeout(() => playTone(250, 0.3, "sine", 0.1), 200);
}

/* ── SVG Hangman Drawing ──────────────────────────────────── */

function HangmanSvg({ wrongGuesses }: { wrongGuesses: number }) {
  const parts = wrongGuesses;
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full" style={{ maxWidth: 300, maxHeight: 300 }}>
      {/* Gallows - always visible */}
      {/* Base */}
      <line x1="20" y1="210" x2="80" y2="210" stroke="#5ba4d9" strokeWidth="3" strokeLinecap="round" />
      {/* Pole */}
      <line x1="50" y1="210" x2="50" y2="30" stroke="#5ba4d9" strokeWidth="3" strokeLinecap="round" />
      {/* Top beam */}
      <line x1="50" y1="30" x2="140" y2="30" stroke="#5ba4d9" strokeWidth="3" strokeLinecap="round" />
      {/* Rope */}
      <line x1="140" y1="30" x2="140" y2="55" stroke="#5ba4d9" strokeWidth="3" strokeLinecap="round" />
      {/* Support beam */}
      <line x1="50" y1="60" x2="80" y2="30" stroke="#5ba4d9" strokeWidth="2" strokeLinecap="round" />

      {/* Body parts - chalk white style */}
      {/* Head */}
      {parts >= 1 && (
        <circle cx="140" cy="72" r="17" fill="none" stroke="#e8e0cc" strokeWidth="2.5" />
      )}
      {/* Body */}
      {parts >= 2 && (
        <line x1="140" y1="89" x2="140" y2="145" stroke="#e8e0cc" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {/* Left arm */}
      {parts >= 3 && (
        <line x1="140" y1="105" x2="112" y2="125" stroke="#e8e0cc" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {/* Right arm */}
      {parts >= 4 && (
        <line x1="140" y1="105" x2="168" y2="125" stroke="#e8e0cc" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {/* Left leg */}
      {parts >= 5 && (
        <line x1="140" y1="145" x2="115" y2="180" stroke="#e8e0cc" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {/* Right leg */}
      {parts >= 6 && (
        <line x1="140" y1="145" x2="165" y2="180" stroke="#e8e0cc" strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* Eyes when lost */}
      {parts >= 6 && (
        <>
          <line x1="133" y1="67" x2="137" y2="73" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <line x1="137" y1="67" x2="133" y2="73" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <line x1="143" y1="67" x2="147" y2="73" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <line x1="147" y1="67" x2="143" y2="73" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────── */

export default function HangmanGame() {
  const t = useTranslation();
  const locale = useLocale() as "tr" | "en";
  const gameT = getGameTranslation("hangman", locale);

  const [state, setState] = useState<HangmanState>(() => createGame(locale));
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [revealAnim, setRevealAnim] = useState<Set<number>>(new Set());

  const isFinished = state.status !== "playing";
  const keyboard = locale === "tr" ? TR_KEYBOARD : EN_KEYBOARD;
  const revealed = getRevealedWord(state);

  const handleGuess = useCallback(
    (letter: string) => {
      if (isFinished) return;
      if (state.guessedLetters.has(letter)) return;

      const newState = guessLetter(state, letter);
      setState(newState);

      const isCorrect = newState.wrongGuesses === state.wrongGuesses;

      if (isCorrect) {
        sfxCorrect();
        // Animate newly revealed positions
        const newPositions = new Set<number>();
        const oldRevealed = getRevealedWord(state);
        const newRevealed = getRevealedWord(newState);
        newRevealed.forEach((ch, i) => {
          if (oldRevealed[i] === "_" && ch !== "_") newPositions.add(i);
        });
        setRevealAnim(newPositions);
        setTimeout(() => setRevealAnim(new Set()), 300);
      } else {
        sfxWrong();
      }

      if (newState.status === "won") {
        sfxWin();
        const wrongPenalty = newState.wrongGuesses;
        const wordBonus = newState.word.length;
        const roundScore = Math.max(10, wordBonus * 10 - wrongPenalty * 15);
        setScore((s) => s + roundScore);
        setStreak((s) => s + 1);
        setTimeout(() => setShowModal(true), 800);
      } else if (newState.status === "lost") {
        sfxLose();
        setStreak(0);
        setTimeout(() => setShowModal(true), 800);
      }
    },
    [state, isFinished],
  );

  // Keyboard support
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      // Check if the key is a valid letter for the current keyboard
      const allKeys = keyboard.flat();
      if (allKeys.includes(key)) {
        e.preventDefault();
        handleGuess(key);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleGuess, keyboard]);

  const handleNewGame = useCallback(() => {
    setState(createGame(locale));
    setShowModal(false);
    setRevealAnim(new Set());
  }, [locale]);

  const handleNextWord = useCallback(() => {
    setState(createGame(locale));
    setShowModal(false);
    setRevealAnim(new Set());
  }, [locale]);

  const wrongLeft = MAX_WRONG_GUESSES - state.wrongGuesses;

  return (
    <GameShell game={GAME_INFO}>
      {/* Main game area - chalkboard theme */}
      <div
        className="relative w-full mx-auto select-none"
        style={{ maxWidth: 800 }}
      >
        {/* Score & streak bar */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold" style={{ color: "#5ba4d9" }}>
              {locale === "tr" ? "Puan" : "Score"}: {score}
            </span>
            {streak > 0 && (
              <span className="text-sm font-bold" style={{ color: "#f59e0b" }}>
                {locale === "tr" ? "Seri" : "Streak"}: {streak}
              </span>
            )}
          </div>
          <span className="text-sm" style={{ color: "#e8e0cc" }}>
            {locale === "tr" ? "Kalan hak" : "Lives"}: {"❤️".repeat(wrongLeft)}{"🖤".repeat(state.wrongGuesses)}
          </span>
        </div>

        {/* Chalkboard area */}
        <div
          className="rounded-2xl p-4 sm:p-6"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
            border: "3px solid #2a2a4a",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Category label */}
          <div className="flex justify-center mb-4">
            <div
              className="px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide"
              style={{
                border: "2px solid #5ba4d9",
                color: "#5ba4d9",
                background: "rgba(91, 164, 217, 0.08)",
              }}
            >
              {state.category}
            </div>
          </div>

          {/* Game content: word + hangman */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {/* Word display */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[160px]">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {revealed.map((ch, i) =>
                  ch === " " ? (
                    <div key={i} className="w-3" />
                  ) : ch === "-" || ch === "'" ? (
                    <span
                      key={i}
                      className="text-3xl sm:text-4xl font-bold"
                      style={{ color: "#e8e0cc" }}
                    >
                      {ch}
                    </span>
                  ) : (
                    <div
                      key={i}
                      className="flex flex-col items-center transition-all duration-200"
                      style={{
                        transform: revealAnim.has(i) ? "scale(1.3)" : "scale(1)",
                      }}
                    >
                      <span
                        className="text-3xl sm:text-4xl font-bold"
                        style={{
                          color:
                            ch === "_"
                              ? "transparent"
                              : state.status === "lost" && !state.guessedLetters.has(state.word[i])
                                ? "#ef4444"
                                : "#e8e0cc",
                          minWidth: 24,
                          textAlign: "center",
                          display: "block",
                        }}
                      >
                        {state.status === "lost" ? state.word[i] : ch === "_" ? "\u00A0" : ch}
                      </span>
                      <div
                        className="mt-1 rounded-full"
                        style={{
                          width: 30,
                          height: 3,
                          background: ch !== "_" ? "#5ba4d9" : "#4a5568",
                        }}
                      />
                    </div>
                  ),
                )}
              </div>

              {/* Status message */}
              {state.status === "won" && (
                <div
                  className="mt-4 text-lg font-bold animate-bounce"
                  style={{ color: "#10b981" }}
                >
                  {locale === "tr" ? "Tebrikler!" : "Well done!"}
                </div>
              )}
              {state.status === "lost" && (
                <div className="mt-4 text-lg font-bold" style={{ color: "#ef4444" }}>
                  {locale === "tr" ? "Kelime: " : "The word was: "}
                  <span style={{ color: "#e8e0cc" }}>{state.word}</span>
                </div>
              )}
            </div>

            {/* Hangman figure */}
            <div className="w-44 h-44 sm:w-64 sm:h-64 flex-shrink-0">
              <HangmanSvg wrongGuesses={state.wrongGuesses} />
            </div>
          </div>
        </div>

        {/* Keyboard area - notebook paper style */}
        <div
          className="mt-4 rounded-2xl p-3 sm:p-4"
          style={{
            background: "linear-gradient(180deg, #f5f0e8 0%, #ebe5d9 100%)",
            border: "2px solid #d4cfc5",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 27px, #d4e3f0 28px)",
          }}
        >
          {/* Instruction text */}
          <p
            className="text-center text-sm mb-3 font-medium"
            style={{ color: "#4a7aa5" }}
          >
            {locale === "tr" ? "Aşağıdaki harfleri kullanın" : "Use the letters below"}
          </p>

          {/* Keyboard rows */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            {keyboard.map((row, ri) => (
              <div key={ri} className="flex gap-1 sm:gap-1.5 justify-center">
                {row.map((letter) => {
                  const guessed = state.guessedLetters.has(letter);
                  const isInWord = state.word.includes(letter);
                  const correct = guessed && isInWord;
                  const wrong = guessed && !isInWord;

                  return (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={guessed || isFinished}
                      className="font-bold rounded-lg transition-all duration-150 active:scale-90"
                      style={{
                        width: locale === "tr" ? 36 : 42,
                        height: 46,
                        fontSize: locale === "tr" ? 16 : 18,
                        color: correct
                          ? "#fff"
                          : wrong
                            ? "#fff"
                            : guessed
                              ? "#999"
                              : "#2c5f8a",
                        background: correct
                          ? "#10b981"
                          : wrong
                            ? "#ef4444"
                            : guessed
                              ? "#ccc"
                              : "#fff",
                        border: correct
                          ? "2px solid #059669"
                          : wrong
                            ? "2px solid #dc2626"
                            : guessed
                              ? "2px solid #bbb"
                              : "2px solid #a3c4de",
                        boxShadow: guessed
                          ? "none"
                          : "0 2px 4px rgba(0,0,0,0.1)",
                        cursor: guessed || isFinished ? "default" : "pointer",
                        opacity: guessed ? 0.7 : 1,
                      }}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* New game / Next word buttons */}
          {isFinished && (
            <div className="flex justify-center gap-3 mt-4">
              {state.status === "won" && (
                <button
                  onClick={handleNextWord}
                  className="px-6 py-2 rounded-lg font-bold text-white transition-all active:scale-95"
                  style={{ background: "#10b981", border: "2px solid #059669" }}
                >
                  {locale === "tr" ? "Sonraki Kelime →" : "Next Word →"}
                </button>
              )}
              <button
                onClick={handleNewGame}
                className="px-6 py-2 rounded-lg font-bold transition-all active:scale-95"
                style={{
                  background: state.status === "lost" ? "#ef4444" : "#5ba4d9",
                  color: "#fff",
                  border: `2px solid ${state.status === "lost" ? "#dc2626" : "#4a8fc0"}`,
                }}
              >
                {locale === "tr" ? "Yeni Oyun" : "New Game"}
              </button>
            </div>
          )}
        </div>
      </div>

      <GameOverModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onRestart={handleNewGame}
        won={state.status === "won"}
        score={score}
        scoreLabel={gameT.scoreLabel}
        gameName={gameT.name}
        gameSlug={GAME_INFO.slug}
      />
    </GameShell>
  );
}
