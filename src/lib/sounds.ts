const sounds: Record<string, HTMLAudioElement> = {};
let loaded = false;
let muted = false;

const STORAGE_KEY = "bedavaoyun-sound-muted";

function loadMutePreference(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function preloadSounds() {
  if (loaded || typeof window === "undefined") return;
  muted = loadMutePreference();
  ["click", "win", "lose", "flag"].forEach((name) => {
    const audio = new Audio(`/sounds/${name}.wav`);
    audio.preload = "auto";
    audio.volume = 0.3;
    sounds[name] = audio;
  });
  loaded = true;
}

export function playSound(name: string) {
  if (muted) return;
  const s = sounds[name];
  if (s) {
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(value));
  }
}

export function toggleMute(): boolean {
  setMuted(!muted);
  return muted;
}
