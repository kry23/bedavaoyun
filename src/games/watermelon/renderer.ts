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
  bg: "#E8F5A3",
  containerBg: "#D4E157",
  containerBorder: "#A0B840",
  dangerLine: "#FF5252",
  dropGuide: "rgba(0,0,0,0.10)",
  text: "#33691E",
  textMuted: "#689F38",
  panelBg: "#C5E1A5",
};

const DARK: Theme = {
  bg: "#1B2A1B",
  containerBg: "#2A3A2A",
  containerBorder: "#4A6A3A",
  dangerLine: "#FF6666",
  dropGuide: "rgba(255,255,255,0.10)",
  text: "#A5D6A7",
  textMuted: "#81C784",
  panelBg: "#2E4A2E",
};

function drawFruit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  def: FruitDef,
  scale: number,
  alpha = 1,
  angle = 0
): void {
  const r = def.radius * scale;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Drop shadow
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetY = 3 * scale;

  // Thick colored border — bold cartoon/sticker look
  const borderW = Math.max(2.5, r * 0.08);
  ctx.fillStyle = def.colorDark;
  ctx.beginPath();
  ctx.arc(x, y, r + borderW, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "transparent";

  // Main body — simple, clean 3-stop radial gradient
  const bodyGrad = ctx.createRadialGradient(
    x - r * 0.2, y - r * 0.25, r * 0.05,
    x, y, r
  );
  bodyGrad.addColorStop(0, lightenColor(def.color, 80));
  bodyGrad.addColorStop(0.6, def.color);
  bodyGrad.addColorStop(1, def.colorDark);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // ── Rotated elements (texture, highlight, leaf, face) ──
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Fruit-specific texture
  drawFruitTexture(ctx, 0, 0, r, def.index);

  // Specular highlight — small, crisp, upper-left (candy style)
  const hlX = -r * 0.28;
  const hlY = -r * 0.3;
  const hlR = r * 0.22;
  const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlR);
  hlGrad.addColorStop(0, "rgba(255,255,255,0.92)");
  hlGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
  ctx.fill();

  // Leaf on top
  if (r >= 6) {
    drawLeaf(ctx, 0, -r, r);
  }

  // Kawaii face
  if (r >= 8) {
    drawKawaiFace(ctx, 0, 0, r, def.index);
  }

  ctx.restore(); // end rotation
  ctx.restore(); // end alpha/shadow
}

/** Draw an organic teardrop leaf on top of the fruit */
function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  r: number
): void {
  const stemH = r * 0.12;
  const leafSize = r * 0.3;

  ctx.save();

  // Stem
  ctx.strokeStyle = "#6D4C41";
  ctx.lineWidth = Math.max(1.5, r * 0.06);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, topY + r * 0.02);
  ctx.lineTo(x, topY - stemH);
  ctx.stroke();

  // Leaf — organic teardrop via bezier curves
  ctx.fillStyle = "#66BB6A";
  ctx.beginPath();
  ctx.moveTo(x, topY - stemH);
  ctx.bezierCurveTo(
    x - leafSize * 0.6, topY - stemH - leafSize * 0.3,
    x - leafSize * 0.2, topY - stemH - leafSize * 0.9,
    x + leafSize * 0.5, topY - stemH - leafSize * 0.4
  );
  ctx.bezierCurveTo(
    x + leafSize * 0.3, topY - stemH - leafSize * 0.1,
    x + leafSize * 0.1, topY - stemH,
    x, topY - stemH
  );
  ctx.fill();

  ctx.restore();
}

