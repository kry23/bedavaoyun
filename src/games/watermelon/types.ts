export type GameStatus = "idle" | "playing" | "lost";

export interface FruitDef {
  index: number;
  name: string;
  emoji: string;
  radius: number;
  color: string;
  colorDark: string;
  points: number;
}

export const FRUITS: FruitDef[] = [
  { index: 0, name: "cherry", emoji: "🍒", radius: 15, color: "#FF4757", colorDark: "#C0392B", points: 1 },
  { index: 1, name: "strawberry", emoji: "🍓", radius: 20, color: "#FF7EB3", colorDark: "#E84393", points: 3 },
  { index: 2, name: "grape", emoji: "🍇", radius: 26, color: "#B553E0", colorDark: "#7B2FBE", points: 6 },
  { index: 3, name: "orange", emoji: "🍊", radius: 32, color: "#FFB347", colorDark: "#E8870E", points: 10 },
  { index: 4, name: "apple", emoji: "🍎", radius: 38, color: "#FF6348", colorDark: "#E74C3C", points: 15 },
  { index: 5, name: "pear", emoji: "🍐", radius: 44, color: "#BADC58", colorDark: "#6AB04C", points: 21 },
  { index: 6, name: "peach", emoji: "🍑", radius: 50, color: "#FFAA9E", colorDark: "#E17055", points: 28 },
  { index: 7, name: "pineapple", emoji: "🍍", radius: 56, color: "#FDCB6E", colorDark: "#F0932B", points: 36 },
  { index: 8, name: "melon", emoji: "🍈", radius: 62, color: "#55E6C1", colorDark: "#1ABC9C", points: 45 },
  { index: 9, name: "watermelon", emoji: "🍉", radius: 68, color: "#7BED9F", colorDark: "#2ECC71", points: 55 },
];

/** Only first 5 fruits can spawn as drop fruit */
export const SPAWN_FRUIT_COUNT = 5;

/** Container dimensions in game world coordinates */
export const CONTAINER_WIDTH = 340;
export const CONTAINER_HEIGHT = 500;
export const WALL_THICKNESS = 15;
export const DANGER_LINE_Y = 80;
export const DROP_Y = 40;

/** Timing */
export const DROP_COOLDOWN_MS = 500;
export const GAME_OVER_GRACE_MS = 2000;

export interface WatermelonState {
  status: GameStatus;
  score: number;
  maxFruitIndex: number;
  currentFruitIndex: number;
  nextFruitIndex: number;
  dropX: number;
  canDrop: boolean;
}
