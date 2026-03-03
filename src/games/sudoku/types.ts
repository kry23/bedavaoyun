export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface SudokuCell {
  value: number; // 0 = empty
  given: boolean; // true = pre-filled (cannot edit)
  notes: Set<number>; // pencil marks
  isError: boolean;
}

export type Grid = SudokuCell[][];

export interface HistoryEntry {
  grid: Grid;
  mistakes: number;
}

export interface SudokuState {
  grid: Grid;
  solution: number[][];
  difficulty: Difficulty;
  status: "playing" | "won" | "lost";
  selectedCell: [number, number] | null;
  mistakes: number;
  maxMistakes: number;
  hintsUsed: number;
  history: HistoryEntry[];
}

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; clues: number }
> = {
  easy: { label: "easy", clues: 45 },
  medium: { label: "medium", clues: 35 },
  hard: { label: "hard", clues: 28 },
  expert: { label: "expert", clues: 22 },
};
