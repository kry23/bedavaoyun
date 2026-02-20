import type { SnakeState } from "./types";

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: SnakeState,
  cellSize: number,
  isDark: boolean
): void {
  const { gridSize, snake, food } = state;
  const w = gridSize * cellSize;
  const h = gridSize * cellSize;

  // Background
  ctx.fillStyle = isDark ? "#0F172A" : "#F8FAFC";
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = isDark ? "#1E293B" : "#E2E8F0";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(w, i * cellSize);
    ctx.stroke();
  }

  // Food
  ctx.fillStyle = "#EF4444";
  const fx = food.x * cellSize + cellSize / 2;
  const fy = food.y * cellSize + cellSize / 2;
  ctx.beginPath();
  ctx.arc(fx, fy, cellSize * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Snake
  snake.forEach((segment, i) => {
    const x = segment.x * cellSize;
    const y = segment.y * cellSize;
    const padding = 1;

    if (i === 0) {
      // Head
      ctx.fillStyle = "#16A34A";
    } else {
      ctx.fillStyle = "#22C55E";
    }

    ctx.beginPath();
    ctx.roundRect(
      x + padding,
      y + padding,
      cellSize - padding * 2,
      cellSize - padding * 2,
      cellSize * 0.2
    );
    ctx.fill();
  });
}
