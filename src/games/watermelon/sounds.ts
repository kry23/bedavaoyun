let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Connect osc→gain→destination, auto-disconnect on stop */
function wire(osc: OscillatorNode, gain: GainNode, dest: AudioNode): void {
  osc.connect(gain).connect(dest);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
}

/** Soft "pop" when a fruit is dropped */
export function playDropSound(): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    wire(osc, gain, ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  } catch {
    // Silently fail if audio is blocked
  }
}

/** Cute bubbly "pling" when fruits merge — musical notes that rise with fruit level */
export function playMergeSound(fruitIndex: number): void {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Pentatonic scale notes for a cute, musical feel
    const notes = [523, 587, 659, 784, 880, 988, 1047, 1175, 1319, 1480];
    const baseFreq = notes[Math.min(fruitIndex, notes.length - 1)];

    // Main "pling" — ascending two-note chirp
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(baseFreq * 0.8, t);
    osc1.frequency.setValueAtTime(baseFreq, t + 0.06);
    osc1.frequency.setValueAtTime(baseFreq * 1.2, t + 0.12);
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.setValueAtTime(0.25, t + 0.06);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    wire(osc1, gain1, ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.35);

    // Sparkle overtone — high sine shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(baseFreq * 2, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, t + 0.2);
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.1, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    wire(osc2, gain2, ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.25);

    // Bubble pop — tiny noise burst for texture
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(baseFreq * 3, t);
    osc3.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.05);
    gain3.gain.setValueAtTime(0.08, t);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    wire(osc3, gain3, ctx.destination);
    osc3.start(t);
    osc3.stop(t + 0.06);
  } catch {
    // Silently fail if audio is blocked
  }
}

export function resumeAudioContext(): void {
  if (audioCtx?.state === "suspended") {
    audioCtx.resume();
  }
}
