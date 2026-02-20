"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, toggleMute, preloadSounds } from "@/lib/sounds";

export function SoundToggle() {
  const [mute, setMute] = useState(false);

  useEffect(() => {
    preloadSounds();
    setMute(isMuted());
  }, []);

  const handleToggle = () => {
    const newMute = toggleMute();
    setMute(newMute);
  };

  return (
    <button
      onClick={handleToggle}
      className="rounded-md p-2 transition-colors hover:bg-[hsl(var(--muted))]"
      aria-label={mute ? "Sesi aç" : "Sesi kapat"}
      title={mute ? "Sesi aç" : "Sesi kapat"}
    >
      {mute ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </button>
  );
}
