import type { BoardTile, MahjongState, HistoryEntry, TileType } from "./types";
import { REGULAR_TYPES, SEASON_TYPES, FLOWER_TYPES } from "./types";
import { getLayout } from "./layouts";

/* ── Helpers ──────────────────────────────────────────────── */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build the 144-tile deck: 34 regular types ×4 + 4 seasons + 4 flowers. */
function buildDeck(): TileType[] {
  const deck: TileType[] = [];
  for (const t of REGULAR_TYPES) {
    deck.push(t, t, t, t); // 4 copies each
  }
  for (const t of SEASON_TYPES) {
    deck.push(t); // 1 copy each (4 total)
  }
  for (const t of FLOWER_TYPES) {
    deck.push(t); // 1 copy each (4 total)
  }
  return deck; // 34×4 + 4 + 4 = 144
}

/* ── Game Creation (solvable board generation) ───────────── */

/**
 * Generate a solvable board using batch-aware generation:
 * 1. Start with all positions "filled" (no types yet)
 * 2. Find ALL free tiles at once (a "batch")
 * 3. Assign complete type groups (4 tiles each) within each batch
 * 4. Remove the assigned tiles, repeat for the next batch
 * 5. Restore all tiles — board is guaranteed solvable by ANY greedy play
 *
 * Key insight: all 4 copies of each tile type are in the same batch (free
 * simultaneously), so the player can match any pair in any order. Different
 * batches have different types, so cross-batch matching is impossible.
 */
export function createGame(layoutName: string): MahjongState {
  const layout = getLayout(layoutName);
  const positions = layout.positions;

  // Build 36 type groups of 4 tiles each (36 × 4 = 144)
  const typeGroups: TileType[][] = [];
  for (const t of REGULAR_TYPES) {
    typeGroups.push([t, t, t, t]); // 4 identical tiles
  }
  // Seasons: 4 unique tiles, any two match → 1 group of 4
  typeGroups.push(shuffle([...SEASON_TYPES]));
  // Flowers: 4 unique tiles, any two match → 1 group of 4
  typeGroups.push(shuffle([...FLOWER_TYPES]));

  const shuffledGroups = shuffle(typeGroups);

  // Create tiles with placeholder types
  const tiles: BoardTile[] = positions.map((pos, i) => ({
    id: i,
    type: REGULAR_TYPES[0], // placeholder
    col: pos.col,
    row: pos.row,
    layer: pos.layer,
    removed: false,
  }));

  const tempState: MahjongState = {
    tiles,
    selectedTileId: null,
    history: [],
    status: "playing",
    hintsUsed: 0,
    layoutName,
  };

  const assigned = new Set<number>();
  let groupIdx = 0;

  // Peel tiles in batches, assigning type groups of 4
  for (let safety = 0; safety < 100 && groupIdx < shuffledGroups.length; safety++) {
    const freeTileIds: number[] = [];
    for (const t of tempState.tiles) {
      if (!t.removed && isFree(tempState, t.id)) {
        freeTileIds.push(t.id);
      }
    }

    const shuffledFree = shuffle(freeTileIds);
    const groupsThisRound = Math.floor(shuffledFree.length / 4);
    if (groupsThisRound === 0) break;

    for (let g = 0; g < groupsThisRound && groupIdx < shuffledGroups.length; g++) {
      const group = shuffledGroups[groupIdx];
      const base = g * 4;
      for (let k = 0; k < 4; k++) {
        const tileId = shuffledFree[base + k];
        tempState.tiles[tileId].type = group[k];
        tempState.tiles[tileId].removed = true;
        assigned.add(tileId);
      }
      groupIdx++;
    }
    // Leftover free tiles (< 4) stay for the next round
  }

  // Handle remaining unassigned tiles with pair-wise assignment
  if (groupIdx < shuffledGroups.length) {
    const remainingGroups = shuffledGroups.slice(groupIdx);
    // Split remaining groups into pairs: [t1,t2,t3,t4] → [t1,t2] + [t3,t4]
    const pairs: [TileType, TileType][] = [];
    for (const group of remainingGroups) {
      pairs.push([group[0], group[1]]);
      pairs.push([group[2], group[3]]);
    }
    let pairIdx = 0;
    for (let safety = 0; safety < 100 && pairIdx < pairs.length; safety++) {
      const freeTileIds: number[] = [];
      for (const t of tempState.tiles) {
        if (!t.removed && isFree(tempState, t.id)) {
          freeTileIds.push(t.id);
        }
      }
      if (freeTileIds.length < 2) break;
      const shuffledFree2 = shuffle(freeTileIds);
      const [type1, type2] = pairs[pairIdx];
      tempState.tiles[shuffledFree2[0]].type = type1;
      tempState.tiles[shuffledFree2[1]].type = type2;
      tempState.tiles[shuffledFree2[0]].removed = true;
      tempState.tiles[shuffledFree2[1]].removed = true;
      assigned.add(shuffledFree2[0]);
      assigned.add(shuffledFree2[1]);
      pairIdx++;
    }
  }

  // Last resort fallback
  if (assigned.size < tiles.length) {
    const deck = shuffle(buildDeck());
    let di = 0;
    for (const t of tiles) {
      if (!assigned.has(t.id)) {
        t.type = deck[di++ % deck.length];
      }
    }
  }

  // Restore all tiles
  for (const t of tiles) {
    t.removed = false;
  }

  return {
    tiles,
    selectedTileId: null,
    history: [],
    status: "playing",
    hintsUsed: 0,
    layoutName,
  };
}

