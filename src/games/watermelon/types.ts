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
  { index: 0, name: "cherry", emoji: "🍒", radius: 15, color: "#C62828", colorDark: "#7F0000", points: 1 },
  { index: 1, name: "strawberry", emoji: "🍓", radius: 20, color: "#EC407A", colorDark: "#880E4F", points: 3 },
  { index: 2, name: "grape", emoji: "🍇", radius: 26, color: "#AB47BC", colorDark: "#4A148C", points: 6 },
  { index: 3, name: "orange", emoji: "🍊", radius: 32, color: "#FF8F00", colorDark: "#BF360C", points: 10 },
  { index: 4, name: "apple", emoji: "🍎", radius: 38, color: "#EF5350", colorDark: "#B71C1C", points: 15 },
  { index: 5, name: "pear", emoji: "🍐", radius: 44, color: "#9ACD32", colorDark: "#5B7A1A", points: 21 },
  { index: 6, name: "peach", emoji: "🍑", radius: 50, color: "#FF8A65", colorDark: "#D84315", points: 28 },
  { index: 7, name: "pineapple", emoji: "🍍", radius: 56, color: "#FDD835", colorDark: "#F9A825", points: 36 },
  { index: 8, name: "melon", emoji: "🍈", radius: 62, color: "#26A69A", colorDark: "#004D40", points: 45 },
  { index: 9, name: "watermelon", emoji: "🍉", radius: 68, color: "#43A047", colorDark: "#1B5E20", points: 55 },
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
  currentFruitIndex: number;
  nextFruitIndex: number;
  dropX: number;
  canDrop: boolean;
}
