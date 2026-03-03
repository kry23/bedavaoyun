import type { Game2048State, TileMove, MergedCell, SpawnedTile } from "./types";
import { GRID_SIZE, TILE_COLORS, TILE_COLORS_DARK } from "./types";

const PADDING = 10;
const TILE_RADIUS = 8;

/** Ease-out cubic for smooth deceleration */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Get tile pixel position (top-left corner) */
function tilePos(
  row: number,
  col: number,
  tileSize: number
): { x: number; y: number } {
  return {
    x: PADDING + col * (tileSize + PADDING),
    y: PADDING + row * (tileSize + PADDING),
  };
}

/** Draw a single rounded tile */
function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  value: number,
  isDark: boolean,
  scale: number = 1
) {
  const colors = isDark ? TILE_COLORS_DARK : TILE_COLORS;
  const tileColor = colors[value] || { bg: isDark ? "#6B5B4F" : "#3C3A32", text: "#F9F6F2" };

  ctx.save();

  if (scale !== 1) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
  }

  // Tile shadow
  ctx.shadowColor = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;

  // Tile background
  ctx.fillStyle = tileColor.bg;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, TILE_RADIUS);
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Number text
  if (value > 0) {
    ctx.fillStyle = tileColor.text;

    let fontSize = size * 0.42;
    if (value >= 100) fontSize = size * 0.34;
    if (value >= 1000) fontSize = size * 0.28;

    ctx.font = `bold ${fontSize}px "Clear Sans", "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value.toString(), x + size / 2, y + size / 2 + 1);
  }

  ctx.restore();
}

/** Render the static board (background + empty cells) */
function drawBoard(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  tileSize: number,
  isDark: boolean
) {
  // Board background with rounded corners
  ctx.fillStyle = isDark ? "#1A2332" : "#BBADA0";
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasSize, canvasSize, 12);
  ctx.fill();

  // Empty cell slots
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const { x, y } = tilePos(r, c, tileSize);
      ctx.fillStyle = isDark ? "#2A3444" : "#CDC1B4";
      ctx.beginPath();
      ctx.roundRect(x, y, tileSize, tileSize, TILE_RADIUS);
      ctx.fill();
    }
  }
}

/** Render the game without animation (static frame) */
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: Game2048State,
  canvasSize: number,
  isDark: boolean
): void {
  const totalPadding = PADDING * (GRID_SIZE + 1);
  const tileSize = (canvasSize - totalPadding) / GRID_SIZE;

  drawBoard(ctx, canvasSize, tileSize, isDark);

  // Draw all tiles
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const val = state.grid[r][c];
      if (val === 0) continue;
      const { x, y } = tilePos(r, c, tileSize);
      drawTile(ctx, x, y, tileSize, val, isDark);
    }
  }
}

/**
 * Render an animated frame during a move transition.
 * @param progress 0..1 — how far through the slide animation
 * @param prevGrid grid state BEFORE the move
 * @param nextState grid state AFTER the move
 * @param tileMoves movement data from engine
 * @param mergedCells merge data from engine
 * @param spawnedTile new tile data from engine
 */
export function renderAnimatedFrame(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  isDark: boolean,
  progress: number,
  prevGrid: number[][],
  nextState: Game2048State,
  tileMoves: TileMove[],
  mergedCells: MergedCell[],
  spawnedTile: SpawnedTile | null
): void {
  const totalPadding = PADDING * (GRID_SIZE + 1);
  const tileSize = (canvasSize - totalPadding) / GRID_SIZE;

  drawBoard(ctx, canvasSize, tileSize, isDark);

  const slideProgress = Math.min(1, progress / 0.6); // Slide finishes at 60% of total
  const slideEased = easeOut(slideProgress);

  const popStart = 0.5; // Pop starts at 50%
  const popProgress = progress > popStart ? Math.min(1, (progress - popStart) / 0.5) : 0;

  // Phase 1: Draw sliding tiles
  // Skip tiles at merge destinations (they'll be drawn as merges)
  const mergeDestSet = new Set(mergedCells.map((m) => `${m.r},${m.c}`));

  for (const tm of tileMoves) {
    const fromPos = tilePos(tm.fromR, tm.fromC, tileSize);
    const toPos = tilePos(tm.toR, tm.toC, tileSize);

    const x = fromPos.x + (toPos.x - fromPos.x) * slideEased;
    const y = fromPos.y + (toPos.y - fromPos.y) * slideEased;

    drawTile(ctx, x, y, tileSize, tm.value, isDark);
  }

  // Phase 2: Draw merged tiles (pop effect after slide completes)
  if (slideProgress >= 1) {
    for (const mc of mergedCells) {
      const { x, y } = tilePos(mc.r, mc.c, tileSize);
      // Pop: scale from 1 → 1.15 → 1
      const popEased = easeOut(popProgress);
      const scale = popProgress < 0.5
        ? 1 + 0.15 * (popEased * 2)
        : 1 + 0.15 * (1 - (popEased - 0.5) * 2);
      drawTile(ctx, x, y, tileSize, mc.value, isDark, Math.max(1, scale));
    }
  }

  // Phase 3: Draw spawned tile (appear after slide)
  if (spawnedTile && slideProgress >= 1) {
    const { x, y } = tilePos(spawnedTile.r, spawnedTile.c, tileSize);
    // Scale from 0 to 1
    const spawnScale = easeOut(popProgress);
    if (spawnScale > 0.01) {
      drawTile(ctx, x, y, tileSize, spawnedTile.value, isDark, spawnScale);
    }
  }

  // Draw non-moving tiles from the final state that aren't part of any animation
  // These are tiles that existed and didn't move
  const animatedDestinations = new Set(tileMoves.map((m) => `${m.toR},${m.toC}`));
  if (spawnedTile) animatedDestinations.add(`${spawnedTile.r},${spawnedTile.c}`);

  // Only draw static tiles from the final grid that aren't covered by animations
  if (slideProgress >= 1) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = nextState.grid[r][c];
        if (val === 0) continue;
        const key = `${r},${c}`;
        if (animatedDestinations.has(key)) continue; // already drawn by animation
        const { x, y } = tilePos(r, c, tileSize);
        drawTile(ctx, x, y, tileSize, val, isDark);
      }
    }
  }
}
