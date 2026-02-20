import type { MinesweeperState } from "./types";

const NUMBER_COLORS = [
  "",
  "#2563EB", // 1 blue
  "#16A34A", // 2 green
  "#DC2626", // 3 red
  "#7C3AED", // 4 purple
  "#B91C1C", // 5 dark red
  "#0891B2", // 6 teal
  "#171717", // 7 black
  "#6B7280", // 8 gray
];

export function getCellSize(
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
): number {
  return Math.floor(Math.min(canvasWidth / gridWidth, canvasHeight / gridHeight));
}

export function getCellFromClick(
  x: number,
  y: number,
  cellSize: number
): { row: number; col: number } {
  return {
    col: Math.floor(x / cellSize),
    row: Math.floor(y / cellSize),
  };
}

export function renderBoard(
  ctx: CanvasRenderingContext2D,
  state: MinesweeperState,
  cellSize: number,
  isDark: boolean
): void {
  const { grid, width, height } = state;

  const colors = isDark
    ? {
        hidden: "#334155",
        hiddenBorder: "#475569",
        revealed: "#1E293B",
        revealedBorder: "#334155",
        flag: "#F59E0B",
        mine: "#EF4444",
        text: "#E2E8F0",
      }
    : {
        hidden: "#CBD5E1",
        hiddenBorder: "#94A3B8",
        revealed: "#F1F5F9",
        revealedBorder: "#E2E8F0",
        flag: "#F59E0B",
        mine: "#EF4444",
        text: "#1E293B",
      };

  ctx.clearRect(0, 0, width * cellSize, height * cellSize);

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = grid[r][c];
      const x = c * cellSize;
      const y = r * cellSize;

      // Cell background
      if (cell.state === "revealed") {
        ctx.fillStyle = colors.revealed;
      } else {
        ctx.fillStyle = colors.hidden;
      }
      ctx.fillRect(x, y, cellSize, cellSize);

      // Border
      ctx.strokeStyle =
        cell.state === "revealed" ? colors.revealedBorder : colors.hiddenBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);

      // Content
      const cx = x + cellSize / 2;
      const cy = y + cellSize / 2;

      if (cell.state === "flagged") {
        ctx.font = `${cellSize * 0.5}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🚩", cx, cy);
      } else if (cell.state === "revealed") {
        if (cell.mine) {
          ctx.font = `${cellSize * 0.5}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💣", cx, cy);
        } else if (cell.adjacentMines > 0) {
          ctx.font = `bold ${cellSize * 0.5}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = NUMBER_COLORS[cell.adjacentMines] || colors.text;
          ctx.fillText(cell.adjacentMines.toString(), cx, cy);
        }
      }
    }
  }
}
