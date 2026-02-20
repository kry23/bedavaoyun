import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Gamepad2 className="h-4 w-4" />
            <span>Bedava Oyun</span>
          </div>
          <nav className="flex gap-4 text-sm text-[hsl(var(--muted-foreground))]">
            <Link href="/oyunlar" className="hover:text-[hsl(var(--foreground))] transition-colors">
              Oyunlar
            </Link>
            <Link href="/siralama" className="hover:text-[hsl(var(--foreground))] transition-colors">
              Sıralama
            </Link>
          </nav>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            &copy; {new Date().getFullYear()} Bedava Oyun. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
