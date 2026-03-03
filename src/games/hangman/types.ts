export interface HangmanState {
  /** The secret word (uppercase) */
  word: string;
  /** Category/clue for the word */
  category: string;
  /** Set of guessed letters (uppercase) */
  guessedLetters: Set<string>;
  /** Number of wrong guesses (max 6) */
  wrongGuesses: number;
  /** Game status */
  status: "playing" | "won" | "lost";
}

export interface WordEntry {
  word: string;
  category: string;
}

export const MAX_WRONG_GUESSES = 6;

/** Turkish QWERTY keyboard layout */
export const TR_KEYBOARD = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"],
];

/** English QWERTY keyboard layout */
export const EN_KEYBOARD = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
