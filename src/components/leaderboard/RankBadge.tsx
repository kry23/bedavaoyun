interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return <span className="text-lg" title="1. Sıra">🥇</span>;
  }
  if (rank === 2) {
    return <span className="text-lg" title="2. Sıra">🥈</span>;
  }
  if (rank === 3) {
    return <span className="text-lg" title="3. Sıra">🥉</span>;
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-xs font-medium">
      {rank}
    </span>
  );
}
