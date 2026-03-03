import type { MinesweeperState } from "./types";

/* ── Classic Minesweeper number colors ── */
const NUMBER_COLORS_LIGHT: Record<number, string> = {
  1: "#0000FF", // blue
  2: "#008000", // green
  3: "#FF0000", // red
  4: "#000080", // dark blue / purple
  5: "#800000", // maroon
  6: "#008080", // teal
  7: "#000000", // black
  8: "#808080", // gray
};

const NUMBER_COLORS_DARK: Record<number, string> = {
  1: "#6E9EFF", // bright blue
  2: "#50D050", // bright green
  3: "#FF5555", // bright red
  4: "#CC80FF", // purple
  5: "#FF7070", // light maroon
  6: "#50E0E0", // bright teal
  7: "#E0E0E0", // light gray
  8: "#A0A0A0", // mid gray
};

/* ── Board frame thickness ── */
const FRAME_WIDTH = 3;

export function getCellSize(
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
): number {
  const availW = canvasWidth - FRAME_WIDTH * 2;
  const availH = canvasHeight - FRAME_WIDTH * 2;
  return Math.floor(Math.min(availW / gridWidth, availH / gridHeight));
}

export function getCellFromClick(
  x: number,
  y: number,
  cellSize: number
): { row: number; col: number } {
  return {
    col: Math.floor((x - FRAME_WIDTH) / cellSize),
    row: Math.floor((y - FRAME_WIDTH) / cellSize),
  };
}

/** Get total canvas size needed for the board */
export function getBoardPixelSize(
  gridWidth: number,
  gridHeight: number,
  cellSize: number
): { w: number; h: number } {
  return {
    w: gridWidth * cellSize + FRAME_WIDTH * 2,
    h: gridHeight * cellSize + FRAME_WIDTH * 2,
  };
}

/* ── 3D bevel drawing ── */

/** Draw a classic raised 3D bevel (Windows 95 style) */
function drawRaised(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  face: string,
  highlightOuter: string,
  highlightInner: string,
  shadowInner: string,
  shadowOuter: string,
  bw: number
) {
  // Fill face
  ctx.fillStyle = face;
  ctx.fillRect(x, y, size, size);

  if (bw < 1) return;

  const half = Math.max(1, Math.floor(bw / 2));

  // Outer highlight (top + left) — brightest
  ctx.fillStyle = highlightOuter;
  // Top edge
  ctx.fillRect(x, y, size, half);
  // Left edge
  ctx.fillRect(x, y, half, size);

  // Inner highlight
  ctx.fillStyle = highlightInner;
  ctx.fillRect(x + half, y + half, size - half - half, half);
  ctx.fillRect(x + half, y + half, half, size - half - half);

  // Outer shadow (bottom + right) — darkest
  ctx.fillStyle = shadowOuter;
  // Bottom edge
  ctx.fillRect(x, y + size - half, size, half);
  // Right edge
  ctx.fillRect(x + size - half, y, half, size);

  // Inner shadow
  ctx.fillStyle = shadowInner;
  ctx.fillRect(x + half, y + size - bw, size - bw, half);
  ctx.fillRect(x + size - bw, y + half, half, size - bw);
}

/** Draw a sunken 3D frame (for the board border) */
function drawSunkenFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bw: number,
  shadowColor: string,
  highlightColor: string
) {
  // Top + left = shadow (sunken means shadow on the outside top/left)
  ctx.fillStyle = shadowColor;
  ctx.fillRect(x, y, w, bw);
  ctx.fillRect(x, y, bw, h);

  // Bottom + right = highlight
  ctx.fillStyle = highlightColor;
  ctx.fillRect(x, y + h - bw, w, bw);
  ctx.fillRect(x + w - bw, y, bw, h);
}