/* ── Free Tile Detection ──────────────────────────────────── */

/**
 * A tile is "free" if:
 * 1. No tile covers it from above (overlapping area on layer+1)
 * 2. Either left or right side is unblocked
 *
 * Tiles are 2 units wide × 2 units tall.
 * Two tiles overlap if their areas intersect.
 */
function tilesOverlap(
  col1: number, row1: number,
  col2: number, row2: number
): boolean {
  // Each tile is at [col, col+2) × [row, row+2)
  return col1 < col2 + 2 && col2 < col1 + 2 &&
         row1 < row2 + 2 && row2 < row1 + 2;
}

function isBlockedAbove(tiles: BoardTile[], tile: BoardTile): boolean {
  return tiles.some(
    (t) =>
      !t.removed &&
      t.id !== tile.id &&
      t.layer === tile.layer + 1 &&
      tilesOverlap(t.col, t.row, tile.col, tile.row)
  );
}

function isBlockedLeft(tiles: BoardTile[], tile: BoardTile): boolean {
  return tiles.some(
    (t) =>
      !t.removed &&
      t.id !== tile.id &&
      t.layer === tile.layer &&
      t.col === tile.col - 2 &&
      t.row < tile.row + 2 &&
      tile.row < t.row + 2
  );
}

function isBlockedRight(tiles: BoardTile[], tile: BoardTile): boolean {
  return tiles.some(
    (t) =>
      !t.removed &&
      t.id !== tile.id &&
      t.layer === tile.layer &&
      t.col === tile.col + 2 &&
      t.row < tile.row + 2 &&
      tile.row < t.row + 2
  );
}

export function isFree(state: MahjongState, tileId: number): boolean {
  const tile = state.tiles[tileId];
  if (!tile || tile.removed) return false;
  if (isBlockedAbove(state.tiles, tile)) return false;
  // Must have at least one free side (left OR right)
  const blockedL = isBlockedLeft(state.tiles, tile);
  const blockedR = isBlockedRight(state.tiles, tile);
  return !blockedL || !blockedR;
}

export function getFreeTiles(state: MahjongState): BoardTile[] {
  return state.tiles.filter((t) => !t.removed && isFree(state, t.id));
}

/* ── Matching ─────────────────────────────────────────────── */

export function canMatch(a: TileType, b: TileType): boolean {
  // Seasons: any season matches any season
  if (a.matchGroup && b.matchGroup && a.matchGroup === b.matchGroup) return true;
  // Regular tiles: same suit and value
  return a.suit === b.suit && a.value === b.value;
}

