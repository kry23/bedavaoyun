export type DifficultyLevel = 0 | 1 | 2 | 3;

export type GameStatus = "playing" | "won" | "lost";

export interface ConnectionGroup {
  category: string;
  words: string[];
  difficulty: DifficultyLevel;
}

export interface ConnectionsPuzzle {
  id: number;
  groups: [ConnectionGroup, ConnectionGroup, ConnectionGroup, ConnectionGroup];
}

export interface SolvedGroup {
  category: string;
  words: string[];
  difficulty: DifficultyLevel;
}

export interface ConnectionsState {
  puzzle: ConnectionsPuzzle;
  shuffledWords: string[];
  selectedWords: string[];
  solvedGroups: SolvedGroup[];
  mistakes: number;
  status: GameStatus;
  guessHistory: string[][];
}

export const MAX_MISTAKES = 4;
export const GROUP_SIZE = 4;
export const TOTAL_GROUPS = 4;
export const TOTAL_WORDS = 16;

export const DIFFICULTY_COLORS: Record<
  DifficultyLevel,
  { bg: string; text: string; name: string }
> = {
  0: { bg: "#F9DF6D", text: "#000000", name: "yellow" },
  1: { bg: "#A0C35A", text: "#000000", name: "green" },
  2: { bg: "#B0C4EF", text: "#000000", name: "blue" },
  3: { bg: "#BA81C5", text: "#FFFFFF", name: "purple" },
};
