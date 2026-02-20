export type Difficulty = "easy" | "medium" | "hard";

export interface MemoryCard {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export interface MemoryState {
  cards: MemoryCard[];
  flippedIndices: number[];
  moves: number;
  matches: number;
  totalPairs: number;
  status: "playing" | "won";
  locked: boolean; // prevent clicks during mismatch animation
}

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; cols: number; pairs: number }
> = {
  easy: { label: "Kolay", cols: 4, pairs: 6 },    // 3x4 = 12 cards
  medium: { label: "Orta", cols: 4, pairs: 8 },    // 4x4 = 16 cards
  hard: { label: "Zor", cols: 6, pairs: 12 },      // 4x6 = 24 cards
};

export const EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊",
  "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
  "🐷", "🐸", "🐵", "🐔", "🐧", "🐦",
];
