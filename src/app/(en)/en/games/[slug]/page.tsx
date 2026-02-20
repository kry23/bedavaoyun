import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { gameRegistry, gameSlugs } from "@/lib/game-registry";
import { GameJsonLd } from "@/components/game/JsonLd";
import { RelatedGames } from "@/components/game/RelatedGames";
import { Skeleton } from "@/components/ui/Skeleton";
import { getGameTranslation } from "@/i18n/game-translations";

interface Props {
  params: { slug: string };
}

const GameSkeleton = () => (
  <div className="flex flex-col items-center gap-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-[400px] w-full max-w-[600px]" />
  </div>
);

const gameComponents: Record<string, ReturnType<typeof dynamic>> = {
  minesweeper: dynamic(
    () => import("@/games/minesweeper/MinesweeperGame"),
    { loading: GameSkeleton, ssr: false }
  ),
  game2048: dynamic(
    () => import("@/games/game2048/Game2048"),
    { loading: GameSkeleton, ssr: false }
  ),
  snake: dynamic(
    () => import("@/games/snake/SnakeGame"),
    { loading: GameSkeleton, ssr: false }
  ),
  wordle: dynamic(
    () => import("@/games/wordle/WordleGame"),
    { loading: GameSkeleton, ssr: false }
  ),
  sudoku: dynamic(
    () => import("@/games/sudoku/SudokuGame"),
    { loading: GameSkeleton, ssr: false }
  ),
  memory: dynamic(
    () => import("@/games/memory/MemoryGame"),
    { loading: GameSkeleton, ssr: false }
  ),
  tetris: dynamic(
    () => import("@/games/tetris/TetrisGame"),
    { loading: GameSkeleton, ssr: false }
  ),
  puzzle15: dynamic(
    () => import("@/games/puzzle15/Puzzle15Game"),
    { loading: GameSkeleton, ssr: false }
  ),
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = gameRegistry[params.slug];
  if (!game) return {};
  const gt = getGameTranslation(params.slug, "en");
  return {
    title: `${gt.name} - Play Free Online`,
    description: `Play ${gt.name} free in your browser. ${gt.description}`,
    openGraph: {
      title: `${gt.name} | Bedava Oyun`,
      description: gt.description,
      images: [`/og/${params.slug}.png`],
    },
  };
}

export function generateStaticParams() {
  return gameSlugs.map((slug) => ({ slug }));
}

export default function EnglishGamePage({ params }: Props) {
  const game = gameRegistry[params.slug];
  if (!game) notFound();

  const GameComponent = gameComponents[params.slug];
  if (!GameComponent) notFound();

  const gt = getGameTranslation(params.slug, "en");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <GameJsonLd game={{ ...game, ...gt }} slug={params.slug} locale="en" />
      <GameComponent />
      <RelatedGames currentSlug={params.slug} />
    </div>
  );
}
