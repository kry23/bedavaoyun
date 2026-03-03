import type { Layout, LayoutPosition } from "./types";

/**
 * Positions use half-unit grid coordinates.
 * Each tile occupies a 2×2 area (col..col+1, row..row+1).
 * Upper layers are offset by 0.5 in col and row for the pyramid effect.
 *
 * Classic Turtle layout: 144 positions across 5 layers.
 */

function p(col: number, row: number, layer: number): LayoutPosition {
  return { col, row, layer };
}

/* ── Turtle (Classic) ─────────────────────────────────────── */

const turtlePositions: LayoutPosition[] = [
  // Layer 0 (bottom) — 86 tiles
  // Row 0 (top edge): 12 tiles
  p(2, 0, 0), p(4, 0, 0), p(6, 0, 0), p(8, 0, 0), p(10, 0, 0), p(12, 0, 0),
  p(14, 0, 0), p(16, 0, 0), p(18, 0, 0), p(20, 0, 0), p(22, 0, 0), p(24, 0, 0),
  // Row 2: 8 tiles
  p(6, 2, 0), p(8, 2, 0), p(10, 2, 0), p(12, 2, 0), p(14, 2, 0), p(16, 2, 0),
  p(18, 2, 0), p(20, 2, 0),
  // Row 4: 10 tiles
  p(4, 4, 0), p(6, 4, 0), p(8, 4, 0), p(10, 4, 0), p(12, 4, 0), p(14, 4, 0),
  p(16, 4, 0), p(18, 4, 0), p(20, 4, 0), p(22, 4, 0),
  // Row 6: 13 tiles (left wing + 12 main)
  p(0, 6, 0), p(2, 6, 0), p(4, 6, 0), p(6, 6, 0), p(8, 6, 0), p(10, 6, 0),
  p(12, 6, 0), p(14, 6, 0), p(16, 6, 0), p(18, 6, 0), p(20, 6, 0), p(22, 6, 0),
  p(24, 6, 0),
  // Row 8: 13 tiles (left wing + 12 main)
  p(0, 8, 0), p(2, 8, 0), p(4, 8, 0), p(6, 8, 0), p(8, 8, 0), p(10, 8, 0),
  p(12, 8, 0), p(14, 8, 0), p(16, 8, 0), p(18, 8, 0), p(20, 8, 0), p(22, 8, 0),
  p(24, 8, 0),
  // Row 10: 10 tiles
  p(4, 10, 0), p(6, 10, 0), p(8, 10, 0), p(10, 10, 0), p(12, 10, 0), p(14, 10, 0),
  p(16, 10, 0), p(18, 10, 0), p(20, 10, 0), p(22, 10, 0),
  // Row 12: 8 tiles
  p(6, 12, 0), p(8, 12, 0), p(10, 12, 0), p(12, 12, 0), p(14, 12, 0), p(16, 12, 0),
  p(18, 12, 0), p(20, 12, 0),
  // Row 14 (bottom edge): 12 tiles
  p(2, 14, 0), p(4, 14, 0), p(6, 14, 0), p(8, 14, 0), p(10, 14, 0), p(12, 14, 0),
  p(14, 14, 0), p(16, 14, 0), p(18, 14, 0), p(20, 14, 0), p(22, 14, 0), p(24, 14, 0),

  // Layer 1 — 36 tiles
  p(5, 1, 1), p(7, 1, 1), p(9, 1, 1), p(11, 1, 1), p(13, 1, 1), p(15, 1, 1),
  p(5, 3, 1), p(7, 3, 1), p(9, 3, 1), p(11, 3, 1), p(13, 3, 1), p(15, 3, 1),
  p(17, 3, 1), p(19, 3, 1), p(21, 3, 1),
  p(5, 5, 1), p(7, 5, 1), p(9, 5, 1), p(11, 5, 1), p(13, 5, 1), p(15, 5, 1),
  p(17, 5, 1), p(19, 5, 1), p(21, 5, 1),
  p(5, 7, 1), p(7, 7, 1), p(9, 7, 1), p(11, 7, 1), p(13, 7, 1), p(15, 7, 1),
  p(17, 7, 1), p(19, 7, 1), p(21, 7, 1),
  p(7, 9, 1), p(9, 9, 1), p(11, 9, 1),

  // Layer 2 — 16 tiles
  p(8, 2, 2), p(10, 2, 2), p(12, 2, 2), p(14, 2, 2),
  p(8, 4, 2), p(10, 4, 2), p(12, 4, 2), p(14, 4, 2),
  p(8, 6, 2), p(10, 6, 2), p(12, 6, 2), p(14, 6, 2),
  p(8, 8, 2), p(10, 8, 2), p(12, 8, 2), p(14, 8, 2),

  // Layer 3 — 4 tiles
  p(9, 3, 3), p(11, 3, 3),
  p(9, 5, 3), p(11, 5, 3),

  // Layer 4 (top) — 2 tiles
  p(10, 4, 4), p(12, 4, 4),
];
// Count: 86 + 36 + 16 + 4 + 2 = 144

