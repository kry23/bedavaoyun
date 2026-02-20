const sounds: Record<string, HTMLAudioElement> = {};
let loaded = false;

export function preloadSounds() {
  if (loaded || typeof window === "undefined") return;
  ["click", "win", "lose", "flag"].forEach((name) => {
    const audio = new Audio(`/sounds/${name}.wav`);
    audio.preload = "auto";
    audio.volume = 0.3;
    sounds[name] = audio;
  });
  loaded = true;
}

export function playSound(name: string) {
  const s = sounds[name];
  if (s) {
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}
