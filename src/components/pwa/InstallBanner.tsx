"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-dismissed", "1");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-lg sm:left-auto sm:right-4">
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
        <div className="flex-1">
          <p className="text-sm font-medium">{t.pwa.installTitle}</p>
          <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
            {t.pwa.installDescription}
          </p>
          <button
            onClick={handleInstall}
            className="mt-2 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
          >
            {t.pwa.install}
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
