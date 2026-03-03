import type {
  ConnectionsPuzzle,
  ConnectionsState,
  ConnectionGroup,
  SolvedGroup,
  DifficultyLevel,
} from "./types";
import { MAX_MISTAKES, GROUP_SIZE, TOTAL_GROUPS } from "./types";
import { PUZZLES_TR } from "./puzzles-tr";
import { PUZZLES_EN } from "./puzzles-en";

export type ConnectionsLocale = "tr" | "en";

export type GuessResult =
  | { type: "correct"; group: SolvedGroup; autoSolved?: SolvedGroup }
  | { type: "almostCorrect"; matchedGroup: string }
  | { type: "wrong" }
  | { type: "alreadyGuessed" }
  | { type: "gameOver" };

function getPuzzles(locale: ConnectionsLocale): ConnectionsPuzzle[] {
  return locale === "tr" ? PUZZLES_TR : PUZZLES_EN;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getAllWords(puzzle: ConnectionsPuzzle): string[] {
  return puzzle.groups.flatMap((g) => g.words);
}

export function createRandomGame(locale: ConnectionsLocale): ConnectionsState {
  const puzzles = getPuzzles(locale);
  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  return {
    puzzle,
    shuffledWords: shuffle(getAllWords(puzzle)),
    selectedWords: [],
    solvedGroups: [],
    mistakes: 0,
    status: "playing",
    guessHistory: [],
  };
}

export function createDailyGame(locale: ConnectionsLocale): ConnectionsState {
  const puzzles = getPuzzles(locale);
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  const index = daysSinceEpoch % puzzles.length;
  const puzzle = puzzles[index];
  return {
    puzzle,
    shuffledWords: shuffle(getAllWords(puzzle)),
    selectedWords: [],
    solvedGroups: [],
    mistakes: 0,
    status: "playing",
    guessHistory: [],
  };
}

export function createGameFromPuzzle(puzzle: ConnectionsPuzzle): ConnectionsState {
  return {
    puzzle,
    shuffledWords: shuffle(getAllWords(puzzle)),
    selectedWords: [],
    solvedGroups: [],
    mistakes: 0,
    status: "playing",
    guessHistory: [],
  };
}

export function toggleWord(state: ConnectionsState, word: string): ConnectionsState {
  if (state.status !== "playing") return state;

  const isSelected = state.selectedWords.includes(word);

  if (isSelected) {
    return {
      ...state,
      selectedWords: state.selectedWords.filter((w) => w !== word),
    };
  }

  if (state.selectedWords.length >= GROUP_SIZE) return state;

  return {
    ...state,
    selectedWords: [...state.selectedWords, word],
  };
}

export function deselectAll(state: ConnectionsState): ConnectionsState {
  return { ...state, selectedWords: [] };
}

export function shuffleWords(state: ConnectionsState): ConnectionsState {
  return { ...state, shuffledWords: shuffle(state.shuffledWords) };
}

function findMatchingGroup(
  puzzle: ConnectionsPuzzle,
  selected: string[],
  solved: SolvedGroup[]
): ConnectionGroup | null {
  const solvedCategories = new Set(solved.map((s) => s.category));
  return (
    puzzle.groups.find((g) => {
      if (solvedCategories.has(g.category)) return false;
      const groupSet = new Set(g.words);
      return selected.length === groupSet.size && selected.every((w) => groupSet.has(w));
    }) ?? null
  );
}

function findAlmostCorrectGroup(
  puzzle: ConnectionsPuzzle,
  selected: string[],
  solved: SolvedGroup[]
): string | null {
  const solvedCategories = new Set(solved.map((s) => s.category));
  for (const g of puzzle.groups) {
    if (solvedCategories.has(g.category)) continue;
    const overlap = selected.filter((w) => g.words.includes(w));
    if (overlap.length === GROUP_SIZE - 1) return g.category;
  }
  return null;
}

export function submitGuess(state: ConnectionsState): { state: ConnectionsState; result: GuessResult } {
  if (state.status !== "playing" || state.selectedWords.length !== GROUP_SIZE) {
    return { state, result: { type: "wrong" } };
  }

  const sortedGuess = [...state.selectedWords].sort();
  const isDuplicate = state.guessHistory.some(
    (prev) => prev.length === sortedGuess.length && prev.every((w, i) => w === sortedGuess[i])
  );
  if (isDuplicate) {
    return { state, result: { type: "alreadyGuessed" } };
  }

  const newHistory = [...state.guessHistory, sortedGuess];

  const matchedGroup = findMatchingGroup(state.puzzle, state.selectedWords, state.solvedGroups);

  if (matchedGroup) {
    const solvedGroup: SolvedGroup = {
      category: matchedGroup.category,
      words: matchedGroup.words,
      difficulty: matchedGroup.difficulty,
    };

    const newSolvedGroups = [...state.solvedGroups, solvedGroup];
    const newShuffledWords = state.shuffledWords.filter(
      (w) => !matchedGroup.words.includes(w)
    );

    // Auto-solve last group when 3 are found
    if (newSolvedGroups.length === TOTAL_GROUPS - 1) {
      const solvedCategories = new Set(newSolvedGroups.map((s) => s.category));
      const lastGroup = state.puzzle.groups.find(
        (g) => !solvedCategories.has(g.category)
      )!;
      const autoSolvedGroup: SolvedGroup = {
        category: lastGroup.category,
        words: lastGroup.words,
        difficulty: lastGroup.difficulty,
      };

      return {
        state: {
          ...state,
          solvedGroups: [...newSolvedGroups, autoSolvedGroup],
          shuffledWords: [],
          selectedWords: [],
          status: "won",
          guessHistory: newHistory,
        },
        result: { type: "correct", group: solvedGroup, autoSolved: autoSolvedGroup },
      };
    }

    return {
      state: {
        ...state,
        solvedGroups: newSolvedGroups,
        shuffledWords: newShuffledWords,
        selectedWords: [],
        guessHistory: newHistory,
      },
      result: { type: "correct", group: solvedGroup },
    };
  }

  // Wrong guess
  const newMistakes = state.mistakes + 1;

  if (newMistakes >= MAX_MISTAKES) {
    return {
      state: {
        ...state,
        mistakes: newMistakes,
        selectedWords: [],
        status: "lost",
        guessHistory: newHistory,
      },
      result: { type: "gameOver" },
    };
  }

  const almostGroup = findAlmostCorrectGroup(state.puzzle, state.selectedWords, state.solvedGroups);

  return {
    state: {
      ...state,
      mistakes: newMistakes,
      selectedWords: [],
      guessHistory: newHistory,
    },
    result: almostGroup ? { type: "almostCorrect", matchedGroup: almostGroup } : { type: "wrong" },
  };
}

export function revealAll(state: ConnectionsState): ConnectionsState {
  const solvedCategories = new Set(state.solvedGroups.map((s) => s.category));
  const remaining = state.puzzle.groups
    .filter((g) => !solvedCategories.has(g.category))
    .map((g) => ({
      category: g.category,
      words: g.words,
      difficulty: g.difficulty,
    }));

  return {
    ...state,
    solvedGroups: [...state.solvedGroups, ...remaining],
    shuffledWords: [],
    selectedWords: [],
  };
}

export function getShareText(state: ConnectionsState): string {
  const emojiMap: Record<DifficultyLevel, string> = {
    0: "\uD83D\uDFE8",
    1: "\uD83D\uDFE9",
    2: "\uD83D\uDFE6",
    3: "\uD83D\uDFEA",
  };

  const lines = state.guessHistory.map((guess) => {
    return guess
      .map((word) => {
        const group = state.puzzle.groups.find((g) => g.words.includes(word));
        return group ? emojiMap[group.difficulty] : "\u2B1C";
      })
      .join("");
  });

  return `Connections\n${lines.join("\n")}`;
}
