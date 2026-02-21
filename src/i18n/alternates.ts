import { SITE_URL, SITE_URL_EN } from "@/utils/constants";

/**
 * Blog slug mapping between TR and EN.
 * Index-based: blogSlugMap[i] = [trSlug, enSlug]
 */
const blogSlugPairs: [string, string][] = [
  ["mayIn-tarlasi-nasil-oynanir", "how-to-play-minesweeper"],
  ["2048-kazanma-taktikleri", "2048-winning-strategies"],
  ["wordle-turkce-kelime-tahmin-ipuclari", "word-guess-tips"],
  ["tarayici-oyunlari-tarihi", "history-of-browser-games"],
  ["sudoku-nasil-cozulur", "how-to-solve-sudoku"],
  ["yilan-oyunu-yuksek-skor", "snake-game-high-score"],
  ["hafiza-oyunu-beyni-guclendirme", "memory-games-brain-benefits"],
  ["en-iyi-ucretsiz-tarayici-oyunlari-2026", "best-free-browser-games-2026"],
  ["beyin-gelistiren-oyunlar", "brain-training-games"],
  ["mobilde-oyun-oynama-rehberi", "mobile-gaming-guide"],
];

const trToEnBlog = Object.fromEntries(blogSlugPairs.map(([tr, en]) => [tr, en]));
const enToTrBlog = Object.fromEntries(blogSlugPairs.map(([tr, en]) => [en, tr]));

export function getBlogSlugEn(trSlug: string): string | undefined {
  return trToEnBlog[trSlug];
}

export function getBlogSlugTr(enSlug: string): string | undefined {
  return enToTrBlog[enSlug];
}

/** Generate hreflang alternates for a Turkish page */
export function trAlternates(trPath: string, enPath: string) {
  return {
    canonical: `${SITE_URL}${trPath}`,
    languages: {
      "tr": `${SITE_URL}${trPath}`,
      "en": `${SITE_URL_EN}${enPath}`,
    },
  };
}

/** Generate hreflang alternates for an English page */
export function enAlternates(trPath: string, enPath: string) {
  return {
    canonical: `${SITE_URL_EN}${enPath}`,
    languages: {
      "tr": `${SITE_URL}${trPath}`,
      "en": `${SITE_URL_EN}${enPath}`,
    },
  };
}
