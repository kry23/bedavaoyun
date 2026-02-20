// Generate simple WAV sound effects (no dependencies needed)
// WAV format: simpler than MP3, universally supported
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;

function createWavBuffer(samples) {
  const numSamples = samples.length;
  const byteRate = SAMPLE_RATE * 2; // 16-bit mono
  const blockAlign = 2;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20);  // PCM
  buffer.writeUInt16LE(1, 22);  // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 30);
  buffer.writeUInt16LE(16, 32); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }

  return buffer;
}

// Click sound: short blip (50ms)
function generateClick() {
  const duration = 0.05;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = 1 - t / duration;
    samples[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.5;
  }
  return createWavBuffer(samples);
}

// Win sound: ascending arpeggio (600ms)
function generateWin() {
  const duration = 0.6;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  const noteLen = duration / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const noteIndex = Math.min(Math.floor(t / noteLen), notes.length - 1);
    const noteT = t - noteIndex * noteLen;
    const envelope = Math.max(0, 1 - noteT / noteLen) * (1 - t / duration);
    samples[i] = Math.sin(2 * Math.PI * notes[noteIndex] * t) * envelope * 0.4;
  }
  return createWavBuffer(samples);
}

// Lose sound: descending tones (400ms)
function generateLose() {
  const duration = 0.4;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  const notes = [400, 300, 200]; // descending
  const noteLen = duration / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const noteIndex = Math.min(Math.floor(t / noteLen), notes.length - 1);
    const noteT = t - noteIndex * noteLen;
    const envelope = Math.max(0, 1 - noteT / noteLen) * 0.8;
    samples[i] = (Math.sin(2 * Math.PI * notes[noteIndex] * t) * 0.6 +
                  Math.sin(2 * Math.PI * notes[noteIndex] * 1.5 * t) * 0.2) * envelope;
  }
  return createWavBuffer(samples);
}

// Flag sound: quick double beep (150ms)
function generateFlag() {
  const duration = 0.15;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const half = duration / 2;
    const inFirst = t < half * 0.8;
    const inSecond = t > half && t < duration * 0.9;
    const active = inFirst || inSecond;
    const envelope = active ? (1 - (t % half) / half) : 0;
    const freq = inSecond ? 1200 : 900;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.35;
  }
  return createWavBuffer(samples);
}

const outDir = path.join(__dirname, '..', 'public', 'sounds');

const sounds = {
  'click.wav': generateClick(),
  'win.wav': generateWin(),
  'lose.wav': generateLose(),
  'flag.wav': generateFlag(),
};

for (const [name, buffer] of Object.entries(sounds)) {
  fs.writeFileSync(path.join(outDir, name), buffer);
  console.log(`Created ${name} (${buffer.length} bytes)`);
}

// Remove old MP3 placeholders
['click.mp3', 'win.mp3', 'lose.mp3', 'flag.mp3'].forEach(f => {
  const p = path.join(outDir, f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`Removed ${f}`); }
});

console.log('Done!');
