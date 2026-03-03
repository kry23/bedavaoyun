export type LetterState = "correct" | "present" | "absent" | "empty";

export interface LetterResult {
  letter: string;
  state: LetterState;
}

export type GameStatus = "playing" | "won" | "lost";

export interface WordleState {
  target: string;
  guesses: LetterResult[][];
  currentGuess: string;
  attempt: number;
  status: GameStatus;
  usedLetters: Record<string, LetterState>;
}

export const MAX_ATTEMPTS = 6;
export const WORD_LENGTH = 5;

export const KEYBOARD_ROWS_TR = [
  ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["ENTER", "Z", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"],
];

export const KEYBOARD_ROWS_EN = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

/** @deprecated Use KEYBOARD_ROWS_TR instead */
export const KEYBOARD_ROWS = KEYBOARD_ROWS_TR;
