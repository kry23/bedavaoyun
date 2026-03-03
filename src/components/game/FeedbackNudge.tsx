"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getLocalizedPath } from "@/i18n/navigation";

const STORAGE_KEY = "feedback_nudge";
const GAMES_BEFORE_NUDGE = 3;

interface NudgeState {
  dismissed: boolean;
  gamesPlayed: number;
}

function getState(): NudgeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { dismissed: false, gamesPlayed: 0 };
}

function saveState(state: NudgeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/** Call this when a game ends (win or lose) to track play count */
export function recordGamePlayed() {
  const state = getState();
  if (state.dismissed) return;
  state.gamesPlayed++;
  saveState(state);
}

/**
 * Non-intrusive floating nudge shown after user plays a few games.
 * Shows once, dismissed permanently with X or after clicking the link.
 */
export function FeedbackNudge() {
  const [visible, setVisible] = useState(false);
  const t = useTranslation();
  const locale = useLocale();

  useEffect(() => {
    const state = getState();
    if (!state.dismissed && state.gamesPlayed >= GAMES_BEFORE_NUDGE) {
      // Small delay so it doesn't pop up immediately
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    const state = getState();
    state.dismissed = true;
    saveState(state);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-lg">
        <button
          onClick={dismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3 pr-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            <MessageSquare className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium">{t.feedback.nudgeTitle}</p>
            <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
              {t.feedback.nudgeMessage}
            </p>
            <Link
              href={getLocalizedPath("feedback", locale)}
              onClick={dismiss}
              className="mt-2 inline-block text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              {t.feedback.nudgeAction} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