/** Draw fruit-specific surface texture */
function drawFruitTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fruitIndex: number
): void {
  ctx.save();
  // Clip to fruit circle
  ctx.beginPath();
  ctx.arc(x, y, r * 0.92, 0, Math.PI * 2);
  ctx.clip();

  switch (fruitIndex) {
    case 0: {
      // Cherry — small scattered dots
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      const dots0 = [[0.2, -0.1], [-0.3, 0.2], [0.1, 0.35], [-0.15, -0.3], [0.35, 0.15]];
      for (const [dx, dy] of dots0) {
        ctx.beginPath();
        ctx.arc(x + r * dx, y + r * dy, r * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 1: {
      // Strawberry — seed dots
      ctx.fillStyle = "rgba(255,255,200,0.4)";
      const seeds = [
        [-0.25, -0.15], [0.0, -0.25], [0.25, -0.1],
        [-0.35, 0.1], [-0.1, 0.05], [0.15, 0.1], [0.35, 0.05],
        [-0.2, 0.3], [0.05, 0.28], [0.28, 0.25],
        [-0.1, 0.48], [0.15, 0.45],
      ];
      for (const [dx, dy] of seeds) {
        ctx.beginPath();
        ctx.ellipse(x + r * dx, y + r * dy, r * 0.035, r * 0.05, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 2: {
      // Grape — subtle sheen stripes
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = r * 0.08;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(x + r * 0.6, y, r * (0.5 + i * 0.2), Math.PI * 0.6, Math.PI * 1.4);
        ctx.stroke();
      }
      break;
    }
    case 3: {
      // Orange — dimpled texture (subtle bumps)
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20 + (i % 2) * 0.15;
        const dist = r * (0.25 + (i % 3) * 0.2);
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, r * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 4: {
      // Apple — subtle vertical sheen lines
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = r * 0.04;
      for (let i = -3; i <= 3; i++) {
        const cx = x + i * r * 0.15;
        ctx.beginPath();
        ctx.moveTo(cx, y - r * 0.7);
        ctx.quadraticCurveTo(cx + i * r * 0.05, y, cx, y + r * 0.7);
        ctx.stroke();
      }
      break;
    }
    case 5: {
      // Pear — speckles
      ctx.fillStyle = "rgba(100,80,0,0.08)";
      for (let i = 0; i < 15; i++) {
        const angle = Math.PI * 2 * i / 15;
        const dist = r * (0.3 + (i % 4) * 0.15);
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, r * 0.025, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 6: {
      // Peach — soft blush area
      const blush = ctx.createRadialGradient(x - r * 0.1, y + r * 0.1, 0, x - r * 0.1, y + r * 0.1, r * 0.6);
      blush.addColorStop(0, "rgba(255,100,100,0.12)");
      blush.addColorStop(1, "rgba(255,100,100,0)");
      ctx.fillStyle = blush;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      break;
    }
    case 7: {
      // Pineapple — cross-hatch diamond pattern
      ctx.strokeStyle = "rgba(180,120,0,0.15)";
      ctx.lineWidth = r * 0.025;
      for (let i = -4; i <= 4; i++) {
        const off = i * r * 0.25;
        ctx.beginPath();
        ctx.moveTo(x + off - r, y - r);
        ctx.lineTo(x + off + r, y + r);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + off + r, y - r);
        ctx.lineTo(x + off - r, y + r);
        ctx.stroke();
      }
      break;
    }
    case 8: {
      // Melon — curved rind lines
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = r * 0.03;
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + Math.cos(angle + 0.2) * r * 0.7,
          y + Math.sin(angle + 0.2) * r * 0.7,
          x + Math.cos(angle) * r * 0.9,
          y + Math.sin(angle) * r * 0.9
        );
        ctx.stroke();
      }
      break;
    }
    case 9: {
      // Watermelon — stripes
      ctx.strokeStyle = "rgba(0,80,0,0.15)";
      ctx.lineWidth = r * 0.08;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * r * 0.1, y + Math.sin(angle) * r * 0.1);
        ctx.lineTo(x + Math.cos(angle) * r * 0.85, y + Math.sin(angle) * r * 0.85);
        ctx.stroke();
      }
      break;
    }
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
  const eyeR = Math.max(1.8, r * 0.13);
  const sp = r * 0.28; // eye spacing
  const ey = y - r * 0.08; // eye Y
  const lw = Math.max(1, r * 0.04);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Helper: standard round eyes
  function drawRoundEyes(wink: "left" | "right" | "none" = "none") {
    ctx.fillStyle = "#5D3A1A";
    if (wink === "left") {
      // left eye is a wink line
      ctx.strokeStyle = "#5D3A1A";
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
    ctx.fillStyle = "#5D3A1A";
    if (wink === "right") {
      ctx.strokeStyle = "#5D3A1A";
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
    ctx.strokeStyle = "#5D3A1A";
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(x, mY - r * 0.05, mW, Math.PI * (0.5 - bigness / 2), Math.PI * (0.5 + bigness / 2));
    ctx.stroke();
  }

  switch (fruitIndex) {
    case 0: {
      // Cherry — shy: small eyes looking down, tiny blush, small "o" mouth
      ctx.fillStyle = "#5D3A1A";
      ctx.beginPath();
      ctx.ellipse(x - sp * 0.8, ey + eyeR * 0.3, eyeR * 0.6, eyeR * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + sp * 0.8, ey + eyeR * 0.3, eyeR * 0.6, eyeR * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      drawBlush();
      // tiny "o" mouth
      ctx.strokeStyle = "#5D3A1A";
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
      ctx.strokeStyle = "#5D3A1A";
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
      ctx.fillStyle = "#5D3A1A";
      ctx.beginPath();
      ctx.arc(x - sp, ey, eyeR * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x - sp + eyeR * 0.25, ey - eyeR * 0.3, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5D3A1A";
      ctx.beginPath();
      ctx.arc(x + sp, ey, eyeR * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + sp + eyeR * 0.25, ey - eyeR * 0.3, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      // "O" mouth
      ctx.fillStyle = "#5D3A1A";
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
      ctx.strokeStyle = "#5D3A1A";
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
      ctx.strokeStyle = "#5D3A1A";
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
      ctx.strokeStyle = "#5D3A1A";
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
      ctx.fillStyle = "#5D3A1A";
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
      ctx.fillStyle = "#5D3A1A";
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
  fruitBodies: Array<{ position: { x: number; y: number }; angle?: number; fruitIndex?: number }>,
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
    const unlocked = i <= state.maxFruitIndex;
    const isCurrent = i === state.maxFruitIndex && state.maxFruitIndex > 0;
    const fontSize = 11 + i * 0.8;

    ctx.save();

    // Dim locked fruits
    if (!unlocked) ctx.globalAlpha = 0.25;

    // Highlight ring behind current max fruit
    if (isCurrent) {
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)";
      ctx.beginPath();
      ctx.arc(px, progY, fontSize * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(FRUITS[i].emoji, px, progY);

    ctx.restore();
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

  // Floor bar — gold/yellow ground plane at bottom
  const floorH = 6 * scale;
  ctx.fillStyle = isDark ? "#5A6A3A" : "#C8B43C";
  ctx.fillRect(2, CONTAINER_HEIGHT * scale - floorH, CONTAINER_WIDTH * scale - 4, floorH);

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
    drawFruit(ctx, body.position.x * scale, body.position.y * scale, def, scale, 1, (body as any).angle ?? 0);
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
