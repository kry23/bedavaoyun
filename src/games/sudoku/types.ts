export type Difficulty = "easy" | "medium" | "hard";

export interface SudokuCell {
  value: number; // 0 = empty
  given: boolean; // true = pre-filled (cannot edit)
  notes: Set<number>; // pencil marks
  isError: boolean;
}

export type Grid = SudokuCell[][];

export interface SudokuState {
  grid: Grid;
  solution: number[][];
  difficulty: Difficulty;
  status: "playing" | "won";
  selectedCell: [number, number] | null;
  mistakes: number;
  maxMistakes: number;
}

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; clues: number }
> = {
  easy: { label: "easy", clues: 45 },
  medium: { label: "medium", clues: 35 },
  hard: { label: "hard", clues: 25 },
};
