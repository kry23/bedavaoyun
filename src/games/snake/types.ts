export type Direction = "up" | "down" | "left" | "right";

export interface Point {
  x: number;
  y: number;
}

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface SnakeState {
  gridSize: number;
  snake: Point[];
  food: Point;
  direction: Direction;
  nextDirection: Direction;
  status: GameStatus;
  score: number;
  speed: number; // ms per tick
}

export const GRID_SIZE = 20;
export const BASE_SPEED = 150;
export const SPEED_INCREASE_INTERVAL = 5; // her 5 yemde hız artar
export const SPEED_DECREASE = 10; // ms azalma
export const MIN_SPEED = 60;
