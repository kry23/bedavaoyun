import type { HangmanState, WordEntry } from "./types";
import { MAX_WRONG_GUESSES } from "./types";
import { WORDS_TR } from "./words-tr";
import { WORDS_EN } from "./words-en";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createGame(locale: "tr" | "en"): HangmanState {
  const words = locale === "tr" ? WORDS_TR : WORDS_EN;
  const entry = pickRandom(words);
  return {
    word: entry.word,
    category: entry.category,
    guessedLetters: new Set(),
    wrongGuesses: 0,
    status: "playing",
  };
}

export function guessLetter(state: HangmanState, letter: string): HangmanState {
  if (state.status !== "playing") return state;

  const upper = letter.toUpperCase();
  if (state.guessedLetters.has(upper)) return state;

  const newGuessed = new Set(state.guessedLetters);
  newGuessed.add(upper);

  const isCorrect = state.word.includes(upper);
  const newWrong = isCorrect ? state.wrongGuesses : state.wrongGuesses + 1;

  // Check win: all letters in word are guessed
  const won = Array.from(state.word).every(
    (ch) => ch === " " || ch === "-" || ch === "'" || newGuessed.has(ch)
  );

  // Check loss
  const lost = newWrong >= MAX_WRONG_GUESSES;

  return {
    ...state,
    guessedLetters: newGuessed,
    wrongGuesses: newWrong,
    status: won ? "won" : lost ? "lost" : "playing",
  };
}

export function getRevealedWord(state: HangmanState): string[] {
  return Array.from(state.word).map((ch) => {
    if (ch === " " || ch === "-" || ch === "'") return ch;
    return state.guessedLetters.has(ch) ? ch : "_";
  });
}

export function getWordForLocale(locale: "tr" | "en"): WordEntry[] {
  return locale === "tr" ? WORDS_TR : WORDS_EN;
}
