import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold">404</h1>
      <p className="mb-6 text-lg text-[hsl(var(--muted-foreground))]">
        The page you&apos;re looking for could not be found.
      </p>
      <Link href="/en">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}
