import type { Cell, MinesweeperState } from "./types";

export function createGame(
  width: number,
  height: number,
  mines: number
): MinesweeperState {
  const grid: Cell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      mine: false,
      adjacentMines: 0,
      state: "hidden" as const,
    }))
  );

  return {
    grid,
    width,
    height,
    mines,
    status: "idle",
    flagCount: 0,
    revealedCount: 0,
    firstClick: true,
  };
}

function placeMines(
  state: MinesweeperState,
  safeRow: number,
  safeCol: number
): MinesweeperState {
  const { grid, width, height, mines } = state;
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  while (placed < mines) {
    const r = Math.floor(Math.random() * height);
    const c = Math.floor(Math.random() * width);

    // Safe zone: 3x3 around first click
    if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
    if (newGrid[r][c].mine) continue;

    newGrid[r][c].mine = true;
    placed++;
  }

  // Calculate adjacent mines
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (newGrid[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < height && nc >= 0 && nc < width && newGrid[nr][nc].mine) {
            count++;
          }
        }
      }
      newGrid[r][c].adjacentMines = count;
    }
  }

  return { ...state, grid: newGrid };
}

export function revealCell(
  state: MinesweeperState,
  row: number,
  col: number
): MinesweeperState {
  if (state.status === "won" || state.status === "lost") return state;
  if (row < 0 || row >= state.height || col < 0 || col >= state.width) return state;

  let current = state;

  // First click: place mines
  if (current.firstClick) {
    current = placeMines(current, row, col);
    current = { ...current, firstClick: false, status: "playing" };
  }

  const cell = current.grid[row][col];
  if (cell.state !== "hidden") return current;

  const newGrid = current.grid.map((r) => r.map((c) => ({ ...c })));

  if (newGrid[row][col].mine) {
    // Reveal all mines
    for (let r = 0; r < current.height; r++) {
      for (let c = 0; c < current.width; c++) {
        if (newGrid[r][c].mine) newGrid[r][c].state = "revealed";
      }
    }
    return { ...current, grid: newGrid, status: "lost" };
  }

  // Flood fill reveal
  let revealed = current.revealedCount;
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= current.height || c < 0 || c >= current.width) continue;
    if (newGrid[r][c].state !== "hidden") continue;
    if (newGrid[r][c].mine) continue;

    newGrid[r][c].state = "revealed";
    revealed++;

    if (newGrid[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          stack.push([r + dr, c + dc]);
        }
      }
    }
  }

  const newState = { ...current, grid: newGrid, revealedCount: revealed };

  // Check win: all non-mine cells revealed
  const totalSafe = current.width * current.height - current.mines;
  if (revealed === totalSafe) {
    return { ...newState, status: "won" };
  }

  return newState;
}

export function toggleFlag(
  state: MinesweeperState,
  row: number,
  col: number
): MinesweeperState {
  if (state.status === "won" || state.status === "lost") return state;
  if (state.status === "idle") return state;

  const cell = state.grid[row][col];
  if (cell.state === "revealed") return state;

  const newGrid = state.grid.map((r) => r.map((c) => ({ ...c })));
  let flagCount = state.flagCount;

  if (newGrid[row][col].state === "hidden") {
    newGrid[row][col].state = "flagged";
    flagCount++;
  } else {
    newGrid[row][col].state = "hidden";
    flagCount--;
  }

  return { ...state, grid: newGrid, flagCount };
}
