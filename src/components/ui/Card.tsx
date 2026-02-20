import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