export function renderBoard(
  ctx: CanvasRenderingContext2D,
  state: MinesweeperState,
  cellSize: number,
  isDark: boolean,
  hoverCell?: { row: number; col: number } | null,
  pressedCell?: { row: number; col: number } | null
): void {
  const { grid, width, height } = state;

  // Bevel width scales with cell size, clamped for classic feel
  const bw = Math.max(2, Math.min(4, Math.floor(cellSize * 0.12)));

  const colors = isDark
    ? {
        // minesweeper.online dark theme inspired
        frameBg: "#3A3F4B",
        frameShadow: "#1A1E28",
        frameHighlight: "#5A6070",
        face: "#505868",
        highlightOuter: "#727E90",
        highlightInner: "#606C7C",
        shadowInner: "#3A404C",
        shadowOuter: "#262C36",
        hoverFace: "#5C6678",
        revealed: "#2C3240",
        revealedGrid: "#384050",
        mineBg: "#6B2020",
        numColors: NUMBER_COLORS_DARK,
      }
    : {
        // Classic Windows minesweeper light theme
        frameBg: "#C0C0C0",
        frameShadow: "#808080",
        frameHighlight: "#FFFFFF",
        face: "#C0C0C0",
        highlightOuter: "#FFFFFF",
        highlightInner: "#E0E0E0",
        shadowInner: "#808080",
        shadowOuter: "#404040",
        hoverFace: "#D0D0D0",
        revealed: "#C0C0C0",
        revealedGrid: "#808080",
        mineBg: "#FF0000",
        numColors: NUMBER_COLORS_LIGHT,
      };

  const fw = FRAME_WIDTH;
  const boardW = width * cellSize;
  const boardH = height * cellSize;
  const totalW = boardW + fw * 2;
  const totalH = boardH + fw * 2;

  // Clear & fill background
  ctx.fillStyle = colors.frameBg;
  ctx.fillRect(0, 0, totalW, totalH);

  // Draw sunken frame around the board
  drawSunkenFrame(ctx, 0, 0, totalW, totalH, fw, colors.frameShadow, colors.frameHighlight);

  // Offset for cells inside the frame
  const ox = fw;
  const oy = fw;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = grid[r][c];
      const x = ox + c * cellSize;
      const y = oy + r * cellSize;

      const isHover = hoverCell?.row === r && hoverCell?.col === c;
      const isPressed = pressedCell?.row === r && pressedCell?.col === c;

      if (cell.state === "hidden" || cell.state === "flagged") {
        if (isPressed && cell.state === "hidden") {
          // Pressed — flat/sunken like a revealed cell
          ctx.fillStyle = colors.revealed;
          ctx.fillRect(x, y, cellSize, cellSize);
          // Thin grid lines
          ctx.strokeStyle = colors.revealedGrid;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
        } else {
          // Raised 3D button — classic minesweeper look
          const face = isHover ? colors.hoverFace : colors.face;
          drawRaised(
            ctx, x, y, cellSize,
            face,
            colors.highlightOuter, colors.highlightInner,
            colors.shadowInner, colors.shadowOuter,
            bw
          );
        }

        // Flag icon on top of raised cell
        if (cell.state === "flagged") {
          drawFlag(ctx, x, y, cellSize, isDark);
        }
      } else {
        // Revealed cell — flat with grid
        ctx.fillStyle = colors.revealed;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Grid lines (thin inset border)
        ctx.strokeStyle = colors.revealedGrid;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);

        if (cell.mine) {
          // Red background for the mine that was clicked
          if (state.status === "lost") {
            ctx.fillStyle = colors.mineBg;
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          }
          drawMine(ctx, x, y, cellSize, isDark);
        } else if (cell.adjacentMines > 0) {
          const fontSize = Math.floor(cellSize * 0.6);
          ctx.font = `bold ${fontSize}px "Segoe UI", "Arial Black", system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = colors.numColors[cell.adjacentMines] || (isDark ? "#E0E0E0" : "#000000");
          ctx.fillText(
            cell.adjacentMines.toString(),
            x + cellSize / 2,
            y + cellSize / 2 + 1
          );
        }
      }
    }
  }
}

/** Draw a flag icon using canvas shapes */
function drawFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isDark: boolean
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size * 0.55;

  // Pole
  const poleColor = isDark ? "#D0D0D0" : "#000000";
  ctx.strokeStyle = poleColor;
  ctx.lineWidth = Math.max(1.5, size * 0.05);
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 0.45);
  ctx.lineTo(cx, cy + s * 0.4);
  ctx.stroke();

  // Flag triangle (red)
  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 0.45);
  ctx.lineTo(cx - s * 0.4, cy - s * 0.15);
  ctx.lineTo(cx, cy + s * 0.05);
  ctx.closePath();
  ctx.fill();

  // Base
  ctx.fillStyle = poleColor;
  const baseW = s * 0.5;
  const baseH = Math.max(2, size * 0.06);
  ctx.fillRect(cx - baseW / 2, cy + s * 0.35, baseW, baseH);
  ctx.fillRect(cx - baseW * 0.35, cy + s * 0.28, baseW * 0.7, baseH);
}

/** Draw a mine icon using canvas shapes */
function drawMine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isDark: boolean
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size * 0.2;
  const mineColor = isDark ? "#E0E0E0" : "#000000";

  // Spikes (8 directions)
  ctx.strokeStyle = mineColor;
  ctx.lineWidth = Math.max(1.5, size * 0.06);
  ctx.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(angle) * radius * 0.5,
      cy + Math.sin(angle) * radius * 0.5
    );
    ctx.lineTo(
      cx + Math.cos(angle) * radius * 1.6,
      cy + Math.sin(angle) * radius * 1.6
    );
    ctx.stroke();
  }
  ctx.lineCap = "butt";

  // Body circle
  ctx.fillStyle = mineColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Shine highlight
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
}
