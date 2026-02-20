import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { gameRegistry, gameSlugs } from "@/lib/game-registry";
import { Skeleton } from "@/components/ui/Skeleton";

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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = gameRegistry[params.slug];
  if (!game) return {};
  return {
    title: `${game.name} - Ücretsiz Online Oyna`,
    description: `${game.name} oyununu tarayıcında ücretsiz oyna. ${game.description}`,
    openGraph: {
      title: `${game.name} | Bedava Oyun`,
      description: game.description,
      images: [`/og/${params.slug}.png`],
    },
  };
}

export function generateStaticParams() {
  return gameSlugs.map((slug) => ({ slug }));
}

export default function GamePage({ params }: Props) {
  const game = gameRegistry[params.slug];
  if (!game) notFound();

  const GameComponent = gameComponents[params.slug];
  if (!GameComponent) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <GameComponent />
    </div>
  );
}
