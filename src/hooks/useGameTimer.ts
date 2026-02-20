"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useGameTimer(autoRun?: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
  }, [elapsed]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    startTimeRef.current = 0;
  }, [stop]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Auto start/stop based on boolean parameter
  useEffect(() => {
    if (autoRun === undefined) return;
    if (autoRun) {
      start();
    } else {
      stop();
    }
  }, [autoRun, start, stop]);

  const formatted = formatTime(elapsed);

  return { elapsed, start, stop, reset, formatTime, formatted };
}
