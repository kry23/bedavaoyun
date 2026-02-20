import type { Locale } from "./config";

interface GameTranslation {
  name: string;
  description: string;
  scoreLabel: string;
}

const translations: Record<Locale, Record<string, GameTranslation>> = {
  tr: {
    minesweeper: {
      name: "Mayın Tarlası",
      description: "Gizli mayınları bul, tarlayı temizle!",
      scoreLabel: "Süre",
    },
    game2048: {
      name: "2048",
      description: "Sayıları kaydır, birleştir ve 2048'e ulaş!",
      scoreLabel: "Puan",
    },
    snake: {
      name: "Yılan",
      description: "Yemleri ye, büyü ama kuyruğuna çarpma!",
      scoreLabel: "Puan",
    },
    wordle: {
      name: "Kelime Tahmin",
      description: "6 hakta 5 harfli Türkçe kelimeyi bul!",
      scoreLabel: "Tahmin",
    },
    sudoku: {
      name: "Sudoku",
      description: "9x9 ızgarayı 1-9 sayılarıyla doldur!",
      scoreLabel: "Süre",
    },
    memory: {
      name: "Hafıza Oyunu",
      description: "Kartları eşleştir, hafızanı test et!",
      scoreLabel: "Hamle",
    },
    tetris: {
      name: "Tetris",
      description: "Blokları sıra, satırları temizle!",
      scoreLabel: "Puan",
    },
    puzzle15: {
      name: "15 Bulmaca",
      description: "Karoları kaydırarak sıraya diz!",
      scoreLabel: "Hamle",
    },
  },
  en: {
    minesweeper: {
      name: "Minesweeper",
      description: "Find hidden mines, clear the field!",
      scoreLabel: "Time",
    },
    game2048: {
      name: "2048",
      description: "Slide numbers, merge them and reach 2048!",
      scoreLabel: "Points",
    },
    snake: {
      name: "Snake",
      description: "Eat food, grow but don't hit your tail!",
      scoreLabel: "Points",
    },
    wordle: {
      name: "Word Guess",
      description: "Find the 5-letter word in 6 tries!",
      scoreLabel: "Guesses",
    },
    sudoku: {
      name: "Sudoku",
      description: "Fill the 9x9 grid with numbers 1-9!",
      scoreLabel: "Time",
    },
    memory: {
      name: "Memory Game",
      description: "Match the cards, test your memory!",
      scoreLabel: "Moves",
    },
    tetris: {
      name: "Tetris",
      description: "Stack blocks, clear lines!",
      scoreLabel: "Points",
    },
    puzzle15: {
      name: "15 Puzzle",
      description: "Slide tiles to put them in order!",
      scoreLabel: "Moves",
    },
  },
};

export function getGameTranslation(
  slug: string,
  locale: Locale
): GameTranslation {
  return translations[locale][slug] ?? translations.tr[slug];
}

export function getAllGameTranslations(
  locale: Locale
): Record<string, GameTranslation> {
  return translations[locale];
}
