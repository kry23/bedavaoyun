"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface MobileNavProps {
  user: User | null;
  onLogout: () => void;
}

export function MobileNav({ user, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
        aria-label="Menü"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
          <nav className="flex flex-col gap-2">
            <Link
              href="/oyunlar"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
            >
              Oyunlar
            </Link>
            <Link
              href="/siralama"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
            >
              Sıralama
            </Link>

            <hr className="border-[hsl(var(--border))]" />

            {user ? (
              <>
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))]"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-700"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
