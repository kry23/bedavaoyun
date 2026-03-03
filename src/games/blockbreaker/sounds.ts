let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function wire(osc: OscillatorNode, gain: GainNode, dest: AudioNode): void {
  osc.connect(gain).connect(dest);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
}

/** Paddle hit — soft tick */
export function playPaddleHit(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    wire(osc, gain, ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  } catch { /* silent */ }
}

/** Block break — gentle tap */
export function playBlockBreak(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.025);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    wire(osc, gain, ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  } catch { /* silent */ }
}

/** TNT explosion — muffled thud */
export function playExplosion(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    wire(osc, gain, ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  } catch { /* silent */ }
}

/** Power-up collected — tiny two-note pip */
export function playPowerUp(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.setValueAtTime(800, t + 0.04);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    wire(osc, gain, ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  } catch { /* silent */ }
}

/** Ball lost — soft descending note */
export function playBallLost(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    wire(osc, gain, ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch { /* silent */ }
}

/** Level complete — subtle ascending two-note */
export function playLevelComplete(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(440, t);
    gain1.gain.setValueAtTime(0.07, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    wire(osc1, gain1, ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.1);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(660, t + 0.08);
    gain2.gain.setValueAtTime(0.07, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    wire(osc2, gain2, ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.2);
  } catch { /* silent */ }
}

export function resumeAudioContext(): void {
  if (audioCtx?.state === "suspended") {
    audioCtx.resume();
  }
}
