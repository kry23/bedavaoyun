import type { BlockBreakerState, Block, Ball, Particle, PowerUp, Laser } from "./types";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  BLOCK_PAD,
  BLOCK_OFFSET_X,
  BLOCK_OFFSET_Y,
  POWERUP_SIZE,
  ROW_COLORS_DARK,
} from "./types";

/* ── Color themes ──────────────────────────────────────── */

const THEME = {
  light: {
    bg: "#1a1a2e",
    hudText: "#FFFFFF",
    hudDim: "#888888",
    paddleColor: "#FFFFFF",
    ballColor: "#FFFFFF",
    fireballColor: "#FF6600",
    shieldColor: "rgba(100,200,255,0.3)",
    laserColor: "#FF3333",
    lifeActive: "#FFFFFF",
    lifeLost: "#444466",
  },
  dark: {
    bg: "#0e0e1a",
    hudText: "#FFFFFF",
    hudDim: "#666688",
    paddleColor: "#E0E0E0",
    ballColor: "#FFFFFF",
    fireballColor: "#FF8800",
    shieldColor: "rgba(80,160,255,0.25)",
    laserColor: "#FF4444",
    lifeActive: "#E0E0E0",
    lifeLost: "#333355",
  },
};

/* ── Block rect helper ────────────────────────────────── */

function blockX(col: number) {
  return BLOCK_OFFSET_X + col * (BLOCK_WIDTH + BLOCK_PAD);
}
function blockY(row: number) {
  return BLOCK_OFFSET_Y + row * (BLOCK_HEIGHT + BLOCK_PAD);
}

/* ── Draw blocks ──────────────────────────────────────── */

function drawBlock(ctx: CanvasRenderingContext2D, block: Block, sx: number, sy: number) {
  const bx = sx + blockX(block.col);
  const by = sy + blockY(block.row);
  const w = BLOCK_WIDTH;
  const h = BLOCK_HEIGHT;
  const r = 4; // border radius

  // Rounded rect path
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + w - r, by);
  ctx.quadraticCurveTo(bx + w, by, bx + w, by + r);
  ctx.lineTo(bx + w, by + h - r);
  ctx.quadraticCurveTo(bx + w, by + h, bx + w - r, by + h);
  ctx.lineTo(bx + r, by + h);
  ctx.quadraticCurveTo(bx, by + h, bx, by + h - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath();

  // Fill
  ctx.fillStyle = block.color;
  ctx.fill();

  // Top highlight
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(bx, by, w, h / 3);
  ctx.restore();

  // Brick hatching for multi-hit blocks
  if (block.type === "brick" && block.hp > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + w - r, by);
    ctx.quadraticCurveTo(bx + w, by, bx + w, by + r);
    ctx.lineTo(bx + w, by + h - r);
    ctx.quadraticCurveTo(bx + w, by + h, bx + w - r, by + h);
    ctx.lineTo(bx + r, by + h);
    ctx.quadraticCurveTo(bx, by + h, bx, by + h - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = ROW_COLORS_DARK[block.row % ROW_COLORS_DARK.length];
    ctx.lineWidth = 1.5;
    for (let i = -w; i < w + h; i += 8) {
      ctx.beginPath();
      ctx.moveTo(bx + i, by);
      ctx.lineTo(bx + i + h, by + h);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Special block icons
  const cx = bx + w / 2;
  const cy = by + h / 2;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (block.type) {
    case "tnt":
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 9px monospace";
      ctx.fillText("TNT", cx, cy);
      break;
    case "powerup":
      ctx.fillText("+", cx, cy);
      break;
    case "heart":
      ctx.fillText("\u2764", cx, cy); // heart symbol
      break;
    case "indestructible":
      // Darker overlay
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + w - r, by);
      ctx.quadraticCurveTo(bx + w, by, bx + w, by + r);
      ctx.lineTo(bx + w, by + h - r);
      ctx.quadraticCurveTo(bx + w, by + h, bx + w - r, by + h);
      ctx.lineTo(bx + r, by + h);
      ctx.quadraticCurveTo(bx, by + h, bx, by + h - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.fill();
      // Dashed border
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + w - r, by);
      ctx.quadraticCurveTo(bx + w, by, bx + w, by + r);
      ctx.lineTo(bx + w, by + h - r);
      ctx.quadraticCurveTo(bx + w, by + h, bx + w - r, by + h);
      ctx.lineTo(bx + r, by + h);
      ctx.quadraticCurveTo(bx, by + h, bx, by + h - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      break;
  }
}

/* ── Draw ball ────────────────────────────────────────── */

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball, sx: number, sy: number, colors: typeof THEME.light) {
  const x = sx + ball.x;
  const y = sy + ball.y;
  const r = ball.radius;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);

  if (ball.fireball) {
    // Fireball glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    glow.addColorStop(0, colors.fireballColor);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = colors.fireballColor;
    ctx.fill();
  } else {
    ctx.fillStyle = colors.ballColor;
    ctx.fill();
  }

  // Specular
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill();
}

/* ── Draw paddle ──────────────────────────────────────── */

