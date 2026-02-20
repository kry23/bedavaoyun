import type { LetterResult, LetterState, WordleState } from "./types";
import { MAX_ATTEMPTS, WORD_LENGTH } from "./types";
import { VALID_WORDS } from "./words";

export function getDailyWord(): string {
  // Date-based seed: same word for everyone on the same day
  const now = new Date();
  const start = new Date(2025, 0, 1); // Jan 1, 2025
  const dayIndex = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return VALID_WORDS[dayIndex % VALID_WORDS.length];
}

export function createGame(): WordleState {
  return {
    target: getDailyWord(),
    guesses: [],
    currentGuess: "",
    attempt: 0,
    status: "playing",
    usedLetters: {},
  };
}

export function createRandomGame(): WordleState {
  const target = VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)];
  return {
    target,
    guesses: [],
    currentGuess: "",
    attempt: 0,
    status: "playing",
    usedLetters: {},
  };
}

export function evaluateGuess(guess: string, target: string): LetterResult[] {
  const result: LetterResult[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i],
    state: "absent" as LetterState,
  }));

  const targetChars = target.split("");
  const used = new Array(WORD_LENGTH).fill(false);

  // First pass: correct position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === target[i]) {
      result[i].state = "correct";
      used[i] = true;
    }
  }

  // Second pass: present but wrong position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === "correct") continue;
    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!used[j] && guess[i] === targetChars[j]) {
        result[i].state = "present";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export function addLetter(state: WordleState, letter: string): WordleState {
  if (state.status !== "playing") return state;
  if (state.currentGuess.length >= WORD_LENGTH) return state;
  return { ...state, currentGuess: state.currentGuess + letter.toUpperCase() };
}

export function removeLetter(state: WordleState): WordleState {
  if (state.status !== "playing") return state;
  if (state.currentGuess.length === 0) return state;
  return { ...state, currentGuess: state.currentGuess.slice(0, -1) };
}

export function submitGuess(state: WordleState): WordleState {
  if (state.status !== "playing") return state;
  if (state.currentGuess.length !== WORD_LENGTH) return state;

  const guess = state.currentGuess.toUpperCase();
  const result = evaluateGuess(guess, state.target);

  // Update used letters
  const usedLetters = { ...state.usedLetters };
  result.forEach(({ letter, state: letterState }) => {
    const current = usedLetters[letter];
    if (letterState === "correct") {
      usedLetters[letter] = "correct";
    } else if (letterState === "present" && current !== "correct") {
      usedLetters[letter] = "present";
    } else if (!current) {
      usedLetters[letter] = "absent";
    }
  });

  const newGuesses = [...state.guesses, result];
  const won = guess === state.target;
  const lost = !won && newGuesses.length >= MAX_ATTEMPTS;

  return {
    ...state,
    guesses: newGuesses,
    currentGuess: "",
    attempt: state.attempt + 1,
    status: won ? "won" : lost ? "lost" : "playing",
    usedLetters,
  };
}

export function isValidWord(word: string): boolean {
  return VALID_WORDS.includes(word.toUpperCase());
}
