export type Direction = "up" | "down" | "left" | "right";
export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface Game2048State {
  grid: number[][]; // 4x4, 0 = empty
  score: number;
  bestTile: number;
  status: GameStatus;
  won2048: boolean; // 2048'e ulaşıldı mı (ama oynamaya devam edebilir)
}

export const GRID_SIZE = 4;

export const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "transparent", text: "transparent" },
  2: { bg: "#EEE4DA", text: "#776E65" },
  4: { bg: "#EDE0C8", text: "#776E65" },
  8: { bg: "#F2B179", text: "#F9F6F2" },
  16: { bg: "#F59563", text: "#F9F6F2" },
  32: { bg: "#F67C5F", text: "#F9F6F2" },
  64: { bg: "#F65E3B", text: "#F9F6F2" },
  128: { bg: "#EDCF72", text: "#F9F6F2" },
  256: { bg: "#EDCC61", text: "#F9F6F2" },
  512: { bg: "#EDC850", text: "#F9F6F2" },
  1024: { bg: "#EDC53F", text: "#F9F6F2" },
  2048: { bg: "#EDC22E", text: "#F9F6F2" },
};

export const TILE_COLORS_DARK: Record<number, { bg: string; text: string }> = {
  0: { bg: "transparent", text: "transparent" },
  2: { bg: "#4A5568", text: "#E2E8F0" },
  4: { bg: "#556270", text: "#E2E8F0" },
  8: { bg: "#C07038", text: "#F9F6F2" },
  16: { bg: "#C06030", text: "#F9F6F2" },
  32: { bg: "#C04828", text: "#F9F6F2" },
  64: { bg: "#C03018", text: "#F9F6F2" },
  128: { bg: "#B8A040", text: "#F9F6F2" },
  256: { bg: "#B89830", text: "#F9F6F2" },
  512: { bg: "#B89020", text: "#F9F6F2" },
  1024: { bg: "#B88810", text: "#F9F6F2" },
  2048: { bg: "#B88000", text: "#F9F6F2" },
};

/* ── Animation data returned by move() ── */

export interface TileMove {
  value: number;
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
}

export interface MergedCell {
  r: number;
  c: number;
  value: number; // new merged value
}

export interface SpawnedTile {
  r: number;
  c: number;
  value: number;
}

export interface MoveResult {
  state: Game2048State;
  moved: boolean;
  tileMoves: TileMove[];
  mergedCells: MergedCell[];
  spawnedTile: SpawnedTile | null;
}
