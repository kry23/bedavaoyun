import type { Difficulty, MemoryCard, MemoryState } from "./types";
import { DIFFICULTY_CONFIG, EMOJIS } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(difficulty: Difficulty): MemoryState {
  const { pairs } = DIFFICULTY_CONFIG[difficulty];
  const selectedEmojis = shuffle(EMOJIS).slice(0, pairs);
  const cards: MemoryCard[] = shuffle(
    selectedEmojis.flatMap((emoji, i) => [
      { id: i * 2, emoji, flipped: false, matched: false },
      { id: i * 2 + 1, emoji, flipped: false, matched: false },
    ])
  );

  return {
    cards,
    flippedIndices: [],
    moves: 0,
    matches: 0,
    totalPairs: pairs,
    status: "playing",
    locked: false,
  };
}

export function flipCard(state: MemoryState, index: number): MemoryState {
  if (state.locked || state.status !== "playing") return state;
  const card = state.cards[index];
  if (card.flipped || card.matched) return state;
  if (state.flippedIndices.length >= 2) return state;

  const newCards = state.cards.map((c, i) =>
    i === index ? { ...c, flipped: true } : c
  );
  const newFlipped = [...state.flippedIndices, index];

  if (newFlipped.length === 2) {
    const [first, second] = newFlipped;
    const isMatch = newCards[first].emoji === newCards[second].emoji;

    if (isMatch) {
      newCards[first] = { ...newCards[first], matched: true };
      newCards[second] = { ...newCards[second], matched: true };
      const newMatches = state.matches + 1;
      const won = newMatches === state.totalPairs;

      return {
        ...state,
        cards: newCards,
        flippedIndices: [],
        moves: state.moves + 1,
        matches: newMatches,
        status: won ? "won" : "playing",
        locked: false,
      };
    }

    // Mismatch: locked until unflip
    return {
      ...state,
      cards: newCards,
      flippedIndices: newFlipped,
      moves: state.moves + 1,
      locked: true,
    };
  }

  return {
    ...state,
    cards: newCards,
    flippedIndices: newFlipped,
  };
}

export function unflipCards(state: MemoryState): MemoryState {
  const newCards = state.cards.map((c) =>
    c.matched ? c : { ...c, flipped: false }
  );
  return {
    ...state,
    cards: newCards,
    flippedIndices: [],
    locked: false,
  };
}
