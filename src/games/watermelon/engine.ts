import Matter from "matter-js";
import {
  FRUITS,
  SPAWN_FRUIT_COUNT,
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  WALL_THICKNESS,
  DANGER_LINE_Y,
  DROP_COOLDOWN_MS,
  GAME_OVER_GRACE_MS,
  DROP_Y,
  type WatermelonState,
} from "./types";

/** Get the fruitIndex stored on a matter.js body */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFruitIndex(body: Matter.Body): number | undefined {
  return (body as any).fruitIndex;
}

/** Set the fruitIndex on a matter.js body */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setFruitIndex(body: Matter.Body, idx: number): void {
  (body as any).fruitIndex = idx;
}

function randomSpawnIndex(): number {
  return Math.floor(Math.random() * SPAWN_FRUIT_COUNT);
}

/** Visual merge effect */
export interface MergeEffect {
  x: number;
  y: number;
  radius: number;
  color: string;
  t: number;       // 0..1 progress
  fruitIndex: number;
}

export interface EngineCallbacks {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
  onMerge?: (x: number, y: number, fruitIndex: number) => void;
}

export class WatermelonEngine {
  engine: Matter.Engine;
  world: Matter.World;
  fruits: Matter.Body[] = [];
  score = 0;
  currentFruitIndex: number;
  nextFruitIndex: number;
  dropX: number;
  canDrop = true;
  gameOver = false;

  private walls: Matter.Body[];
  private dropCooldownTimer: ReturnType<typeof setTimeout> | null = null;
  private dangerTimer: ReturnType<typeof setTimeout> | null = null;
  private mergeQueue: Array<{ bodyA: Matter.Body; bodyB: Matter.Body }> = [];
  private callbacks: EngineCallbacks;
  private collisionHandler: (event: Matter.IEventCollision<Matter.Engine>) => void;

