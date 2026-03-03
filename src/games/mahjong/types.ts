/* ── Tile Suits & Values ────────────────────────────────────── */

export type TileSuit =
  | "bamboo"
  | "character"
  | "circle"
  | "wind"
  | "dragon"
  | "season"
  | "flower";

export interface TileType {
  suit: TileSuit;
  value: string;        // "1"-"9", "east", "red", "spring", etc.
  label: string;        // Display text on tile
  emoji: string;        // Symbol/emoji for the tile
  color: string;        // CSS color for the text
  matchGroup?: string;  // For seasons/flowers: any tile in same group matches
}

/* ── Board Tile ────────────────────────────────────────────── */

export interface BoardTile {
  id: number;
  type: TileType;
  col: number;     // Grid column (half-units: 0, 1, 2, ...)
  row: number;     // Grid row (half-units)
  layer: number;   // Stack layer (0 = bottom)
  removed: boolean;
}

/* ── Layout ────────────────────────────────────────────────── */

export interface LayoutPosition {
  col: number;
  row: number;
  layer: number;
}

export interface Layout {
  name: string;
  nameEn: string;
  nameTr: string;
  positions: LayoutPosition[];
}

/* ── History ───────────────────────────────────────────────── */

export interface HistoryEntry {
  tile1Id: number;
  tile2Id: number;
}

/* ── Game State ────────────────────────────────────────────── */

export type GameStatus = "playing" | "won" | "stuck";

export interface MahjongState {
  tiles: BoardTile[];
  selectedTileId: number | null;
  history: HistoryEntry[];
  status: GameStatus;
  hintsUsed: number;
  layoutName: string;
}

/* ── Tile Definitions (42 unique types) ────────────────────── */

const bamboo = (v: number): TileType => ({
  suit: "bamboo",
  value: String(v),
  label: String(v),
  emoji: "🎋",
  color: "#16a34a",
});

const character = (v: number): TileType => ({
  suit: "character",
  value: String(v),
  label: String(v),
  emoji: "字",
  color: "#dc2626",
});

const circle = (v: number): TileType => ({
  suit: "circle",
  value: String(v),
  label: String(v),
  emoji: "●",
  color: "#2563eb",
});

const WIND_LABELS: Record<string, { label: string; emoji: string }> = {
  east:  { label: "東", emoji: "東" },
  south: { label: "南", emoji: "南" },
  west:  { label: "西", emoji: "西" },
  north: { label: "北", emoji: "北" },
};

const wind = (dir: string): TileType => ({
  suit: "wind",
  value: dir,
  label: WIND_LABELS[dir].label,
  emoji: WIND_LABELS[dir].emoji,
  color: "#1e293b",
});

const DRAGON_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  red:   { label: "中", emoji: "中", color: "#dc2626" },
  green: { label: "發", emoji: "發", color: "#16a34a" },
  white: { label: "□", emoji: "□", color: "#6b7280" },
};

const dragon = (type: string): TileType => ({
  suit: "dragon",
  value: type,
  label: DRAGON_INFO[type].label,
  emoji: DRAGON_INFO[type].emoji,
  color: DRAGON_INFO[type].color,
});

const SEASON_INFO: Record<string, { label: string; emoji: string }> = {
  spring: { label: "春", emoji: "🌸" },
  summer: { label: "夏", emoji: "☀️" },
  autumn: { label: "秋", emoji: "🍂" },
  winter: { label: "冬", emoji: "❄️" },
};

const season = (s: string): TileType => ({
  suit: "season",
  value: s,
  label: SEASON_INFO[s].label,
  emoji: SEASON_INFO[s].emoji,
  color: "#d97706",
  matchGroup: "season",
});

const FLOWER_INFO: Record<string, { label: string; emoji: string }> = {
  plum:          { label: "梅", emoji: "🏵️" },
  orchid:        { label: "蘭", emoji: "🌺" },
  chrysanthemum: { label: "菊", emoji: "🌼" },
  bamboo_flower: { label: "竹", emoji: "🎍" },
};

const flower = (f: string): TileType => ({
  suit: "flower",
  value: f,
  label: FLOWER_INFO[f].label,
  emoji: FLOWER_INFO[f].emoji,
  color: "#c026d3",
  matchGroup: "flower",
});

/** All 42 unique tile types. Regular tiles appear 4× each, seasons/flowers 1× each. */
export const TILE_TYPES: TileType[] = [
  // Bamboo 1-9
  ...Array.from({ length: 9 }, (_, i) => bamboo(i + 1)),
  // Character 1-9
  ...Array.from({ length: 9 }, (_, i) => character(i + 1)),
  // Circle 1-9
  ...Array.from({ length: 9 }, (_, i) => circle(i + 1)),
  // Winds
  wind("east"), wind("south"), wind("west"), wind("north"),
  // Dragons
  dragon("red"), dragon("green"), dragon("white"),
  // Seasons (unique)
  season("spring"), season("summer"), season("autumn"), season("winter"),
  // Flowers (unique)
  flower("plum"), flower("orchid"), flower("chrysanthemum"), flower("bamboo_flower"),
];

/** 34 regular types (×4 copies = 136) + 4 seasons + 4 flowers = 144 tiles */
export const REGULAR_TYPES = TILE_TYPES.filter(
  (t) => t.suit !== "season" && t.suit !== "flower"
);
export const SEASON_TYPES = TILE_TYPES.filter((t) => t.suit === "season");
export const FLOWER_TYPES = TILE_TYPES.filter((t) => t.suit === "flower");
