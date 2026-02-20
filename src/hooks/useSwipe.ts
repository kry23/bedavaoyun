"use client";

import { useEffect, useRef } from "react";

export type SwipeDirection = "up" | "down" | "left" | "right";

export function useSwipe(
  onSwipe: (dir: SwipeDirection) => void,
  enabled: boolean = true
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      const minSwipe = 30;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
        onSwipe(dx > 0 ? "right" : "left");
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
        onSwipe(dy > 0 ? "down" : "up");
      }
      touchStart.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSwipe, enabled]);
}
