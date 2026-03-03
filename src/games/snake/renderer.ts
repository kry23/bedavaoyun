import type { SnakeState, Direction, Point } from "./types";

/* ── Color themes ── */
interface SnakeTheme {
  boardLight: string;
  boardDark: string;
  border: string;
  snakeBody: string;
  snakeHead: string;
  eyeWhite: string;
  eyePupil: string;
  appleBody: string;
  appleHighlight: string;
  appleStem: string;
  appleLeaf: string;
}

const LIGHT_THEME: SnakeTheme = {
  boardLight: "#7ECE2A",
  boardDark: "#71C41E",
  border: "#4AA016",
  snakeBody: "#4674E9",
  snakeHead: "#4674E9",
  eyeWhite: "#FFFFFF",
  eyePupil: "#1A1A2E",
  appleBody: "#E53935",
  appleHighlight: "#EF5350",
  appleStem: "#5D4037",
  appleLeaf: "#43A047",
};

const DARK_THEME: SnakeTheme = {
  boardLight: "#3D6B1A",
  boardDark: "#356014",
  border: "#2B4E10",
  snakeBody: "#5A8AF2",
  snakeHead: "#5A8AF2",
  eyeWhite: "#FFFFFF",
  eyePupil: "#1A1A2E",
  appleBody: "#D32F2F",
  appleHighlight: "#E53935",
  appleStem: "#4E342E",
  appleLeaf: "#2E7D32",
};

/** Lerp between two values */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Get pixel center of a grid cell */
function cellCenter(
  p: Point,
  cellSize: number,
  offsetX: number,
  offsetY: number
): { cx: number; cy: number } {
  return {
    cx: offsetX + p.x * cellSize + cellSize / 2,
    cy: offsetY + p.y * cellSize + cellSize / 2,
  };
}

/** Draw the checkerboard background */
function drawBoard(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  gridSize: number,
  cellSize: number,
  offsetX: number,
  offsetY: number,
  theme: SnakeTheme
) {
  // Border background (fills entire canvas)
  ctx.fillStyle = theme.border;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Checkerboard
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? theme.boardLight : theme.boardDark;
      ctx.fillRect(
        offsetX + c * cellSize,
        offsetY + r * cellSize,
        cellSize,
        cellSize
      );
    }
  }
}

