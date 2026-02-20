import { Skeleton } from "@/components/ui/Skeleton";

export default function GameLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full max-w-[600px]" />
      </div>
    </div>
  );
}
