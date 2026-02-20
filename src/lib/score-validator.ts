interface ScoreInput {
  gameSlug: string;
  score: number;
  difficulty?: string;
  duration?: number;
  moves?: number;
}

const RULES: Record<
  string,
  (input: ScoreInput) => { valid: boolean; reason?: string }
> = {
  minesweeper: ({ difficulty, duration }) => {
    const minTimes: Record<string, number> = {
      easy: 3000,
      medium: 15000,
      hard: 30000,
    };
    if (duration && duration < (minTimes[difficulty || "easy"] || 3000))
      return { valid: false, reason: "Süre gerçekçi değil" };
    return { valid: true };
  },
  game2048: ({ score }) => {
    if (score > 500000)
      return { valid: false, reason: "Skor gerçekçi değil" };
    return { valid: true };
  },
  snake: ({ score }) => {
    if (score > 500) return { valid: false, reason: "Maksimum skor aşıldı" };
    return { valid: true };
  },
  wordle: ({ score }) => {
    if (score < 1 || score > 6)
      return { valid: false, reason: "Tahmin 1-6 arası olmalı" };
    return { valid: true };
  },
};

export function validateScore(
  input: ScoreInput
): { valid: boolean; reason?: string } {
  const rule = RULES[input.gameSlug];
  if (!rule) return { valid: false, reason: "Bilinmeyen oyun" };
  return rule(input);
}
