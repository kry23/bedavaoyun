import {
  FRUITS,
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  DANGER_LINE_Y,
  DROP_Y,
  type FruitDef,
  type WatermelonState,
} from "./types";
import type { MergeEffect } from "./engine";

interface Theme {
  bg: string;
  containerBg: string;
  containerBorder: string;
  dangerLine: string;
  dropGuide: string;
  text: string;
  textMuted: string;
  panelBg: string;
}

const LIGHT: Theme = {
  bg: "#FDF6E3",
  containerBg: "#FFF8E7",
  containerBorder: "#D4A574",
  dangerLine: "#FF4444",
  dropGuide: "rgba(0,0,0,0.12)",
  text: "#5D4037",
  textMuted: "#8D6E63",
  panelBg: "#F5E6D0",
};

const DARK: Theme = {
  bg: "#1a1510",
  containerBg: "#2C2418",
  containerBorder: "#6D5A3A",
  dangerLine: "#FF6666",
  dropGuide: "rgba(255,255,255,0.10)",
  text: "#D4A574",
  textMuted: "#A1887F",
  panelBg: "#3D3226",
};

function drawFruit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  def: FruitDef,
  scale: number,
  alpha = 1
): void {
  const r = def.radius * scale;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Drop shadow
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 8 * scale;
  ctx.shadowOffsetY = 3 * scale;

  // Dark border ring
  ctx.fillStyle = def.colorDark;
  ctx.beginPath();
  ctx.arc(x, y, r + 1.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "transparent";

  // Main body — two-stop radial from bright center to dark edge
  const bodyGrad = ctx.createRadialGradient(
    x - r * 0.2, y - r * 0.25, r * 0.1,
    x, y, r
  );
  bodyGrad.addColorStop(0, lightenColor(def.color, 50));
  bodyGrad.addColorStop(0.55, def.color);
  bodyGrad.addColorStop(1, def.colorDark);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Rim light — subtle lighter edge on top half for 3D depth
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  const rimGrad = ctx.createLinearGradient(x, y - r, x, y + r);
  rimGrad.addColorStop(0, "rgba(255,255,255,0.18)");
  rimGrad.addColorStop(0.45, "rgba(255,255,255,0)");
  rimGrad.addColorStop(0.55, "rgba(0,0,0,0)");
  rimGrad.addColorStop(1, "rgba(0,0,0,0.1)");
  ctx.fillStyle = rimGrad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();

  // Specular highlight — small, crisp, offset top-left
  const hlX = x - r * 0.28;
  const hlY = y - r * 0.32;
  const hlR = r * 0.35;
  const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlR);
  hlGrad.addColorStop(0, "rgba(255,255,255,0.75)");
  hlGrad.addColorStop(0.6, "rgba(255,255,255,0.2)");
  hlGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
  ctx.fill();

  // ── Kawaii face (unique per fruit) ──
  if (r >= 8) {
    drawKawaiFace(ctx, x, y, r, def.index);
  }

  ctx.restore();
}

/**
 * Draw a unique kawaii face per fruit index.
 * 0=cherry(shy) 1=strawberry(happy) 2=grape(sleepy) 3=orange(surprised)
 * 4=apple(wink) 5=pear(tongue) 6=peach(love-eyes) 7=pineapple(cool)
 * 8=melon(star-eyes) 9=watermelon(big-grin)
 */
function drawKawaiFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fruitIndex: number
): void {
  const eyeR = Math.max(1.5, r * 0.1);
  const sp = r * 0.28; // eye spacing
  const ey = y - r * 0.08; // eye Y
  const lw = Math.max(1, r * 0.04);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Helper: standard round eyes
  function drawRoundEyes(wink: "left" | "right" | "none" = "none") {
    ctx.fillStyle = "#2d1b00";
    if (wink === "left") {
      // left eye is a wink line
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw * 1.5;
      ctx.beginPath();
      ctx.arc(x - sp, ey, eyeR * 0.8, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(x - sp, ey, eyeR * 0.8, eyeR, 0, 0, Math.PI * 2);
      ctx.fill();
      // highlight
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x - sp + eyeR * 0.3, ey - eyeR * 0.35, eyeR * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#2d1b00";
    if (wink === "right") {
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw * 1.5;
      ctx.beginPath();
      ctx.arc(x + sp, ey, eyeR * 0.8, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(x + sp, ey, eyeR * 0.8, eyeR, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + sp + eyeR * 0.3, ey - eyeR * 0.35, eyeR * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Helper: blush cheeks
  function drawBlush() {
    if (r < 14) return;
    ctx.fillStyle = "rgba(255,120,150,0.3)";
    const by = y + r * 0.1;
    ctx.beginPath();
    ctx.arc(x - sp - eyeR * 1.2, by, eyeR * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + sp + eyeR * 1.2, by, eyeR * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Helper: simple smile
  function drawSmile(width = 0.22, bigness = 0.7) {
    const mY = y + r * 0.18;
    const mW = r * width;
    ctx.strokeStyle = "#2d1b00";
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(x, mY - r * 0.05, mW, Math.PI * (0.5 - bigness / 2), Math.PI * (0.5 + bigness / 2));
    ctx.stroke();
  }

  switch (fruitIndex) {
    case 0: {
      // Cherry — shy: small eyes looking down, tiny blush, small "o" mouth
      ctx.fillStyle = "#2d1b00";
      ctx.beginPath();
      ctx.ellipse(x - sp * 0.8, ey + eyeR * 0.3, eyeR * 0.6, eyeR * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + sp * 0.8, ey + eyeR * 0.3, eyeR * 0.6, eyeR * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      drawBlush();
      // tiny "o" mouth
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(x, y + r * 0.2, r * 0.08, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 1: {
      // Strawberry — happy: normal eyes, wide smile, blush
      drawRoundEyes();
      drawBlush();
      drawSmile(0.26, 0.8);
      break;
    }
    case 2: {
      // Grape — sleepy: half-closed eyes (arcs), relaxed smile
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw * 1.8;
      ctx.beginPath();
      ctx.arc(x - sp, ey, eyeR, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + sp, ey, eyeR, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      drawBlush();
      drawSmile(0.18, 0.6);
      break;
    }
    case 3: {
      // Orange — surprised: big round eyes, "O" mouth
      ctx.fillStyle = "#2d1b00";
      ctx.beginPath();
      ctx.arc(x - sp, ey, eyeR * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x - sp + eyeR * 0.25, ey - eyeR * 0.3, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2d1b00";
      ctx.beginPath();
      ctx.arc(x + sp, ey, eyeR * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + sp + eyeR * 0.25, ey - eyeR * 0.3, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      // "O" mouth
      ctx.fillStyle = "#2d1b00";
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.22, r * 0.1, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 4: {
      // Apple — wink: left eye winks, cheeky smile
      drawRoundEyes("left");
      drawBlush();
      // cheeky smile tilted
      const mY = y + r * 0.18;
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(x + r * 0.03, mY - r * 0.05, r * 0.24, Math.PI * 0.1, Math.PI * 0.8);
      ctx.stroke();
      break;
    }
    case 5: {
      // Pear — tongue out: happy eyes, smile with tongue
      drawRoundEyes();
      drawBlush();
      // open smile
      const mY5 = y + r * 0.16;
      const mW5 = r * 0.2;
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(x, mY5, mW5, Math.PI * 0.05, Math.PI * 0.95);
      ctx.stroke();
      // tongue
      ctx.fillStyle = "#FF8A9E";
      ctx.beginPath();
      ctx.ellipse(x, mY5 + r * 0.08, r * 0.09, r * 0.07, 0, 0, Math.PI);
      ctx.fill();
      break;
    }
    case 6: {
      // Peach — love eyes: heart-shaped eyes, sweet smile
      drawBlush();
      // heart eyes
      ctx.fillStyle = "#E91E63";
      for (const sx of [-1, 1]) {
        const hx = x + sp * sx;
        const hy = ey;
        const hs = eyeR * 0.8;
        ctx.beginPath();
        ctx.moveTo(hx, hy + hs * 0.6);
        ctx.bezierCurveTo(hx - hs, hy - hs * 0.2, hx - hs * 0.5, hy - hs * 1.1, hx, hy - hs * 0.4);
        ctx.bezierCurveTo(hx + hs * 0.5, hy - hs * 1.1, hx + hs, hy - hs * 0.2, hx, hy + hs * 0.6);
        ctx.fill();
      }
      drawSmile(0.22, 0.7);
      break;
    }
    case 7: {
      // Pineapple — cool: flat line eyes (confident), smirk
      ctx.strokeStyle = "#2d1b00";
      ctx.lineWidth = lw * 2;
      // flat confident eyes
      ctx.beginPath();
      ctx.moveTo(x - sp - eyeR, ey);
      ctx.lineTo(x - sp + eyeR, ey);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + sp - eyeR, ey);
      ctx.lineTo(x + sp + eyeR, ey);
      ctx.stroke();
      // smirk — asymmetric smile
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.12, y + r * 0.18);
      ctx.quadraticCurveTo(x + r * 0.05, y + r * 0.26, x + r * 0.18, y + r * 0.15);
      ctx.stroke();
      break;
    }
    case 8: {
      // Melon — star eyes: star-shaped eyes, big grin
      ctx.fillStyle = "#FFD700";
      for (const sx of [-1, 1]) {
        drawStar(ctx, x + sp * sx, ey, eyeR * 1.2, 5);
      }
      drawBlush();
      // big grin
      const mY8 = y + r * 0.15;
      const mW8 = r * 0.28;
      ctx.fillStyle = "#2d1b00";
      ctx.beginPath();
      ctx.arc(x, mY8, mW8, 0, Math.PI);
      ctx.fill();
      // teeth
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - mW8 * 0.6, mY8, mW8 * 1.2, r * 0.05);
      break;
    }
    case 9: {
      // Watermelon — big sparkle grin: extra happy, sparkles
      drawRoundEyes();
      drawBlush();
      // huge grin
      const mY9 = y + r * 0.13;
      const mW9 = r * 0.32;
      ctx.fillStyle = "#2d1b00";
      ctx.beginPath();
      ctx.arc(x, mY9, mW9, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - mW9 * 0.7, mY9, mW9 * 1.4, r * 0.06);
      // sparkles around
      ctx.fillStyle = "#FFD700";
      const sparkleR = r * 0.06;
      drawStar(ctx, x - r * 0.42, ey - r * 0.25, sparkleR, 4);
      drawStar(ctx, x + r * 0.45, ey - r * 0.2, sparkleR * 0.8, 4);
      drawStar(ctx, x + r * 0.1, ey - r * 0.42, sparkleR * 0.6, 4);
      break;
    }
    default: {
      drawRoundEyes();
      drawBlush();
      drawSmile();
    }
  }
}

/** Draw a small star shape */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  points: number
): void {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.4;
    const px = cx + Math.cos(angle) * rad;
    const py = cy + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Lighten a hex color by a percentage amount */
function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r2 = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r2},${g},${b})`;
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  fruitBodies: Array<{ position: { x: number; y: number }; fruitIndex?: number }>,
  state: WatermelonState,
  isDark: boolean,
  nextLabel: string,
  mergeEffects: MergeEffect[] = []
): void {
  const theme = isDark ? DARK : LIGHT;

  const topPadding = 80;
  const sidePadding = 8;
  const availW = canvasW - sidePadding * 2;
  const availH = canvasH - topPadding - sidePadding;
  const scale = Math.min(availW / CONTAINER_WIDTH, availH / CONTAINER_HEIGHT);
  const offsetX = (canvasW - CONTAINER_WIDTH * scale) / 2;
  const offsetY = topPadding;

  // Clear
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // ── Score (top left) ──
  ctx.fillStyle = theme.panelBg;
  roundRect(ctx, 12, 10, 100, 34, 8);
  ctx.fill();
  ctx.fillStyle = theme.text;
  ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${state.score}`, 62, 27);

  // ── Next fruit (top right) ──
  const nextDef = FRUITS[state.nextFruitIndex];
  ctx.fillStyle = theme.panelBg;
  roundRect(ctx, canvasW - 102, 10, 90, 34, 8);
  ctx.fill();
  ctx.fillStyle = theme.textMuted;
  ctx.font = "11px 'Segoe UI', system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(nextLabel, canvasW - 94, 27);
  ctx.font = "22px serif";
  ctx.textAlign = "center";
  ctx.fillText(nextDef.emoji, canvasW - 30, 27);

  // ── Fruit progression (between score and next) ──
  const progStartX = 130;
  const progEndX = canvasW - 115;
  const progY = 57;
  const progCount = FRUITS.length;
  const progSpacing = (progEndX - progStartX) / (progCount - 1);
  for (let i = 0; i < progCount; i++) {
    const px = progStartX + i * progSpacing;
    ctx.font = `${11 + i * 0.8}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(FRUITS[i].emoji, px, progY);
  }

  // ── Container ──
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Background
  ctx.fillStyle = theme.containerBg;
  ctx.strokeStyle = theme.containerBorder;
  ctx.lineWidth = 3;
  roundRect(ctx, 0, 0, CONTAINER_WIDTH * scale, CONTAINER_HEIGHT * scale, 6);
  ctx.fill();
  ctx.stroke();

  // Danger line
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = theme.dangerLine;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, DANGER_LINE_Y * scale);
  ctx.lineTo(CONTAINER_WIDTH * scale, DANGER_LINE_Y * scale);
  ctx.stroke();
  ctx.restore();

  // Drop guide + preview fruit (always visible when not lost, dimmer during cooldown)
  if (state.status !== "lost") {
    const guideX = state.dropX * scale;
    const previewAlpha = state.canDrop ? 0.85 : 0.35;

    // Guide line
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = theme.dropGuide;
    ctx.lineWidth = 1;
    ctx.globalAlpha = state.canDrop ? 1 : 0.4;
    ctx.beginPath();
    ctx.moveTo(guideX, DROP_Y * scale);
    ctx.lineTo(guideX, CONTAINER_HEIGHT * scale);
    ctx.stroke();
    ctx.restore();

    // Preview fruit
    const currentDef = FRUITS[state.currentFruitIndex];
    drawFruit(ctx, guideX, DROP_Y * scale, currentDef, scale, previewAlpha);
  }

  // Active fruits
  for (const body of fruitBodies) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fi = (body as any).fruitIndex as number | undefined;
    if (fi === undefined) continue;
    const def = FRUITS[fi];
    drawFruit(ctx, body.position.x * scale, body.position.y * scale, def, scale);
  }

  // Merge effects
  for (const fx of mergeEffects) {
    drawMergeEffect(ctx, fx.x * scale, fx.y * scale, fx.radius * scale, fx.color, fx.t);
  }

  ctx.restore();
}

function drawMergeEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  t: number
): void {
  ctx.save();

  // Ease-out curve for smoother animation
  const ease = 1 - (1 - t) * (1 - t);

  // Soft glow — large color-matched radial
  if (t < 0.6) {
    const glowAlpha = (1 - t / 0.6) * 0.35;
    const glowR = radius * (1.5 + ease * 2);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    glow.addColorStop(0, colorWithAlpha(color, glowAlpha));
    glow.addColorStop(0.5, colorWithAlpha(color, glowAlpha * 0.3));
    glow.addColorStop(1, colorWithAlpha(color, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  // White flash burst — quick bright center
  if (t < 0.3) {
    const flashAlpha = (1 - t / 0.3) * 0.6;
    const flashR = radius * (0.8 + t * 3);
    const flash = ctx.createRadialGradient(x, y, 0, x, y, flashR);
    flash.addColorStop(0, `rgba(255,255,255,${flashAlpha})`);
    flash.addColorStop(0.4, `rgba(255,255,255,${flashAlpha * 0.3})`);
    flash.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(x, y, flashR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Expanding ring — thick, soft-edged
  const ringR = radius * (0.8 + ease * 2.2);
  const ringAlpha = (1 - ease) * 0.7;
  const ringW = Math.max(2, radius * 0.15 * (1 - ease));
  ctx.globalAlpha = ringAlpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = ringW;
  ctx.beginPath();
  ctx.arc(x, y, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Second thinner ring — delayed
  if (t > 0.1) {
    const t2 = (t - 0.1) / 0.9;
    const ease2 = 1 - (1 - t2) * (1 - t2);
    const r2 = radius * (0.6 + ease2 * 1.8);
    ctx.globalAlpha = (1 - ease2) * 0.4;
    ctx.lineWidth = Math.max(1, ringW * 0.5);
    ctx.beginPath();
    ctx.arc(x, y, r2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Sparkle particles — 6 stars flying outward
  const sparkleCount = 6;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (Math.PI * 2 * i) / sparkleCount + 0.3;
    const dist = radius * (0.3 + ease * 3);
    const px = x + Math.cos(angle) * dist;
    const py = y + Math.sin(angle) * dist;
    const sr = Math.max(1.5, radius * 0.08 * (1 - ease));
    ctx.globalAlpha = (1 - ease) * 0.8;
    ctx.fillStyle = "#fff";
    drawStar(ctx, px, py, sr, 4);
    // Color dot behind each star
    ctx.fillStyle = color;
    ctx.globalAlpha = (1 - ease) * 0.5;
    ctx.beginPath();
    ctx.arc(px, py, sr * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/** Convert hex color to rgba string */
function colorWithAlpha(hex: string, alpha: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
