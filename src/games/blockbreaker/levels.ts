import type { BlockType } from "./types";
import { BLOCK_COLS } from "./types";

/**
 * Level definitions.
 * Each level is a 2D array of BlockType or null.
 * Rows top-to-bottom. null = empty cell.
 */

type CellDef = BlockType | null;
type LevelDef = CellDef[][];

/** Shorthand helpers */
const S: BlockType = "standard";
const B: BlockType = "brick";
const T: BlockType = "tnt";
const P: BlockType = "powerup";
const H: BlockType = "heart";
const I: BlockType = "indestructible";
const _: null = null;

/** Level 1: Simple 4 rows (one per color) */
const level1: LevelDef = [
  [S, S, S, S, S, S, S, S, S, S],
  [S, S, S, S, S, S, S, S, S, S],
  [S, S, S, S, S, S, S, S, S, S],
  [S, S, S, S, S, S, S, S, S, S],
];

/** Level 2: Bricks and power-up */
const level2: LevelDef = [
  [S, S, S, P, S, S, P, S, S, S],
  [S, B, S, S, S, S, S, S, B, S],
  [S, S, S, S, S, S, S, S, S, S],
  [S, S, B, S, S, S, S, B, S, S],
  [S, S, S, S, S, S, S, S, S, S],
];

/** Level 3: TNT chain */
const level3: LevelDef = [
  [S, S, S, S, S, S, S, S, S, S],
  [S, B, S, T, S, S, T, S, B, S],
  [S, S, S, S, P, P, S, S, S, S],
  [B, S, S, S, S, S, S, S, S, B],
  [S, S, B, S, H, H, S, B, S, S],
  [S, S, S, S, S, S, S, S, S, S],
];

/** Level 4: Fortress pattern with indestructibles */
const level4: LevelDef = [
  [I, S, S, S, P, P, S, S, S, I],
  [S, S, B, S, S, S, S, B, S, S],
  [S, B, T, B, S, S, B, T, B, S],
  [S, S, B, S, S, S, S, B, S, S],
  [I, S, S, S, H, H, S, S, S, I],
  [S, S, S, S, S, S, S, S, S, S],
];

/** Level 5: Checkerboard */
const level5: LevelDef = [
  [S, _, S, _, S, _, S, _, S, _],
  [_, S, _, S, _, S, _, S, _, S],
  [B, _, B, _, T, _, T, _, B, _],
  [_, B, _, P, _, H, _, P, _, B],
  [S, _, S, _, S, _, S, _, S, _],
  [_, S, _, S, _, S, _, S, _, S],
];

/** Level 6: Diamond */
const level6: LevelDef = [
  [_, _, _, _, S, S, _, _, _, _],
  [_, _, _, S, B, B, S, _, _, _],
  [_, _, S, B, T, T, B, S, _, _],
  [_, S, B, P, S, S, P, B, S, _],
  [S, B, S, S, H, H, S, S, B, S],
  [_, S, B, P, S, S, P, B, S, _],
  [_, _, S, B, S, S, B, S, _, _],
  [_, _, _, S, S, S, S, _, _, _],
];

/** Level 7: Heavy bricks */
const level7: LevelDef = [
  [B, B, B, B, B, B, B, B, B, B],
  [B, S, S, P, S, S, P, S, S, B],
  [B, S, T, S, S, S, S, T, S, B],
  [B, S, S, S, H, H, S, S, S, B],
  [B, S, S, S, S, S, S, S, S, B],
  [I, S, S, S, S, S, S, S, S, I],
  [S, S, S, S, P, P, S, S, S, S],
];

/** Level 8: Arrow */
const level8: LevelDef = [
  [_, _, _, _, S, S, _, _, _, _],
  [_, _, _, S, B, B, S, _, _, _],
  [_, _, S, S, B, B, S, S, _, _],
  [_, S, S, T, P, P, T, S, S, _],
  [S, S, S, S, B, B, S, S, S, S],
  [_, _, _, S, B, B, S, _, _, _],
  [_, _, _, S, S, S, S, _, _, _],
  [_, _, _, S, H, H, S, _, _, _],
];

/** Level 9: Full assault */
const level9: LevelDef = [
  [B, B, B, T, B, B, T, B, B, B],
  [B, S, S, S, P, P, S, S, S, B],
  [I, S, S, S, S, S, S, S, S, I],
  [B, S, T, S, S, S, S, T, S, B],
  [B, S, S, S, H, H, S, S, S, B],
  [I, S, S, S, S, S, S, S, S, I],
  [B, B, S, P, S, S, P, S, B, B],
  [B, B, B, B, B, B, B, B, B, B],
];

/** Level 10: Final wall */
const level10: LevelDef = [
  [I, B, B, T, B, B, T, B, B, I],
  [B, B, B, B, P, P, B, B, B, B],
  [B, B, T, B, B, B, B, T, B, B],
  [I, B, B, B, H, H, B, B, B, I],
  [B, B, B, B, B, B, B, B, B, B],
  [B, T, B, P, B, B, P, B, T, B],
  [B, B, B, B, B, B, B, B, B, B],
  [I, B, B, B, B, B, B, B, B, I],
];

export const LEVELS: LevelDef[] = [
  level1, level2, level3, level4, level5,
  level6, level7, level8, level9, level10,
];

export const TOTAL_LEVELS = LEVELS.length;

/** Ensure all rows are padded to BLOCK_COLS */
export function getLevelDef(levelIndex: number): LevelDef {
  const def = LEVELS[levelIndex % LEVELS.length];
  return def.map((row) => {
    const padded = [...row];
    while (padded.length < BLOCK_COLS) padded.push(null);
    return padded.slice(0, BLOCK_COLS);
  });
}
