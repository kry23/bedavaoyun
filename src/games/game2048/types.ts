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
  2: { bg: "#EDE4DA", text: "#776E65" },
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
