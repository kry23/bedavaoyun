import type { Game2048State } from "./types";
import { GRID_SIZE, TILE_COLORS } from "./types";

const PADDING = 8;
const TILE_RADIUS = 6;

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: Game2048State,
  canvasSize: number,
  isDark: boolean
): void {
  const totalPadding = PADDING * (GRID_SIZE + 1);
  const tileSize = (canvasSize - totalPadding) / GRID_SIZE;

  // Background
  ctx.fillStyle = isDark ? "#1E293B" : "#BBADA0";
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasSize, canvasSize, 12);
  ctx.fill();

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const val = state.grid[r][c];
      const x = PADDING + c * (tileSize + PADDING);
      const y = PADDING + r * (tileSize + PADDING);

      // Tile background
      if (val === 0) {
        ctx.fillStyle = isDark ? "#334155" : "#CDC1B4";
      } else {
        const colors = TILE_COLORS[val] || {
          bg: "#3C3A32",
          text: "#F9F6F2",
        };
        ctx.fillStyle = colors.bg;
      }

      ctx.beginPath();
      ctx.roundRect(x, y, tileSize, tileSize, TILE_RADIUS);
      ctx.fill();

      // Number
      if (val > 0) {
        const colors = TILE_COLORS[val] || {
          bg: "#3C3A32",
          text: "#F9F6F2",
        };
        ctx.fillStyle = colors.text;

        let fontSize = tileSize * 0.4;
        if (val >= 100) fontSize = tileSize * 0.33;
        if (val >= 1000) fontSize = tileSize * 0.28;

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(val.toString(), x + tileSize / 2, y + tileSize / 2);
      }
    }
  }
}
