"use client";

import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getLocalizedPath } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslation();
  const locale = useLocale();

  return (
    <footer className="border-t border-[hsl(var(--border))] py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Gamepad2 className="h-4 w-4" />
            <span>{t.common.siteName}</span>
          </div>
          <nav className="flex gap-4 text-sm text-[hsl(var(--muted-foreground))]">
            <Link href={getLocalizedPath("games", locale)} className="hover:text-[hsl(var(--foreground))] transition-colors">
              {t.nav.games}
            </Link>
            <Link href={getLocalizedPath("leaderboard", locale)} className="hover:text-[hsl(var(--foreground))] transition-colors">
              {t.nav.leaderboard}
            </Link>
          </nav>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            &copy; {new Date().getFullYear()} {t.common.siteName}. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