/* ── Pyramid ──────────────────────────────────────────────── */

const pyramidPositions: LayoutPosition[] = [];
// Layer 0: 8×8 = 64 tiles
for (let r = 0; r < 8; r++)
  for (let c = 0; c < 8; c++)
    pyramidPositions.push(p(c * 2, r * 2, 0));
// Layer 1: 6×6 = 36 tiles
for (let r = 0; r < 6; r++)
  for (let c = 0; c < 6; c++)
    pyramidPositions.push(p(c * 2 + 1, r * 2 + 1, 1));
// Layer 2: 4×4 = 16 tiles
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 4; c++)
    pyramidPositions.push(p(c * 2 + 2, r * 2 + 2, 2));
// Layer 3: 3×3 = 9 tiles → need exact 144, so far 64+36+16=116
// Layer 3: 4×4 = 16 tiles
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 4; c++)
    pyramidPositions.push(p(c * 2 + 3, r * 2 + 3, 3));
// Layer 4: 2×2 = 4 tiles → total 64+36+16+16+4 = 136
for (let r = 0; r < 2; r++)
  for (let c = 0; c < 2; c++)
    pyramidPositions.push(p(c * 2 + 4, r * 2 + 4, 4));
// Layer 5: 2×2 = 4 tiles → total 140
for (let r = 0; r < 2; r++)
  for (let c = 0; c < 2; c++)
    pyramidPositions.push(p(c * 2 + 5, r * 2 + 5, 5));
// Layer 6: 2×2 = 4 tiles → total 144
for (let r = 0; r < 2; r++)
  for (let c = 0; c < 2; c++)
    pyramidPositions.push(p(c * 2 + 6, r * 2 + 6, 6));

/* ── Fortress ─────────────────────────────────────────────── */

// Use dedup helper to avoid duplicate positions
const _fSet = new Set<string>();
const fortressPositions: LayoutPosition[] = [];
function addF(col: number, row: number, layer: number) {
  const key = `${col},${row},${layer}`;
  if (!_fSet.has(key)) { _fSet.add(key); fortressPositions.push(p(col, row, layer)); }
}
// 4 corner towers: each 3×3 L0 + 2×2 L1 + 1 L2 = 14 per tower = 56
for (const [sc, sr] of [[0, 0], [14, 0], [0, 10], [14, 10]]) {
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) addF(sc + c * 2, sr + r * 2, 0);
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 2; c++) addF(sc + c * 2 + 1, sr + r * 2 + 1, 1);
  addF(sc + 2, sr + 2, 2);
}
// Walls connecting towers — L0
// Top wall
for (let c = 0; c < 3; c++) addF(6 + c * 2, 0, 0);
for (let c = 0; c < 3; c++) addF(6 + c * 2, 2, 0);
// Bottom wall
for (let c = 0; c < 3; c++) addF(6 + c * 2, 12, 0);
for (let c = 0; c < 3; c++) addF(6 + c * 2, 14, 0);
// Left wall
for (let r = 0; r < 2; r++) addF(0, 5 + r * 2, 0);
for (let r = 0; r < 2; r++) addF(2, 5 + r * 2, 0);
// Right wall
for (let r = 0; r < 2; r++) addF(18, 5 + r * 2, 0);
for (let r = 0; r < 2; r++) addF(16, 5 + r * 2, 0);
// Inner courtyard — L0: 5×4 = 20
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 5; c++) addF(5 + c * 2, 4 + r * 2, 0);
// Courtyard L1: 4×3 = 12
for (let r = 0; r < 3; r++)
  for (let c = 0; c < 4; c++) addF(6 + c * 2, 5 + r * 2, 1);
