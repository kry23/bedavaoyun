import type { GameInfo } from "@/types/game";

export const gameRegistry: Record<string, GameInfo> = {
  minesweeper: {
    name: "Mayın Tarlası",
    slug: "minesweeper",
    description: "Gizli mayınları bul, tarlayı temizle!",
    icon: "💣",
    color: "#EF4444",
    sortDirection: "asc",
    scoreLabel: "Süre",
  },
  game2048: {
    name: "2048",
    slug: "game2048",
    description: "Sayıları kaydır, birleştir ve 2048'e ulaş!",
    icon: "🔢",
    color: "#F59E0B",
    sortDirection: "desc",
    scoreLabel: "Puan",
  },
  snake: {
    name: "Yılan",
    slug: "snake",
    description: "Yemleri ye, büyü ama kuyruğuna çarpma!",
    icon: "🐍",
    color: "#10B981",
    sortDirection: "desc",
    scoreLabel: "Puan",
  },
  wordle: {
    name: "Kelime Tahmin",
    slug: "wordle",
    description: "6 hakta 5 harfli Türkçe kelimeyi bul!",
    icon: "📝",
    color: "#6366F1",
    sortDirection: "asc",
    scoreLabel: "Tahmin",
  },
};

export const gameList = Object.values(gameRegistry);
export const gameSlugs = Object.keys(gameRegistry);
