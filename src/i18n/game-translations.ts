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
    mahjong: {
      name: "Mahjong",
      description: "Taşları eşleştir, tahtayı temizle!",
      scoreLabel: "Süre",
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
    connections: {
      name: "Bağlantılar",
      description: "16 kelimeyi 4 gruba ayır!",
      scoreLabel: "Hata",
    },
    hangman: {
      name: "Adam Asmaca",
      description: "Harfleri tahmin et, kelimeyi bul!",
      scoreLabel: "Puan",
    },
    globle: {
      name: "Globle",
      description: "Gizli ülkeyi tahmin et, dünyayı keşfet!",
      scoreLabel: "Tahmin",
    },
    watermelon: {
      name: "Karpuz Oyunu",
      description: "Meyveleri birleştir, karpuzu yap!",
      scoreLabel: "Puan",
    },
    blockbreaker: {
      name: "Tuğla Kırma",
      description: "Topu sektir, tuğlaları kır, en yüksek skoru yap!",
      scoreLabel: "Puan",
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
    mahjong: {
      name: "Mahjong Solitaire",
      description: "Match tiles and clear the board!",
      scoreLabel: "Time",
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
    connections: {
      name: "Connections",
      description: "Sort 16 words into 4 groups!",
      scoreLabel: "Mistakes",
    },
    hangman: {
      name: "Hangman",
      description: "Guess letters and find the word!",
      scoreLabel: "Points",
    },
    globle: {
      name: "Globle",
      description: "Guess the mystery country, explore the world!",
      scoreLabel: "Guesses",
    },
    watermelon: {
      name: "Watermelon Game",
      description: "Merge fruits and make a watermelon!",
      scoreLabel: "Points",
    },
    blockbreaker: {
      name: "Block Breaker",
      description: "Bounce the ball, break blocks, get the highest score!",
      scoreLabel: "Points",
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
