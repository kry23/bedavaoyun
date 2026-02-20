"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/i18n/useTranslation";
import { getAlternatePath } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

const languages: { locale: Locale; label: string; flag: string }[] = [
  { locale: "tr", label: "Türkçe", flag: "🇹🇷" },
  { locale: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (targetLocale: Locale) => {
    if (targetLocale === locale) {
      setOpen(false);
      return;
    }
    const newPath = getAlternatePath(pathname, targetLocale);
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-[140px] rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-1 shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.locale}
              onClick={() => switchLocale(lang.locale)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))] ${
                locale === lang.locale
                  ? "font-medium text-primary-600 dark:text-primary-400"
                  : ""
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