  constructor(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;

    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.8, scale: 0.001 },
    });
    this.world = this.engine.world;

    this.currentFruitIndex = randomSpawnIndex();
    this.nextFruitIndex = randomSpawnIndex();
    this.dropX = CONTAINER_WIDTH / 2;

    // Create walls
    this.walls = this.createWalls();
    Matter.Composite.add(this.world, this.walls);

    // Collision listener
    this.collisionHandler = (event) => this.handleCollision(event);
    Matter.Events.on(this.engine, "collisionStart", this.collisionHandler);
  }

  private createWalls(): Matter.Body[] {
    const opts: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      friction: 0.3,
      restitution: 0.2,
      label: "wall",
    };
    return [
      // Floor
      Matter.Bodies.rectangle(
        CONTAINER_WIDTH / 2,
        CONTAINER_HEIGHT + WALL_THICKNESS / 2,
        CONTAINER_WIDTH + WALL_THICKNESS * 2,
        WALL_THICKNESS,
        opts
      ),
      // Left wall
      Matter.Bodies.rectangle(
        -WALL_THICKNESS / 2,
        CONTAINER_HEIGHT / 2,
        WALL_THICKNESS,
        CONTAINER_HEIGHT * 2,
        opts
      ),
      // Right wall
      Matter.Bodies.rectangle(
        CONTAINER_WIDTH + WALL_THICKNESS / 2,
        CONTAINER_HEIGHT / 2,
        WALL_THICKNESS,
        CONTAINER_HEIGHT * 2,
        opts
      ),
    ];
  }

  private handleCollision(event: Matter.IEventCollision<Matter.Engine>): void {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;
      const idxA = getFruitIndex(bodyA);
      const idxB = getFruitIndex(bodyB);

      if (
        idxA !== undefined &&
        idxB !== undefined &&
        idxA === idxB &&
        idxA < FRUITS.length - 1
      ) {
        this.mergeQueue.push({ bodyA, bodyB });
      }
    }
  }

  private processMerges(): void {
    const processed = new Set<number>();

    for (const { bodyA, bodyB } of this.mergeQueue) {
      if (processed.has(bodyA.id) || processed.has(bodyB.id)) continue;
      if (!this.fruits.includes(bodyA) || !this.fruits.includes(bodyB)) continue;

      processed.add(bodyA.id);
      processed.add(bodyB.id);

      const fruitIndex = getFruitIndex(bodyA);
      if (fruitIndex === undefined) continue;
      const newIndex = fruitIndex + 1;
      const newFruit = FRUITS[newIndex];

      const midX = (bodyA.position.x + bodyB.position.x) / 2;
      const midY = (bodyA.position.y + bodyB.position.y) / 2;

      // Remove old fruits
      Matter.Composite.remove(this.world, bodyA);
      Matter.Composite.remove(this.world, bodyB);
      this.fruits = this.fruits.filter((f) => f !== bodyA && f !== bodyB);

      // Create merged fruit
      const newBody = this.createFruitBody(newIndex, midX, midY);
      Matter.Composite.add(this.world, newBody);
      this.fruits.push(newBody);

      this.score += newFruit.points;
      this.callbacks.onScoreChange(this.score);
      this.callbacks.onMerge?.(midX, midY, newIndex);
    }

    this.mergeQueue = [];
  }

  private createFruitBody(fruitIndex: number, x: number, y: number): Matter.Body {
    const def = FRUITS[fruitIndex];
    const body = Matter.Bodies.circle(x, y, def.radius, {
      restitution: 0.2,
      friction: 0.5,
      density: 0.001 * (fruitIndex + 1),
      label: `fruit-${fruitIndex}`,
    });
    setFruitIndex(body, fruitIndex);
    return body;
  }

  private checkGameOver(): void {
    if (this.gameOver) return;

    const anyAboveLine = this.fruits.some((body) => {
      const fi = getFruitIndex(body);
      if (fi === undefined) return false;
      const radius = FRUITS[fi].radius;
      const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
      return body.position.y - radius < DANGER_LINE_Y && speed < 1.5;
    });

    if (anyAboveLine && !this.dangerTimer) {
      this.dangerTimer = setTimeout(() => {
        const stillAbove = this.fruits.some((body) => {
          const fi = getFruitIndex(body);
          if (fi === undefined) return false;
          return body.position.y - FRUITS[fi].radius < DANGER_LINE_Y;
        });
        if (stillAbove) {
          this.gameOver = true;
          this.callbacks.onGameOver();
        }
        this.dangerTimer = null;
      }, GAME_OVER_GRACE_MS);
    } else if (!anyAboveLine && this.dangerTimer) {
      clearTimeout(this.dangerTimer);
      this.dangerTimer = null;
    }
  }

  drop(): void {
    if (!this.canDrop || this.gameOver) return;

    const body = this.createFruitBody(this.currentFruitIndex, this.dropX, DROP_Y);
    Matter.Composite.add(this.world, body);
    this.fruits.push(body);

    this.currentFruitIndex = this.nextFruitIndex;
    this.nextFruitIndex = randomSpawnIndex();
    this.canDrop = false;

    this.dropCooldownTimer = setTimeout(() => {
      this.canDrop = true;
    }, DROP_COOLDOWN_MS);
  }

  setDropX(x: number): void {
    const currentRadius = FRUITS[this.currentFruitIndex].radius;
    this.dropX = Math.max(currentRadius, Math.min(CONTAINER_WIDTH - currentRadius, x));
  }

  update(delta: number = 16.67): void {
    if (this.gameOver) return;
    Matter.Engine.update(this.engine, delta);
    this.processMerges();
    this.checkGameOver();
  }

  getState(): WatermelonState {
    return {
      status: this.gameOver ? "lost" : this.fruits.length > 0 ? "playing" : "idle",
      score: this.score,
      currentFruitIndex: this.currentFruitIndex,
      nextFruitIndex: this.nextFruitIndex,
      dropX: this.dropX,
      canDrop: this.canDrop,
    };
  }

  destroy(): void {
    if (this.dropCooldownTimer) clearTimeout(this.dropCooldownTimer);
    if (this.dangerTimer) clearTimeout(this.dangerTimer);
    Matter.Events.off(this.engine, "collisionStart", this.collisionHandler);
    Matter.Engine.clear(this.engine);
  }
}
