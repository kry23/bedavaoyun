"use client";

import { useState, useCallback, useRef } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameOverModal } from "@/components/game/GameOverModal";
import { gameRegistry } from "@/lib/game-registry";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { Shuffle, X, Send, Share2 } from "lucide-react";
import {
  createRandomGame,
  toggleWord,
  deselectAll,
  shuffleWords,
  submitGuess,
  revealAll,
  getShareText,
} from "./engine";
import type { ConnectionsState, SolvedGroup } from "./types";
import { DIFFICULTY_COLORS, GROUP_SIZE, MAX_MISTAKES } from "./types";
import type { ConnectionsLocale, GuessResult } from "./engine";

const game = gameRegistry.connections;

export default function ConnectionsGame() {
  const t = useTranslation();
  const locale = useLocale() as ConnectionsLocale;

  const [state, setState] = useState<ConnectionsState>(() =>
    createRandomGame(locale)
  );
  const [shaking, setShaking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [revealingGroup, setRevealingGroup] = useState<SolvedGroup | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputLockedRef = useRef(false);

  const ct = locale === "tr"
    ? {
        shuffle: "Karıştır",
        deselect: "Temizle",
        submit: "Gönder",
        mistakes: "Kalan Hak",
        oneAway: "Bir tanesi hariç doğru!",
        alreadyGuessed: "Bu tahmini zaten yaptınız!",
        newPuzzle: "Yeni Bulmaca",
        share: "Paylaş",
        copied: "Kopyalandı!",
      }
    : {
        shuffle: "Shuffle",
        deselect: "Deselect",
        submit: "Submit",
        mistakes: "Remaining",
        oneAway: "One away!",
        alreadyGuessed: "Already guessed!",
        newPuzzle: "New Puzzle",
        share: "Share",
        copied: "Copied!",
      };

  const showMessage = useCallback((msg: string, duration = 1500) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  const handleTileClick = useCallback(
    (word: string) => {
      if (inputLockedRef.current) return;
      if (state.status !== "playing") return;
      setState((s) => toggleWord(s, word));
    },
    [state.status]
  );

  const handleShuffle = useCallback(() => {
    if (inputLockedRef.current) return;
    setState((s) => shuffleWords(s));
  }, []);

  const handleDeselect = useCallback(() => {
    if (inputLockedRef.current) return;
    setState((s) => deselectAll(s));
  }, []);

  const handleSubmit = useCallback(() => {
    if (inputLockedRef.current) return;
    if (state.selectedWords.length !== GROUP_SIZE) return;

    const { state: newState, result } = submitGuess(state);

    if (result.type === "alreadyGuessed") {
      showMessage(ct.alreadyGuessed);
      return;
    }

    if (result.type === "correct") {
      inputLockedRef.current = true;
      setRevealingGroup(result.group);

      setTimeout(() => {
        setState(newState);
        setRevealingGroup(null);

        if (result.autoSolved) {
          // Show auto-solved group after a brief delay
          setTimeout(() => {
            inputLockedRef.current = false;
            setShowModal(true);
          }, 600);
        } else {
          inputLockedRef.current = false;
        }
      }, 500);
      return;
    }

    if (result.type === "almostCorrect") {
      inputLockedRef.current = true;
      setShaking(true);
      showMessage(ct.oneAway);
      setState(newState);
      setTimeout(() => {
        setShaking(false);
        inputLockedRef.current = false;
      }, 500);
      return;
    }

    if (result.type === "gameOver") {
      inputLockedRef.current = true;
      setShaking(true);
      setState(newState);
      setTimeout(() => {
        setShaking(false);
        // Reveal all remaining groups
        setState((s) => revealAll(s));
        setTimeout(() => {
          inputLockedRef.current = false;
          setShowModal(true);
        }, 1200);
      }, 600);
      return;
    }

    // wrong
    inputLockedRef.current = true;
    setShaking(true);
    setState(newState);
    setTimeout(() => {
      setShaking(false);
      inputLockedRef.current = false;
    }, 500);
  }, [state, ct.alreadyGuessed, ct.oneAway, showMessage]);

  const handleRestart = useCallback(() => {
    setShowModal(false);
    setState(createRandomGame(locale));
    setMessage(null);
    setCopied(false);
  }, [locale]);

  const handleShare = useCallback(async () => {
    const text = getShareText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [state]);

  const isSolved = (word: string) =>
    state.solvedGroups.some((g) => g.words.includes(word));

  return (
    <GameShell
      game={game}
      controls={
        state.status === "playing" ? (
          <>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <Shuffle className="h-4 w-4" />
              {ct.shuffle}
            </button>
            <button
              onClick={handleDeselect}
              disabled={state.selectedWords.length === 0}
              className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40"
            >
              <X className="h-4 w-4" />
              {ct.deselect}
            </button>
            <button
              onClick={handleSubmit}
              disabled={state.selectedWords.length !== GROUP_SIZE}
              className="flex items-center gap-1.5 rounded-full bg-[#5A3E8E] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              {ct.submit}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 rounded-full bg-[#5A3E8E] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {ct.newPuzzle}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <Share2 className="h-4 w-4" />
              {copied ? ct.copied : ct.share}
            </button>
          </>
        )
      }
      stats={
        state.status === "playing" ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              {ct.mistakes}:
            </span>
            <div className="flex gap-1">
              {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i < MAX_MISTAKES - state.mistakes
                      ? "bg-[#5A3E8E]"
                      : "bg-[hsl(var(--muted))]"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : undefined
      }
    >
      <div className="flex w-full max-w-[600px] flex-col gap-2">
        {/* Message toast */}
        {message && (
          <div className="mx-auto rounded-lg bg-[hsl(var(--foreground))] px-4 py-2 text-sm font-semibold text-[hsl(var(--background))]">
            {message}
          </div>
        )}

        {/* Solved groups */}
        {state.solvedGroups.map((group, idx) => (
          <div
            key={group.category}
            className="animate-conn-banner-in flex flex-col items-center justify-center rounded-lg px-4 py-3"
            style={{
              backgroundColor: DIFFICULTY_COLORS[group.difficulty].bg,
              color: DIFFICULTY_COLORS[group.difficulty].text,
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <span className="text-sm font-bold uppercase tracking-wide">
              {group.category}
            </span>
            <span className="text-xs font-medium">
              {group.words.join(", ")}
            </span>
          </div>
        ))}

        {/* Grid */}
        {state.shuffledWords.length > 0 && (
          <div
            className={`grid grid-cols-4 gap-2 ${shaking ? "animate-conn-shake" : ""}`}
          >
            {state.shuffledWords.map((word) => {
              const isSelected = state.selectedWords.includes(word);
              const isRevealing =
                revealingGroup?.words.includes(word) ?? false;

              return (
                <button
                  key={word}
                  onClick={() => handleTileClick(word)}
                  disabled={isSolved(word) || state.status !== "playing"}
                  className={`
                    flex items-center justify-center rounded-lg px-1 py-4 text-xs font-extrabold uppercase tracking-wide
                    transition-all duration-150 select-none
                    sm:text-sm sm:py-5
                    ${
                      isRevealing
                        ? "animate-conn-tile-out"
                        : isSelected
                          ? "bg-[#5A594E] text-white scale-[0.97]"
                          : "bg-[#EFEFE6] text-[#333] hover:bg-[#E0E0D6] dark:bg-[#3A3A3A] dark:text-[#E0E0E0] dark:hover:bg-[#4A4A4A]"
                    }
                  `}
                  style={
                    isRevealing
                      ? {
                          backgroundColor:
                            DIFFICULTY_COLORS[revealingGroup!.difficulty].bg,
                          color:
                            DIFFICULTY_COLORS[revealingGroup!.difficulty].text,
                        }
                      : undefined
                  }
                >
                  {word}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <GameOverModal
        open={showModal}
        won={state.status === "won"}
        score={state.mistakes}
        scoreLabel={locale === "tr" ? "Hata" : "Mistakes"}
        onClose={() => setShowModal(false)}
        onRestart={handleRestart}
        gameName={locale === "tr" ? "Bağlantılar" : "Connections"}
        gameSlug="connections"
      />
    </GameShell>
  );
}