/* ── Tile Selection & Removal ─────────────────────────────── */

export interface SelectResult {
  state: MahjongState;
  matched: boolean;
  mismatch: boolean;
  blocked: boolean;
}

export function selectTile(state: MahjongState, tileId: number): SelectResult {
  if (state.status !== "playing") return { state, matched: false, mismatch: false, blocked: false };

  const tile = state.tiles[tileId];
  if (!tile || tile.removed) return { state, matched: false, mismatch: false, blocked: false };
  if (!isFree(state, tileId)) return { state, matched: false, mismatch: false, blocked: true };

  // Deselect if clicking same tile
  if (state.selectedTileId === tileId) {
    return { state: { ...state, selectedTileId: null }, matched: false, mismatch: false, blocked: false };
  }

  // No tile selected yet → select this one
  if (state.selectedTileId === null) {
    return { state: { ...state, selectedTileId: tileId }, matched: false, mismatch: false, blocked: false };
  }

  // Second tile selected → check match
  const first = state.tiles[state.selectedTileId];
  if (canMatch(first.type, tile.type)) {
    // Match! Remove both tiles
    const newTiles = state.tiles.map((t) =>
      t.id === first.id || t.id === tile.id ? { ...t, removed: true } : t
    );
    const entry: HistoryEntry = { tile1Id: first.id, tile2Id: tile.id };
    const newState: MahjongState = {
      ...state,
      tiles: newTiles,
      selectedTileId: null,
      history: [...state.history, entry],
    };

    // Check win
    const remaining = newTiles.filter((t) => !t.removed).length;
    if (remaining === 0) {
      newState.status = "won";
    } else if (isStuck(newState)) {
      newState.status = "stuck";
    }

    return { state: newState, matched: true, mismatch: false, blocked: false };
  }

  // No match → select the new tile instead
  return {
    state: { ...state, selectedTileId: tileId },
    matched: false,
    mismatch: true,
    blocked: false,
  };
}

/* ── Stuck Detection ──────────────────────────────────────── */

export function isStuck(state: MahjongState): boolean {
  const free = getFreeTiles(state);
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (canMatch(free[i].type, free[j].type)) return false;
    }
  }
  return true;
}

/* ── Hint ─────────────────────────────────────────────────── */

export function getHint(state: MahjongState): [number, number] | null {
  const free = getFreeTiles(state);
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (canMatch(free[i].type, free[j].type)) {
        return [free[i].id, free[j].id];
      }
    }
  }
  return null;
}

export function applyHint(state: MahjongState): MahjongState {
  return { ...state, hintsUsed: state.hintsUsed + 1 };
}

/* ── Undo ─────────────────────────────────────────────────── */

export function undo(state: MahjongState): MahjongState {
  if (state.history.length === 0) return state;
  const history = [...state.history];
  const last = history.pop()!;
  const newTiles = state.tiles.map((t) =>
    t.id === last.tile1Id || t.id === last.tile2Id ? { ...t, removed: false } : t
  );
  return {
    ...state,
    tiles: newTiles,
    history,
    selectedTileId: null,
    status: "playing",
  };
}

/* ── Shuffle Remaining ────────────────────────────────────── */

export function shuffleRemaining(state: MahjongState): MahjongState {
  const remaining = state.tiles.filter((t) => !t.removed);
  const types = shuffle(remaining.map((t) => t.type));
  let typeIdx = 0;
  const newTiles = state.tiles.map((t) => {
    if (t.removed) return t;
    return { ...t, type: types[typeIdx++] };
  });

  const newState: MahjongState = {
    ...state,
    tiles: newTiles,
    selectedTileId: null,
    status: "playing",
  };

  if (isStuck(newState)) {
    newState.status = "stuck";
  }

  return newState;
}

/* ── Utilities ────────────────────────────────────────────── */

export function getRemainingCount(state: MahjongState): number {
  return state.tiles.filter((t) => !t.removed).length;
}
