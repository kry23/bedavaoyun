import type {
  BlockBreakerState,
  Block,
  Ball,
  Paddle,
  Laser,
  Particle,
  PowerUpType,
  GameStatus,
} from "./types";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BLOCK_COLS,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  BLOCK_PAD,
  BLOCK_OFFSET_X,
  BLOCK_OFFSET_Y,
  PADDLE_WIDTH,
  PADDLE_WIDTH_WIDE,
  PADDLE_HEIGHT,
  PADDLE_Y,
  BALL_RADIUS,
  BALL_SPEED,
  POWERUP_FALL_SPEED,
  POWERUP_DURATION_MS,
  POWERUP_SIZE,
  LASER_SPEED,
  SCORE_BLOCK,
  SCORE_BRICK,
  SCORE_TNT,
  SCORE_POWERUP_BLOCK,
  SCORE_HEART_BLOCK,
  SCORE_POWERUP_CATCH,
  SCORE_HEART_CATCH,
  SCORE_PERFECT_BONUS,
  ROW_COLORS,
} from "./types";
import { getLevelDef, TOTAL_LEVELS } from "./levels";

/* ── Helpers ─────────────────────────────────────────────── */

function blockRect(b: Block) {
  return {
    x: BLOCK_OFFSET_X + b.col * (BLOCK_WIDTH + BLOCK_PAD),
    y: BLOCK_OFFSET_Y + b.row * (BLOCK_HEIGHT + BLOCK_PAD),
    w: BLOCK_WIDTH,
    h: BLOCK_HEIGHT,
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function randomPowerUpType(): PowerUpType {
  const types: PowerUpType[] = ["wide", "multi", "fireball", "laser", "shield"];
  return types[Math.floor(Math.random() * types.length)];
}

function spawnParticles(
  x: number,
  y: number,
  color: string,
  count: number
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 2 + Math.random() * 3,
    });
  }
  return particles;
}

/* ── Create level blocks ─────────────────────────────────── */

function createBlocks(levelIndex: number): Block[] {
  const def = getLevelDef(levelIndex);
  const blocks: Block[] = [];
  for (let row = 0; row < def.length; row++) {
    for (let col = 0; col < BLOCK_COLS; col++) {
      const type = def[row][col];
      if (!type) continue;
      blocks.push({
        row,
        col,
        type,
        hp: type === "brick" ? 2 : type === "indestructible" ? 999 : 1,
        color: ROW_COLORS[row % ROW_COLORS.length],
      });
    }
  }
  return blocks;
}

/* ── Create initial state ────────────────────────────────── */