/** Draw the apple (food) with stem and leaf */
function drawApple(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  theme: SnakeTheme,
  pulse: number // 0..1 for subtle pulsing
) {
  const r = radius * (1 + pulse * 0.06);

  ctx.save();

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;

  // Apple body
  ctx.fillStyle = theme.appleBody;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "transparent";

  // Highlight
  ctx.fillStyle = theme.appleHighlight;
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = theme.appleStem;
  ctx.lineWidth = Math.max(1.5, r * 0.12);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.8);
  ctx.lineTo(cx + r * 0.1, cy - r * 1.3);
  ctx.stroke();

  // Leaf
  ctx.fillStyle = theme.appleLeaf;
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.35, cy - r * 1.15, r * 0.35, r * 0.18, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Draw a snake segment (circle) */
function drawSegment(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Draw the snake head with eyes */
function drawHead(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  direction: Direction,
  theme: SnakeTheme
) {
  // Head body
  ctx.fillStyle = theme.snakeHead;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Eye positions based on direction
  const eyeOffset = radius * 0.35;
  const eyeRadius = radius * 0.22;
  const pupilRadius = radius * 0.13;

  let eye1x: number, eye1y: number, eye2x: number, eye2y: number;
  let pupilDx = 0, pupilDy = 0;

  switch (direction) {
    case "right":
      eye1x = cx + eyeOffset * 0.5;
      eye1y = cy - eyeOffset;
      eye2x = cx + eyeOffset * 0.5;
      eye2y = cy + eyeOffset;
      pupilDx = pupilRadius * 0.4;
      break;
    case "left":
      eye1x = cx - eyeOffset * 0.5;
      eye1y = cy - eyeOffset;
      eye2x = cx - eyeOffset * 0.5;
      eye2y = cy + eyeOffset;
      pupilDx = -pupilRadius * 0.4;
      break;
    case "up":
      eye1x = cx - eyeOffset;
      eye1y = cy - eyeOffset * 0.5;
      eye2x = cx + eyeOffset;
      eye2y = cy - eyeOffset * 0.5;
      pupilDy = -pupilRadius * 0.4;
      break;
    case "down":
      eye1x = cx - eyeOffset;
      eye1y = cy + eyeOffset * 0.5;
      eye2x = cx + eyeOffset;
      eye2y = cy + eyeOffset * 0.5;
      pupilDy = pupilRadius * 0.4;
      break;
  }

  // Eye whites
  ctx.fillStyle = theme.eyeWhite;
  ctx.beginPath();
  ctx.arc(eye1x, eye1y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eye2x, eye2y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = theme.eyePupil;
  ctx.beginPath();
  ctx.arc(eye1x + pupilDx, eye1y + pupilDy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eye2x + pupilDx, eye2y + pupilDy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
}

/** Interpolate snake positions between prev and current */
function getInterpolatedPositions(
  current: Point[],
  prev: Point[],
  t: number // 0..1
): Point[] {
  return current.map((cur, i) => {
    if (i >= prev.length) {
      // New segment (just grown) — appear at current position
      return cur;
    }
    const p = prev[i];
    return {
      x: lerp(p.x, cur.x, t),
      y: lerp(p.y, cur.y, t),
    };
  });
}

/**
 * Render the game with interpolation support.
 * @param t interpolation progress 0..1 (0 = previous tick, 1 = current tick)
 * @param animTime global animation time in ms (for food pulse etc.)
 */
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: SnakeState,
  canvasW: number,
  canvasH: number,
  isDark: boolean,
  t: number = 1,
  animTime: number = 0
): void {
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const { gridSize, snake, prevSnake, food, direction } = state;

  // Calculate cell size to fit in canvas with border padding
  const borderPad = 4;
  const availW = canvasW - borderPad * 2;
  const availH = canvasH - borderPad * 2;
  const cellSize = Math.floor(Math.min(availW / gridSize, availH / gridSize));
  const boardW = cellSize * gridSize;
  const boardH = cellSize * gridSize;
  const offsetX = Math.floor((canvasW - boardW) / 2);
  const offsetY = Math.floor((canvasH - boardH) / 2);

  // Draw board
  drawBoard(ctx, canvasW, canvasH, gridSize, cellSize, offsetX, offsetY, theme);

  // Get interpolated positions
  const positions = getInterpolatedPositions(snake, prevSnake, t);
  const segRadius = cellSize * 0.45;

  // Draw body segments (back to front, skip head)
  for (let i = positions.length - 1; i >= 1; i--) {
    const pos = positions[i];
    const { cx, cy } = cellCenter(
      pos,
      cellSize,
      offsetX,
      offsetY
    );

    // Slight color variation along body
    const bodyAlpha = 1 - (i / (positions.length + 5)) * 0.2;
    ctx.globalAlpha = bodyAlpha;
    drawSegment(ctx, cx, cy, segRadius, theme.snakeBody);
    ctx.globalAlpha = 1;

    // Draw connector between this segment and the next one toward head
    if (i > 0) {
      const nextPos = positions[i - 1];
      const next = cellCenter(nextPos, cellSize, offsetX, offsetY);
      // Draw a thick line between consecutive segments for smooth look
      ctx.strokeStyle = theme.snakeBody;
      ctx.lineWidth = segRadius * 2 * bodyAlpha;
      ctx.lineCap = "round";
      ctx.globalAlpha = bodyAlpha;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(next.cx, next.cy);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // Draw head
  const headPos = positions[0];
  const { cx: hx, cy: hy } = cellCenter(headPos, cellSize, offsetX, offsetY);
  drawHead(ctx, hx, hy, segRadius, direction, theme);

  // Draw food (apple)
  const { cx: fx, cy: fy } = cellCenter(food, cellSize, offsetX, offsetY);
  const pulse = Math.sin(animTime * 0.004) * 0.5 + 0.5; // 0..1 pulsing
  drawApple(ctx, fx, fy, cellSize * 0.4, theme, pulse);
}
