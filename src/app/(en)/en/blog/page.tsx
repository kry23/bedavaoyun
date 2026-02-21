import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPostsLocalized } from "@/lib/blog";
import { getDictionary } from "@/i18n/get-dictionary";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Blog - Game Guides & News",
  description:
    "Game guides, strategies, tips and news from the world of browser games.",
  alternates: enAlternates("/blog", "/en/blog"),
};

export default async function EnglishBlogPage() {
  const t = await getDictionary("en");
  const posts = await getBlogPostsLocalized("en");
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t.blog.title}</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          {t.blog.subtitle}
        </p>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/en/blog/${post.slug}`}
            className="block rounded-xl border border-[hsl(var(--border))] p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-2 flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {post.category}
              </span>
              <time>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
