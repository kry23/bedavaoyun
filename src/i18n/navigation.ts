import { type Locale, pathMap } from "./config";

/** Build a localized href: getLocalizedPath("games", "en", "minesweeper") → "/en/games/minesweeper" */
export function getLocalizedPath(
  key: keyof (typeof pathMap)["tr"],
  locale: Locale,
  slug?: string
): string {
  const segment = pathMap[locale][key];
  const prefix = locale === "tr" ? "" : "/en";
  const base = `${prefix}/${segment}`;
  return slug ? `${base}/${slug}` : base;
}

/** Get home path for locale */
export function getHomePath(locale: Locale): string {
  return locale === "tr" ? "/" : "/en";
}

/** Convert current path to the equivalent path in the target locale */
export function getAlternatePath(
  currentPath: string,
  targetLocale: Locale
): string {
  // Remove leading slash, split
  const clean = currentPath.replace(/^\//, "");
  const parts = clean.split("/");

  const isEnglish = parts[0] === "en";
  const sourceLocale: Locale = isEnglish ? "en" : "tr";

  if (sourceLocale === targetLocale) return currentPath;

  // Get path parts without locale prefix
  const pathParts = isEnglish ? parts.slice(1) : parts;

  if (pathParts.length === 0 || pathParts[0] === "") {
    return getHomePath(targetLocale);
  }

  // Find canonical key for the first segment
  const firstSegment = pathParts[0];
  const sectionMap: Record<string, keyof (typeof pathMap)["tr"]> = {};
  for (const [key, val] of Object.entries(pathMap[sourceLocale])) {
    sectionMap[val] = key as keyof (typeof pathMap)["tr"];
  }

  const canonicalKey = sectionMap[firstSegment];
  if (!canonicalKey) {
    // Unknown section, fallback to home
    return getHomePath(targetLocale);
  }

  const restSlug = pathParts.slice(1).join("/");
  return getLocalizedPath(canonicalKey, targetLocale, restSlug || undefined);
}
