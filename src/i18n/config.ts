export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const pathMap = {
  tr: {
    games: "oyunlar",
    leaderboard: "siralama",
    login: "giris",
    register: "kayit",
    profile: "profil",
    blog: "blog",
  },
  en: {
    games: "games",
    leaderboard: "leaderboard",
    login: "login",
    register: "register",
    profile: "profile",
    blog: "blog",
  },
} as const;

// Reverse map: from URL segment to canonical key + locale
const reverseMap: Record<string, { key: string; locale: Locale }> = {};
for (const locale of locales) {
  for (const [key, segment] of Object.entries(pathMap[locale])) {
    reverseMap[segment] = { key, locale };
  }
}
export { reverseMap };
