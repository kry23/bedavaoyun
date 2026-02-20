"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useTranslation, useLocale } from "@/i18n/useTranslation";
import { getLocalizedPath } from "@/i18n/navigation";

interface MobileNavProps {
  user: User | null;
  onLogout: () => void;
}

export function MobileNav({ user, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslation();
  const locale = useLocale();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
        aria-label="Menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
          <nav className="flex flex-col gap-2">
            <Link
              href={getLocalizedPath("games", locale)}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
            >
              {t.nav.games}
            </Link>
            <Link
              href={getLocalizedPath("leaderboard", locale)}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
            >
              {t.nav.leaderboard}
            </Link>

            <hr className="border-[hsl(var(--border))]" />

            {user ? (
              <>
                <Link
                  href={getLocalizedPath("profile", locale)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
                >
                  {t.nav.profile}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={getLocalizedPath("login", locale)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href={getLocalizedPath("register", locale)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-700"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