function drawPaddle(ctx: CanvasRenderingContext2D, state: BlockBreakerState, sx: number, sy: number, colors: typeof THEME.light) {
  const p = state.paddle;
  const x = sx + p.x;
  const y = sy + p.y;
  const w = p.width;
  const h = p.height;
  const r = h / 2;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fillStyle = colors.paddleColor;
  ctx.fill();

  // Laser indicator
  if (state.activePowerUps.laser && state.activePowerUps.laser > Date.now()) {
    ctx.fillStyle = colors.laserColor;
    ctx.beginPath();
    ctx.arc(x + 4, y + r, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 4, y + r, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── Draw power-ups ───────────────────────────────────── */

function drawPowerUp(ctx: CanvasRenderingContext2D, pu: PowerUp, sx: number, sy: number) {
  const x = sx + pu.x;
  const y = sy + pu.y;
  const s = POWERUP_SIZE;

  // Background circle
  const colors: Record<string, string> = {
    wide: "#4CAF50",
    multi: "#FF9800",
    fireball: "#FF5722",
    laser: "#F44336",
    shield: "#2196F3",
    heart: "#E91E63",
  };

  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI * 2);
  ctx.fillStyle = colors[pu.type] ?? "#FFFFFF";
  ctx.fill();

  // Icon
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const icons: Record<string, string> = {
    wide: "\u2194",   // ↔
    multi: "3x",
    fireball: "\u2605", // ★
    laser: "\u2191",  // ↑
    shield: "\u2B21", // ⬡
    heart: "\u2764",  // ❤
  };
  ctx.fillText(icons[pu.type] ?? "?", x, y);
}

/* ── Draw laser ───────────────────────────────────────── */

function drawLaser(ctx: CanvasRenderingContext2D, laser: Laser, sx: number, sy: number, colors: typeof THEME.light) {
  const x = sx + laser.x;
  const y = sy + laser.y;
  ctx.fillStyle = colors.laserColor;
  ctx.fillRect(x - 1.5, y, 3, 10);

  // Glow
  ctx.fillStyle = "rgba(255,100,100,0.3)";
  ctx.fillRect(x - 3, y, 6, 10);
}

/* ── Draw particles ───────────────────────────────────── */

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], sx: number, sy: number) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(sx + p.x - p.size / 2, sy + p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

/* ── Draw HUD ─────────────────────────────────────────── */

function drawHUD(
  ctx: CanvasRenderingContext2D,
  state: BlockBreakerState,
  sx: number,
  sy: number,
  colors: typeof THEME.light
) {
  const hudY = sy + 12;
  const hudH = 30;

  // Lives (circles)
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(sx + 20 + i * 22, hudY + hudH / 2, 7, 0, Math.PI * 2);
    if (i < state.lives) {
      ctx.fillStyle = colors.lifeActive;
      ctx.fill();
    } else {
      ctx.strokeStyle = colors.lifeLost;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Score (center)
  ctx.fillStyle = colors.hudText;
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const scoreStr = String(state.score).padStart(5, "0");
  ctx.fillText(scoreStr, sx + GAME_WIDTH / 2, hudY + hudH / 2);

  // Level (right)
  ctx.fillStyle = colors.hudDim;
  ctx.font = "12px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`LV ${state.level + 1}`, sx + GAME_WIDTH - 15, hudY + hudH / 2);
}

/* ── Shield bar ───────────────────────────────────────── */

function drawShield(ctx: CanvasRenderingContext2D, sx: number, sy: number, colors: typeof THEME.light) {
  ctx.fillStyle = colors.shieldColor;
  ctx.fillRect(sx, sy + GAME_HEIGHT - 4, GAME_WIDTH, 4);

  // Glow
  const glow = ctx.createLinearGradient(sx, sy + GAME_HEIGHT - 10, sx, sy + GAME_HEIGHT);
  glow.addColorStop(0, "transparent");
  glow.addColorStop(1, "rgba(100,200,255,0.2)");
  ctx.fillStyle = glow;
  ctx.fillRect(sx, sy + GAME_HEIGHT - 10, GAME_WIDTH, 10);
}

/* ── Main render ──────────────────────────────────────── */

export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  state: BlockBreakerState,
  isDark: boolean
) {
  const colors = isDark ? THEME.dark : THEME.light;

  // Scale to fit canvas
  const scaleX = canvasW / GAME_WIDTH;
  const scaleY = canvasH / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  const sx = (canvasW - GAME_WIDTH * scale) / 2;
  const sy = (canvasH - GAME_HEIGHT * scale) / 2;

  ctx.clearRect(0, 0, canvasW, canvasH);

  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw everything relative to (0,0)
  drawHUD(ctx, state, 0, 0, colors);

  // Blocks
  for (const block of state.blocks) {
    drawBlock(ctx, block, 0, 0);
  }

  // Power-ups
  for (const pu of state.powerUps) {
    drawPowerUp(ctx, pu, 0, 0);
  }

  // Lasers
  for (const l of state.lasers) {
    drawLaser(ctx, l, 0, 0, colors);
  }

  // Shield
  if (state.activePowerUps.shield && state.activePowerUps.shield > Date.now()) {
    drawShield(ctx, 0, 0, colors);
  }

  // Paddle
  drawPaddle(ctx, state, 0, 0, colors);

  // Balls
  for (const ball of state.balls) {
    drawBall(ctx, ball, 0, 0, colors);
  }

  // Particles
  drawParticles(ctx, state.particles, 0, 0);

  // Idle overlay
  if (state.status === "idle") {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";

    if (state.level > 0) {
      ctx.fillText(`LEVEL ${state.level + 1}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 14);
    }
    ctx.fillText("CLICK TO START", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 8);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px monospace";
    ctx.fillText("\u2190 \u2192  MOVE PADDLE", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 38);
    ctx.fillText("CLICK / SPACE  LAUNCH", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 56);
  }

  // Ball on paddle indicator
  if (state.ballOnPaddle && state.status === "playing") {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("CLICK TO LAUNCH", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
  }

  // Paused overlay
  if (state.status === "paused") {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("PRESS P TO CONTINUE", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
  }

  ctx.restore();
}
