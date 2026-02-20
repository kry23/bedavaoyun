export type GameStatus = "idle" | "playing" | "won" | "lost";

export type SortDirection = "asc" | "desc";

export interface GameInfo {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortDirection: SortDirection;
  scoreLabel: string;
}
