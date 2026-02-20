import type { Difficulty, Grid, SudokuState } from "./types";
import { DIFFICULTY_CONFIG } from "./types";

/** Generate a fully solved 9x9 Sudoku grid using backtracking. */
function generateSolvedGrid(): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let c = 0; c < 9; c++) if (grid[row][c] === num) return false;
    for (let r = 0; r < 9; r++) if (grid[r][col] === num) return false;
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
      for (let c = bc; c < bc + 3; c++)
        if (grid[r][c] === num) return false;
    return true;
  }

  function solve(grid: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (isValid(grid, r, c, num)) {
              grid[r][c] = num;
              if (solve(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(grid);
  return grid;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Create a puzzle by removing cells from a solved grid. */
function createPuzzle(solution: number[][], clues: number): Grid {
  const grid: Grid = solution.map((row) =>
    row.map((val) => ({
      value: val,
      given: true,
      notes: new Set<number>(),
      isError: false,
    }))
  );

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  );

  let removed = 0;
  const toRemove = 81 - clues;
  for (const [r, c] of positions) {
    if (removed >= toRemove) break;
    grid[r][c] = { value: 0, given: false, notes: new Set(), isError: false };
    removed++;
  }

  return grid;
}

export function createGame(difficulty: Difficulty): SudokuState {
  const solution = generateSolvedGrid();
  const clues = DIFFICULTY_CONFIG[difficulty].clues;
  const grid = createPuzzle(solution, clues);

  return {
    grid,
    solution,
    difficulty,
    status: "playing",
    selectedCell: null,
    mistakes: 0,
    maxMistakes: 3,
  };
}

export function selectCell(state: SudokuState, row: number, col: number): SudokuState {
  return { ...state, selectedCell: [row, col] };
}

export function placeNumber(state: SudokuState, num: number): SudokuState {
  if (state.status !== "playing" || !state.selectedCell) return state;
  const [row, col] = state.selectedCell;
  const cell = state.grid[row][col];
  if (cell.given) return state;

  const newGrid = state.grid.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
  const correct = state.solution[row][col] === num;

  newGrid[row][col] = {
    value: num,
    given: false,
    notes: new Set(),
    isError: !correct,
  };

  const newMistakes = correct ? state.mistakes : state.mistakes + 1;

  // Check win: all cells filled correctly
  let won = true;
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (newGrid[r][c].value !== state.solution[r][c]) won = false;

  return {
    ...state,
    grid: newGrid,
    mistakes: newMistakes,
    status: won ? "won" : "playing",
  };
}

export function eraseCell(state: SudokuState): SudokuState {
  if (state.status !== "playing" || !state.selectedCell) return state;
  const [row, col] = state.selectedCell;
  const cell = state.grid[row][col];
  if (cell.given) return state;

  const newGrid = state.grid.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
  newGrid[row][col] = { value: 0, given: false, notes: new Set(), isError: false };

  return { ...state, grid: newGrid };
}

export function toggleNote(state: SudokuState, num: number): SudokuState {
  if (state.status !== "playing" || !state.selectedCell) return state;
  const [row, col] = state.selectedCell;
  const cell = state.grid[row][col];
  if (cell.given || cell.value !== 0) return state;

  const newGrid = state.grid.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
  const notes = newGrid[row][col].notes;
  if (notes.has(num)) notes.delete(num);
  else notes.add(num);

  return { ...state, grid: newGrid };
}
