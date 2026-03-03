import type { Direction, Game2048State, MoveResult, TileMove, MergedCell } from "./types";
import { GRID_SIZE } from "./types";

function emptyGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function addRandomTile(grid: number[][]): { grid: number[][]; r: number; c: number; value: number } | null {
  const empty: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return null;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map((row) => [...row]);
  const value = Math.random() < 0.9 ? 2 : 4;
  newGrid[r][c] = value;
  return { grid: newGrid, r, c, value };
}

export function createGame(): Game2048State {
  let grid = emptyGrid();
  const first = addRandomTile(grid);
  if (first) grid = first.grid;
  const second = addRandomTile(grid);
  if (second) grid = second.grid;
  return {
    grid,
    score: 0,
    bestTile: 0,
    status: "idle",
    won2048: false,
  };
}

interface SlideRowResult {
  newRow: number[];
  points: number;
  /** Movements: from original col → to new col */
  moves: { fromCol: number; toCol: number; value: number }[];
  /** Columns where merges happened + their new value */
  merges: { col: number; value: number }[];
}

function slideRow(row: number[]): SlideRowResult {
  // Collect non-zero tiles with their original positions
  const nonZero: { value: number; origCol: number }[] = [];
  for (let c = 0; c < GRID_SIZE; c++) {
    if (row[c] !== 0) nonZero.push({ value: row[c], origCol: c });
  }

  const moves: SlideRowResult["moves"] = [];
  const merges: SlideRowResult["merges"] = [];
  const newRow = Array(GRID_SIZE).fill(0);
  let points = 0;
  let writeCol = 0;
  let i = 0;

  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i].value === nonZero[i + 1].value) {
      // Merge
      const mergedVal = nonZero[i].value * 2;
      newRow[writeCol] = mergedVal;
      points += mergedVal;
      moves.push({ fromCol: nonZero[i].origCol, toCol: writeCol, value: nonZero[i].value });
      moves.push({ fromCol: nonZero[i + 1].origCol, toCol: writeCol, value: nonZero[i + 1].value });
      merges.push({ col: writeCol, value: mergedVal });
      writeCol++;
      i += 2;
    } else {
      newRow[writeCol] = nonZero[i].value;
      moves.push({ fromCol: nonZero[i].origCol, toCol: writeCol, value: nonZero[i].value });
      writeCol++;
      i++;
    }
  }

  return { newRow, points, moves, merges };
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

/** Un-rotate a (row, col) position from the rotated coordinate system back to original */
function unrotate(r: number, c: number, rot: number): { r: number; c: number } {
  const N = GRID_SIZE - 1;
  switch (rot) {
    case 0: return { r, c };
    case 1: return { r: N - c, c: r };
    case 2: return { r: N - r, c: N - c };
    case 3: return { r: c, c: N - r };
    default: return { r, c };
  }
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

export function move(state: Game2048State, direction: Direction): MoveResult {
  if (state.status === "lost") {
    return { state, moved: false, tileMoves: [], mergedCells: [], spawnedTile: null };
  }

  const rotations: Record<Direction, number> = {
    left: 0,
    down: 1,
    right: 2,
    up: 3,
  };

  const rot = rotations[direction];
  const rotatedGrid = rotateGrid(state.grid, rot);

  let totalPoints = 0;
  let moved = false;
  const tileMoves: TileMove[] = [];
  const mergedCells: MergedCell[] = [];

  const newRotatedGrid = rotatedGrid.map((row, rowIdx) => {
    const { newRow, points, moves, merges } = slideRow(row);
    if (row.some((v, i) => v !== newRow[i])) moved = true;
    totalPoints += points;

    // Convert row-level movements to grid coordinates, then un-rotate
    for (const m of moves) {
      const from = unrotate(rowIdx, m.fromCol, rot);
      const to = unrotate(rowIdx, m.toCol, rot);
      tileMoves.push({
        value: m.value,
        fromR: from.r,
        fromC: from.c,
        toR: to.r,
        toC: to.c,
      });
    }

    for (const mg of merges) {
      const pos = unrotate(rowIdx, mg.col, rot);
      mergedCells.push({ r: pos.r, c: pos.c, value: mg.value });
    }

    return newRow;
  });

  if (!moved) {
    return { state, moved: false, tileMoves: [], mergedCells: [], spawnedTile: null };
  }

  const grid = rotateGrid(newRotatedGrid, (4 - rot) % 4);
  const spawnResult = addRandomTile(grid);
  const finalGrid = spawnResult ? spawnResult.grid : grid;

  const newScore = state.score + totalPoints;
  let bestTile = state.bestTile;
  for (const row of finalGrid) {
    for (const val of row) {
      if (val > bestTile) bestTile = val;
    }
  }

  const newState: Game2048State = {
    grid: finalGrid,
    score: newScore,
    bestTile,
    status: "playing",
    won2048: state.won2048 || bestTile >= 2048,
  };

  if (!canMove(newState)) {
    newState.status = "lost";
  }

  return {
    state: newState,
    moved: true,
    tileMoves,
    mergedCells,
    spawnedTile: spawnResult ? { r: spawnResult.r, c: spawnResult.c, value: spawnResult.value } : null,
  };
}
