import type { Direction, Point, SnakeState } from "./types";
import { GRID_SIZE, BASE_SPEED, SPEED_INCREASE_INTERVAL, SPEED_DECREASE, MIN_SPEED } from "./types";

function spawnFood(snake: Point[], gridSize: number): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (occupied.has(`${food.x},${food.y}`));
  return food;
}

export function createGame(): SnakeState {
  const center = Math.floor(GRID_SIZE / 2);
  const snake: Point[] = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
  return {
    gridSize: GRID_SIZE,
    snake,
    food: spawnFood(snake, GRID_SIZE),
    direction: "right",
    nextDirection: "right",
    status: "idle",
    score: 0,
    speed: BASE_SPEED,
  };
}

const OPPOSITES: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function changeDirection(
  state: SnakeState,
  dir: Direction
): SnakeState {
  if (OPPOSITES[dir] === state.direction) return state;
  return { ...state, nextDirection: dir };
}

export function tick(state: SnakeState): SnakeState {
  if (state.status === "lost") return state;

  const direction = state.nextDirection;
  const head = state.snake[0];
  const newHead: Point = { ...head };

  switch (direction) {
    case "up":
      newHead.y -= 1;
      break;
    case "down":
      newHead.y += 1;
      break;
    case "left":
      newHead.x -= 1;
      break;
    case "right":
      newHead.x += 1;
      break;
  }

  // Wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= state.gridSize ||
    newHead.y < 0 ||
    newHead.y >= state.gridSize
  ) {
    return { ...state, status: "lost", direction };
  }

  // Self collision
  if (state.snake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
    return { ...state, status: "lost", direction };
  }

  const newSnake = [newHead, ...state.snake];
  let newScore = state.score;
  let newFood = state.food;
  let newSpeed = state.speed;

  // Eat food
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    newScore++;
    newFood = spawnFood(newSnake, state.gridSize);

    if (newScore % SPEED_INCREASE_INTERVAL === 0) {
      newSpeed = Math.max(MIN_SPEED, newSpeed - SPEED_DECREASE);
    }
  } else {
    newSnake.pop();
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction,
    score: newScore,
    speed: newSpeed,
    status: "playing",
  };
}
