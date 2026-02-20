export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  mine: boolean;
  adjacentMines: number;
  state: CellState;
}

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  width: number;
  height: number;
  mines: number;
  label: string;
}

export interface MinesweeperState {
  grid: Cell[][];
  width: number;
  height: number;
  mines: number;
  status: GameStatus;
  flagCount: number;
  revealedCount: number;
  firstClick: boolean;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { width: 9, height: 9, mines: 10, label: "easy" },
  medium: { width: 16, height: 16, mines: 40, label: "medium" },
  hard: { width: 30, height: 16, mines: 99, label: "hard" },
};
