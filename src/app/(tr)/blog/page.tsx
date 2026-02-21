import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { Card } from "@/components/ui/Card";
import { BookOpen } from "lucide-react";
import { trAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Blog - Oyun Rehberleri ve Haberler",
  description:
    "Oyun rehberleri, stratejiler, ipuçları ve tarayıcı oyunları dünyasından haberler.",
  alternates: trAlternates("/blog", "/en/blog"),
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Blog</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Oyun rehberleri, stratejiler ve ipuçları
        </p>
      </div>

      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="p-5 transition-colors hover:bg-[hsl(var(--muted))]">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                      {post.category}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {new Date(post.date).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="mb-1 text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {post.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
