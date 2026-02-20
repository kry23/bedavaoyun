import type { Grid, PuzzleState } from "./types";

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++;
    }
  }
  // For 4x4: solvable if inversions + row of blank (from bottom) is even
  const blankRow = 3; // blank is placed at bottom-right initially
  return (inversions + blankRow) % 2 === 0;
}

export function createGame(): PuzzleState {
  let tiles: number[];
  do {
    tiles = Array.from({ length: 15 }, (_, i) => i + 1);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles));

  const grid: Grid = [];
  let idx = 0;
  const emptyPos = { r: 3, c: 3 };
  for (let r = 0; r < 4; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < 4; c++) {
      if (r === 3 && c === 3) {
        row.push(null);
      } else {
        row.push(tiles[idx++]);
      }
    }
    grid.push(row);
  }

  return { grid, moves: 0, status: "playing", emptyPos };
}

function isWon(grid: Grid): boolean {
  let expected = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (r === 3 && c === 3) return grid[r][c] === null;
      if (grid[r][c] !== expected) return false;
      expected++;
    }
  }
  return true;
}

export function moveTile(state: PuzzleState, r: number, c: number): PuzzleState {
  if (state.status !== "playing") return state;
  const { emptyPos } = state;
  const dr = Math.abs(r - emptyPos.r);
  const dc = Math.abs(c - emptyPos.c);

  // Only adjacent tiles (not diagonal)
  if (!((dr === 1 && dc === 0) || (dr === 0 && dc === 1))) return state;

  const newGrid = state.grid.map((row) => [...row]);
  newGrid[emptyPos.r][emptyPos.c] = newGrid[r][c];
  newGrid[r][c] = null;

  const won = isWon(newGrid);

  return {
    grid: newGrid,
    moves: state.moves + 1,
    status: won ? "won" : "playing",
    emptyPos: { r, c },
  };
}

export function moveDirection(state: PuzzleState, dir: "up" | "down" | "left" | "right"): PuzzleState {
  const { emptyPos } = state;
  // Move the tile opposite to the direction into the empty space
  const offsets = { up: [1, 0], down: [-1, 0], left: [0, 1], right: [0, -1] };
  const [dr, dc] = offsets[dir];
  const tr = emptyPos.r + dr;
  const tc = emptyPos.c + dc;
  if (tr < 0 || tr > 3 || tc < 0 || tc > 3) return state;
  return moveTile(state, tr, tc);
}
