"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/utils/cn";

const navLinks = [
  { href: "/oyunlar", label: "Oyunlar" },
  { href: "/siralama", label: "Sıralama" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2 font-bold">
          <Gamepad2 className="h-5 w-5 text-primary-500" />
          <span>Bedava Oyun</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[hsl(var(--muted))]",
                pathname === link.href
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? null : user ? (
              <>
                <Link
                  href="/profil"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[hsl(var(--muted))]"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[hsl(var(--muted))]"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <MobileNav user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
