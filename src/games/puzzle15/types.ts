export type Grid = (number | null)[][]; // 4x4, null = empty slot

export interface PuzzleState {
  grid: Grid;
  moves: number;
  status: "playing" | "won";
  emptyPos: { r: number; c: number };
}