// Courtyard L2: 3×2 = 6
for (let r = 0; r < 2; r++)
  for (let c = 0; c < 3; c++) addF(7 + c * 2, 6 + r * 2, 2);
// Courtyard L3: 2×1 = 2
addF(8, 7, 3); addF(10, 7, 3);
// Pad remaining to 144 with unique edge positions
let _fEdge = 0;
while (fortressPositions.length < 144) {
  addF(20 + (_fEdge % 3) * 2, Math.floor(_fEdge / 3) * 2, 0);
  _fEdge++;
}

/* ── Cross ────────────────────────────────────────────────── */

// Use dedup helper to avoid duplicate positions
const _cSet = new Set<string>();
const crossPositions: LayoutPosition[] = [];
function addC(col: number, row: number, layer: number) {
  const key = `${col},${row},${layer}`;
  if (!_cSet.has(key)) { _cSet.add(key); crossPositions.push(p(col, row, layer)); }
}
// L0: Cross shape — horizontal 12×4 + vertical 4×12, deduped overlap = 80
// Horizontal bar: cols 0..22, rows 4,6,8,10
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 12; c++) addC(c * 2, 4 + r * 2, 0);
// Vertical bar: cols 8,10,12,14, rows 0..22
for (let r = 0; r < 12; r++)
  for (let c = 0; c < 4; c++) addC(8 + c * 2, r * 2, 0);
// L1: 6×6 = 36 tiles
for (let r = 0; r < 6; r++)
  for (let c = 0; c < 6; c++) addC(5 + c * 2, 3 + r * 2, 1);
// L2: 4×4 = 16 tiles
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 4; c++) addC(6 + c * 2, 4 + r * 2, 2);
// L3: 4×2 = 8 tiles
for (let r = 0; r < 2; r++)
  for (let c = 0; c < 4; c++) addC(7 + c * 2, 5 + r * 2, 3);
// L4: 2×2 = 4 tiles
for (let r = 0; r < 2; r++)
  for (let c = 0; c < 2; c++) addC(8 + c * 2, 6 + r * 2, 4);
// Total: 80 + 36 + 16 + 8 + 4 = 144

/* ── Export ────────────────────────────────────────────────── */

export const LAYOUTS: Layout[] = [
  {
    name: "turtle",
    nameEn: "Turtle",
    nameTr: "Kaplumbağa",
    positions: turtlePositions,
  },
  {
    name: "pyramid",
    nameEn: "Pyramid",
    nameTr: "Piramit",
    positions: pyramidPositions,
  },
  {
    name: "fortress",
    nameEn: "Fortress",
    nameTr: "Kale",
    positions: fortressPositions.slice(0, 144),
  },
  {
    name: "cross",
    nameEn: "Cross",
    nameTr: "Haç",
    positions: crossPositions,
  },
];

export function getLayout(name: string): Layout {
  const layout = LAYOUTS.find((l) => l.name === name) ?? LAYOUTS[0];
  // Safety: ensure exactly 144 positions
  return layout.positions.length === 144
    ? layout
    : { ...layout, positions: layout.positions.slice(0, 144) };
}