export function createGame(level: number = 0): BlockBreakerState {
  const paddle: Paddle = {
    x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  const ball: Ball = {
    x: GAME_WIDTH / 2,
    y: PADDLE_Y - BALL_RADIUS - 1,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    fireball: false,
  };

  return {
    status: "idle",
    score: 0,
    lives: 3,
    livesAtLevelStart: 3,
    level,
    blocks: createBlocks(level),
    balls: [ball],
    paddle,
    powerUps: [],
    lasers: [],
    particles: [],
    activePowerUps: {},
    ballOnPaddle: true,
  };
}

/** Reset for a new level, keeping score and lives */
export function loadLevel(state: BlockBreakerState, level: number): BlockBreakerState {
  const paddle: Paddle = {
    x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  const ball: Ball = {
    x: GAME_WIDTH / 2,
    y: PADDLE_Y - BALL_RADIUS - 1,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    fireball: false,
  };

  return {
    ...state,
    status: "playing",
    level,
    livesAtLevelStart: state.lives,
    blocks: createBlocks(level),
    balls: [ball],
    paddle,
    powerUps: [],
    lasers: [],
    particles: [],
    activePowerUps: {},
    ballOnPaddle: true,
  };
}

/* ── Paddle movement ─────────────────────────────────────── */

export function movePaddle(state: BlockBreakerState, x: number): BlockBreakerState {
  const pw = state.activePowerUps.wide && state.activePowerUps.wide > Date.now()
    ? PADDLE_WIDTH_WIDE
    : PADDLE_WIDTH;
  const px = clamp(x - pw / 2, 0, GAME_WIDTH - pw);
  const paddle = { ...state.paddle, x: px, width: pw };

  let balls = state.balls;
  if (state.ballOnPaddle) {
    balls = balls.map((b) => ({
      ...b,
      x: px + pw / 2,
      y: PADDLE_Y - BALL_RADIUS - 1,
    }));
  }

  return { ...state, paddle, balls };
}

/* ── Launch ball ─────────────────────────────────────────── */

export function launchBall(state: BlockBreakerState): BlockBreakerState {
  if (!state.ballOnPaddle) return state;

  // Random angle between -60° to 60° from vertical
  const angle = ((Math.random() - 0.5) * Math.PI) / 3;
  const speed = BALL_SPEED + state.level * 0.3;

  const balls = state.balls.map((b) => ({
    ...b,
    vx: Math.sin(angle) * speed,
    vy: -Math.cos(angle) * speed,
  }));

  return { ...state, balls, ballOnPaddle: false, status: "playing" };
}

/* ── Shoot laser ─────────────────────────────────────────── */

export function shootLaser(state: BlockBreakerState): BlockBreakerState {
  if (!state.activePowerUps.laser || state.activePowerUps.laser <= Date.now()) {
    return state;
  }
  const px = state.paddle.x;
  const pw = state.paddle.width;
  const newLasers: Laser[] = [
    { x: px + 4, y: PADDLE_Y - 4, vy: -LASER_SPEED },
    { x: px + pw - 4, y: PADDLE_Y - 4, vy: -LASER_SPEED },
  ];
  return { ...state, lasers: [...state.lasers, ...newLasers] };
}

/* ── Main tick ───────────────────────────────────────────── */

export function tick(state: BlockBreakerState): BlockBreakerState {
  if (state.status !== "playing") return state;

  const now = Date.now();
  // eslint-disable-next-line prefer-const
  let { balls, blocks, powerUps, lasers, particles, score, lives, activePowerUps } =
    structuredClone(state);
  const paddle = { ...state.paddle };

  // Update paddle width based on power-up
  paddle.width =
    activePowerUps.wide && activePowerUps.wide > now ? PADDLE_WIDTH_WIDE : PADDLE_WIDTH;

  const isFireball = activePowerUps.fireball ? activePowerUps.fireball > now : false;
  const hasShield = activePowerUps.shield ? activePowerUps.shield > now : false;

  // Mark fireball on balls
  balls.forEach((b) => { b.fireball = isFireball; });

  // ── Move balls ──
  const ballsToRemove: number[] = [];

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    b.x += b.vx;
    b.y += b.vy;

    // Wall collisions
    if (b.x - b.radius <= 0) {
      b.x = b.radius;
      b.vx = Math.abs(b.vx);
    }
    if (b.x + b.radius >= GAME_WIDTH) {
      b.x = GAME_WIDTH - b.radius;
      b.vx = -Math.abs(b.vx);
    }
    if (b.y - b.radius <= 0) {
      b.y = b.radius;
      b.vy = Math.abs(b.vy);
    }

    // Bottom — ball lost
    if (b.y + b.radius >= GAME_HEIGHT) {
      if (hasShield) {
        b.y = GAME_HEIGHT - b.radius - 2;
        b.vy = -Math.abs(b.vy);
      } else {
        ballsToRemove.push(i);
      }
    }

    // Paddle collision
    if (
      b.vy > 0 &&
      b.y + b.radius >= paddle.y &&
      b.y + b.radius <= paddle.y + paddle.height + 4 &&
      b.x >= paddle.x - b.radius &&
      b.x <= paddle.x + paddle.width + b.radius
    ) {
      // Deflection angle based on where ball hits paddle
      const hitPos = (b.x - paddle.x) / paddle.width; // 0..1
      const angle = (hitPos - 0.5) * (Math.PI * 0.7); // -63° to +63°
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      b.vx = Math.sin(angle) * speed;
      b.vy = -Math.cos(angle) * speed;
      b.y = paddle.y - b.radius - 1;
    }

    // Block collisions
    for (let j = blocks.length - 1; j >= 0; j--) {
      const block = blocks[j];
      const br = blockRect(block);

      // AABB check
      const closestX = clamp(b.x, br.x, br.x + br.w);
      const closestY = clamp(b.y, br.y, br.y + br.h);
      const dx = b.x - closestX;
      const dy = b.y - closestY;
      const distSq = dx * dx + dy * dy;

      if (distSq <= b.radius * b.radius) {
        // Hit block
        if (block.type !== "indestructible") {
          block.hp--;
          if (block.hp <= 0) {
            // Destroy block
            const cx = br.x + br.w / 2;
            const cy = br.y + br.h / 2;
            particles.push(...spawnParticles(cx, cy, block.color, 6));

            // Score
            switch (block.type) {
              case "standard": score += SCORE_BLOCK; break;
              case "brick": score += SCORE_BRICK; break;
              case "tnt": score += SCORE_TNT; break;
              case "powerup": score += SCORE_POWERUP_BLOCK; break;
              case "heart": score += SCORE_HEART_BLOCK; break;
            }

            // TNT explosion
            if (block.type === "tnt") {
              particles.push(...spawnParticles(cx, cy, "#FF6600", 15));
              // Destroy adjacent blocks
              for (let k = blocks.length - 1; k >= 0; k--) {
                if (k === j) continue;
                const adj = blocks[k];
                if (
                  adj.type !== "indestructible" &&
                  Math.abs(adj.row - block.row) <= 1 &&
                  Math.abs(adj.col - block.col) <= 1
                ) {
                  const ar = blockRect(adj);
                  particles.push(
                    ...spawnParticles(ar.x + ar.w / 2, ar.y + ar.h / 2, adj.color, 4)
                  );
                  score += SCORE_BLOCK;
                  blocks.splice(k, 1);
                  if (k < j) j--;
                }
              }
            }

            // Drop power-up
            if (block.type === "powerup") {
              powerUps.push({
                x: cx,
                y: cy,
                type: randomPowerUpType(),
                vy: POWERUP_FALL_SPEED,
              });
            }

            // Drop heart
            if (block.type === "heart") {
              powerUps.push({
                x: cx,
                y: cy,
                type: "heart",
                vy: POWERUP_FALL_SPEED,
              });
            }

            blocks.splice(j, 1);
          }
        }

        // Bounce ball (skip for fireball — it pierces)
        if (!b.fireball) {
          // Determine bounce direction
          const overlapX =
            b.radius - Math.abs(b.x - clamp(b.x, br.x, br.x + br.w));
          const overlapY =
            b.radius - Math.abs(b.y - clamp(b.y, br.y, br.y + br.h));

          if (overlapX < overlapY) {
            b.vx = -b.vx;
          } else {
            b.vy = -b.vy;
          }
        }

        break; // one block per frame per ball
      }
    }
  }

  // Remove lost balls
  for (let i = ballsToRemove.length - 1; i >= 0; i--) {
    balls.splice(ballsToRemove[i], 1);
  }

  // ── Move power-ups ──
  const puToRemove: number[] = [];
  for (let i = 0; i < powerUps.length; i++) {
    const pu = powerUps[i];
    pu.y += pu.vy;

    // Catch with paddle
    if (
      pu.y + POWERUP_SIZE >= paddle.y &&
      pu.y <= paddle.y + paddle.height &&
      pu.x + POWERUP_SIZE >= paddle.x &&
      pu.x - POWERUP_SIZE <= paddle.x + paddle.width
    ) {
      if (pu.type === "heart") {
        // Heart power-up: grant extra life
        if (lives < 5) lives++;
        score += SCORE_HEART_CATCH;
      } else {
        activePowerUps[pu.type] = now + POWERUP_DURATION_MS;
        score += SCORE_POWERUP_CATCH;

        // Multiball: spawn extra balls
        if (pu.type === "multi" && balls.length > 0 && balls.length < 6) {
          const refBall = balls[0];
          for (let m = 0; m < 2; m++) {
            const angle = ((Math.random() - 0.5) * Math.PI) / 2;
            const speed = Math.max(BALL_SPEED, Math.sqrt(refBall.vx ** 2 + refBall.vy ** 2));
            balls.push({
              x: refBall.x,
              y: refBall.y,
              vx: Math.sin(angle) * speed,
              vy: -Math.abs(Math.cos(angle) * speed),
              radius: BALL_RADIUS,
              fireball: isFireball,
            });
          }
        }
      }
      particles.push(...spawnParticles(pu.x, pu.y, "#FFFFFF", 8));
      puToRemove.push(i);
      continue;
    }

    // Off screen
    if (pu.y > GAME_HEIGHT + 20) {
      puToRemove.push(i);
    }
  }
  for (let i = puToRemove.length - 1; i >= 0; i--) {
    powerUps.splice(puToRemove[i], 1);
  }

  // ── Move lasers ──
  const laserToRemove: number[] = [];
  for (let i = 0; i < lasers.length; i++) {
    const l = lasers[i];
    l.y += l.vy;

    if (l.y < 0) {
      laserToRemove.push(i);
      continue;
    }

    // Hit blocks
    for (let j = blocks.length - 1; j >= 0; j--) {
      const block = blocks[j];
      const br = blockRect(block);
      if (
        l.x >= br.x &&
        l.x <= br.x + br.w &&
        l.y >= br.y &&
        l.y <= br.y + br.h
      ) {
        if (block.type !== "indestructible") {
          block.hp--;
          if (block.hp <= 0) {
            const cx = br.x + br.w / 2;
            const cy = br.y + br.h / 2;
            particles.push(...spawnParticles(cx, cy, block.color, 4));
            score += SCORE_BLOCK;
            blocks.splice(j, 1);
          }
        }
        laserToRemove.push(i);
        break;
      }
    }
  }
  for (let i = laserToRemove.length - 1; i >= 0; i--) {
    lasers.splice(laserToRemove[i], 1);
  }

  // ── Update particles ──
  for (let i = particles.length - 1; i >= 0; i--) {
    const part = particles[i];
    part.x += part.vx;
    part.y += part.vy;
    part.vy += 0.1; // gravity
    part.life--;
    if (part.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // ── Check ball loss ──
  let newStatus: GameStatus = state.status;
  let ballOnPaddle = state.ballOnPaddle;

  if (balls.length === 0 && !ballOnPaddle) {
    lives--;
    if (lives <= 0) {
      newStatus = "lost";
    } else {
      // Reset ball on paddle
      ballOnPaddle = true;
      balls = [
        {
          x: paddle.x + paddle.width / 2,
          y: PADDLE_Y - BALL_RADIUS - 1,
          vx: 0,
          vy: 0,
          radius: BALL_RADIUS,
          fireball: false,
        },
      ];
    }
  }

  // ── Check level clear ──
  const destructibleBlocks = blocks.filter((b) => b.type !== "indestructible");
  if (destructibleBlocks.length === 0 && newStatus === "playing") {
    // Perfect bonus if no lives lost during this level
    if (lives >= state.livesAtLevelStart) score += SCORE_PERFECT_BONUS;

    const nextLevel = state.level + 1;
    if (nextLevel >= TOTAL_LEVELS) {
      newStatus = "won";
    } else {
      // Load next level
      return loadLevel(
        { ...state, score, lives, activePowerUps: {}, particles },
        nextLevel
      );
    }
  }

  return {
    ...state,
    status: newStatus,
    score,
    lives,
    blocks,
    balls,
    paddle,
    powerUps,
    lasers,
    particles,
    activePowerUps,
    ballOnPaddle,
  };
}
