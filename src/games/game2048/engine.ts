import type { Direction, Game2048State } from "./types";
import { GRID_SIZE } from "./types";

function emptyGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function addRandomTile(grid: number[][]): number[][] {
  const empty: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return grid;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map((row) => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

export function createGame(): Game2048State {
  let grid = emptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return {
    grid,
    score: 0,
    bestTile: 0,
    status: "idle",
    won2048: false,
  };
}

function slideRow(row: number[]): { newRow: number[]; points: number } {
  // Remove zeros
  const filtered = row.filter((v) => v !== 0);
  let points = 0;
  const merged: number[] = [];

  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      points += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }

  // Pad with zeros
  while (merged.length < GRID_SIZE) merged.push(0);
  return { newRow: merged, points };
}

function rotateGrid(grid: number[][], times: number): number[][] {
  let result = grid.map((row) => [...row]);
  for (let t = 0; t < times; t++) {
    const rotated = emptyGrid();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        rotated[c][GRID_SIZE - 1 - r] = result[r][c];
      }
    }
    result = rotated;
  }
  return result;
}

export function canMove(state: Game2048State): boolean {
  const { grid } = state;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < GRID_SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < GRID_SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function move(state: Game2048State, direction: Direction): Game2048State {
  if (state.status === "lost") return state;

  const rotations: Record<Direction, number> = {
    left: 0,
    down: 1,
    right: 2,
    up: 3,
  };

  const rot = rotations[direction];
  let grid = rotateGrid(state.grid, rot);

  let totalPoints = 0;
  let moved = false;

  const newGrid = grid.map((row) => {
    const { newRow, points } = slideRow(row);
    if (row.some((v, i) => v !== newRow[i])) moved = true;
    totalPoints += points;
    return newRow;
  });

  if (!moved) return state;

  grid = rotateGrid(newGrid, (4 - rot) % 4);
  const gridWithNew = addRandomTile(grid);

  const newScore = state.score + totalPoints;
  let bestTile = state.bestTile;
  for (const row of gridWithNew) {
    for (const val of row) {
      if (val > bestTile) bestTile = val;
    }
  }

  const newState: Game2048State = {
    grid: gridWithNew,
    score: newScore,
    bestTile,
    status: "playing",
    won2048: state.won2048 || bestTile >= 2048,
  };

  if (!canMove(newState)) {
    return { ...newState, status: "lost" };
  }

  return newState;
}
