export type GameStatus = "idle" | "playing" | "paused" | "lost" | "won";

/** Block types */
export type BlockType =
  | "standard"  // 1 hit
  | "brick"     // 2 hits
  | "tnt"       // explodes neighbors
  | "powerup"   // drops power-up
  | "heart"     // drops extra life
  | "indestructible"; // cannot be destroyed

export type PowerUpType =
  | "wide"      // wider paddle
  | "multi"     // multiball
  | "fireball"  // ball pierces blocks
  | "laser"     // paddle shoots lasers
  | "shield"    // bottom barrier
  | "heart";    // extra life

export interface Block {
  row: number;
  col: number;
  type: BlockType;
  hp: number;        // hits remaining
  color: string;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  fireball: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  vy: number;
}

export interface Laser {
  x: number;
  y: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface BlockBreakerState {
  status: GameStatus;
  score: number;
  lives: number;
  livesAtLevelStart: number;
  level: number;
  blocks: Block[];
  balls: Ball[];
  paddle: Paddle;
  powerUps: PowerUp[];
  lasers: Laser[];
  particles: Particle[];
  activePowerUps: Partial<Record<PowerUpType, number>>; // type → expiry timestamp
  ballOnPaddle: boolean; // ball waiting to launch
}

/** Canvas / game world dimensions */
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 600;

/** Block grid */
export const BLOCK_COLS = 10;
export const BLOCK_ROWS = 8;
export const BLOCK_WIDTH = 42;
export const BLOCK_HEIGHT = 18;
export const BLOCK_PAD = 3;
export const BLOCK_OFFSET_X = 15;
export const BLOCK_OFFSET_Y = 55;

/** Paddle */
export const PADDLE_WIDTH = 80;
export const PADDLE_WIDTH_WIDE = 130;
export const PADDLE_HEIGHT = 12;
export const PADDLE_Y = GAME_HEIGHT - 40;

/** Ball */
export const BALL_RADIUS = 6;
export const BALL_SPEED = 5;

/** Power-up */
export const POWERUP_FALL_SPEED = 2.5;
export const POWERUP_DURATION_MS = 15000;
export const POWERUP_SIZE = 14;

/** Laser */
export const LASER_SPEED = 8;

/** Scoring */
export const SCORE_BLOCK = 50;
export const SCORE_BRICK = 100;
export const SCORE_TNT = 75;
export const SCORE_POWERUP_BLOCK = 80;
export const SCORE_HEART_BLOCK = 60;
export const SCORE_POWERUP_CATCH = 100;
export const SCORE_HEART_CATCH = 250;
export const SCORE_PERFECT_BONUS = 1000;

/** Row colors (Google palette style) — cycles per row */
export const ROW_COLORS: string[] = [
  "#4285F4", // blue
  "#EA4335", // red
  "#FBBC05", // yellow
  "#34A853", // green
  "#4285F4",
  "#EA4335",
  "#FBBC05",
  "#34A853",
];

/** Darker versions for brick pattern */
export const ROW_COLORS_DARK: string[] = [
  "#3367D6",
  "#C62828",
  "#E0A800",
  "#2E7D32",
  "#3367D6",
  "#C62828",
  "#E0A800",
  "#2E7D32",
];
