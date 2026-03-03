import type { Difficulty, Grid, SudokuState, HistoryEntry } from "./types";
import { DIFFICULTY_CONFIG } from "./types";

/* ── helpers ─────────────────────────────────────────────────── */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
}

function snapshotHistory(state: SudokuState): HistoryEntry {
  return {
    grid: cloneGrid(state.grid),
    mistakes: state.mistakes,
  };
}

/* ── puzzle generation ───────────────────────────────────────── */

function generateSolvedGrid(): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(g: number[][], row: number, col: number, num: number): boolean {
    for (let c = 0; c < 9; c++) if (g[row][c] === num) return false;
    for (let r = 0; r < 9; r++) if (g[r][col] === num) return false;
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
      for (let c = bc; c < bc + 3; c++)
        if (g[r][c] === num) return false;
    return true;
  }

  function solve(g: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === 0) {
          const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (isValid(g, r, c, num)) {
              g[r][c] = num;
              if (solve(g)) return true;
              g[r][c] = 0;
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

/* ── game creation ───────────────────────────────────────────── */

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
    hintsUsed: 0,
    history: [],
  };
}

/* ── cell selection ──────────────────────────────────────────── */

export function selectCell(state: SudokuState, row: number, col: number): SudokuState {
  return { ...state, selectedCell: [row, col] };
}

export function moveSelection(
  state: SudokuState,
  direction: "up" | "down" | "left" | "right"
): SudokuState {
  const [r, c] = state.selectedCell ?? [4, 4];
  let nr = r;
  let nc = c;
  switch (direction) {
    case "up":    nr = r > 0 ? r - 1 : 8; break;
    case "down":  nr = r < 8 ? r + 1 : 0; break;
    case "left":  nc = c > 0 ? c - 1 : 8; break;
    case "right": nc = c < 8 ? c + 1 : 0; break;
  }
  return { ...state, selectedCell: [nr, nc] };
}

/* ── number placement ────────────────────────────────────────── */

/**
 * When a correct number is placed, auto-remove that number from notes
 * in the same row, column, and 3x3 box.
 */
function removeRelatedNotes(grid: Grid, row: number, col: number, num: number): void {
  // Same row
  for (let c = 0; c < 9; c++) grid[row][c].notes.delete(num);
  // Same column
  for (let r = 0; r < 9; r++) grid[r][col].notes.delete(num);
  // Same 3x3 box
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      grid[r][c].notes.delete(num);
}

export function placeNumber(state: SudokuState, num: number): SudokuState {
  if (state.status !== "playing" || !state.selectedCell) return state;
  const [row, col] = state.selectedCell;
  const cell = state.grid[row][col];
  if (cell.given) return state;

  // Save history for undo
  const history = [...state.history, snapshotHistory(state)];

  const newGrid = cloneGrid(state.grid);
  const correct = state.solution[row][col] === num;

  newGrid[row][col] = {
    value: num,
    given: false,
    notes: new Set(),
    isError: !correct,
  };

  // Auto-remove notes from related cells when placing correct number
  if (correct) {
    removeRelatedNotes(newGrid, row, col, num);
  }

  const newMistakes = correct ? state.mistakes : state.mistakes + 1;

  // Check win
  let won = true;
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (newGrid[r][c].value !== state.solution[r][c]) won = false;

  // Check loss (3 mistakes)
  const lost = newMistakes >= state.maxMistakes;

  return {
    ...state,
    grid: newGrid,
    mistakes: newMistakes,
    status: won ? "won" : lost ? "lost" : "playing",
    history,
  };
}

/* ── erase ───────────────────────────────────────────────────── */

export function eraseCell(state: SudokuState): SudokuState {
  if (state.status !== "playing" || !state.selectedCell) return state;
  const [row, col] = state.selectedCell;
  const cell = state.grid[row][col];
  if (cell.given) return state;

  const history = [...state.history, snapshotHistory(state)];
  const newGrid = cloneGrid(state.grid);
  newGrid[row][col] = { value: 0, given: false, notes: new Set(), isError: false };

  return { ...state, grid: newGrid, history };
}

/* ── notes ───────────────────────────────────────────────────── */

export function toggleNote(state: SudokuState, num: number): SudokuState {
  if (state.status !== "playing" || !state.selectedCell) return state;
  const [row, col] = state.selectedCell;
  const cell = state.grid[row][col];
  if (cell.given || cell.value !== 0) return state;

  const history = [...state.history, snapshotHistory(state)];
  const newGrid = cloneGrid(state.grid);
  const notes = newGrid[row][col].notes;
  if (notes.has(num)) notes.delete(num);
  else notes.add(num);

  return { ...state, grid: newGrid, history };
}

/* ── undo ────────────────────────────────────────────────────── */

export function undo(state: SudokuState): SudokuState {
  if (state.history.length === 0) return state;
  const history = [...state.history];
  const prev = history.pop()!;
  return {
    ...state,
    grid: prev.grid,
    mistakes: prev.mistakes,
    status: "playing",
    history,
  };
}

/* ── hint ─────────────────────────────────────────────────────── */

export function useHint(state: SudokuState): SudokuState {
  if (state.status !== "playing") return state;

  // Find an empty or wrong cell to reveal
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = state.grid[r][c];
      if (!cell.given && (cell.value === 0 || cell.isError)) {
        emptyCells.push([r, c]);
      }
    }
  }

  if (emptyCells.length === 0) return state;

  // Prefer selected cell if it's empty/wrong, otherwise random
  let target: [number, number];
  if (
    state.selectedCell &&
    emptyCells.some(([r, c]) => r === state.selectedCell![0] && c === state.selectedCell![1])
  ) {
    target = state.selectedCell;
  } else {
    target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  const [row, col] = target;
  const history = [...state.history, snapshotHistory(state)];
  const newGrid = cloneGrid(state.grid);
  const correctVal = state.solution[row][col];

  newGrid[row][col] = {
    value: correctVal,
    given: false,
    notes: new Set(),
    isError: false,
  };

  removeRelatedNotes(newGrid, row, col, correctVal);

  // Check win
  let won = true;
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (newGrid[r][c].value !== state.solution[r][c]) won = false;

  return {
    ...state,
    grid: newGrid,
    hintsUsed: state.hintsUsed + 1,
    selectedCell: target,
    status: won ? "won" : "playing",
    history,
  };
}

/* ── utilities ───────────────────────────────────────────────── */

/** Count how many times each number (1-9) appears on the grid. */
export function getNumberCounts(grid: Grid): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let n = 1; n <= 9; n++) counts[n] = 0;
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c].value;
      if (v >= 1 && v <= 9) counts[v]++;
    }
  return counts;
}
