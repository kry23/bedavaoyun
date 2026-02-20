import type { Locale } from "@/i18n/config";
import { blogPostsTr } from "@/i18n/blog/tr";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: string;
  content: string; // HTML content
}

async function loadBlogPosts(locale: Locale): Promise<BlogPost[]> {
  if (locale === "en") {
    const { blogPostsEn } = await import("@/i18n/blog/en");
    return blogPostsEn;
  }
  return blogPostsTr;
}

// Sync versions for Turkish (default, backward compat)
export const blogPosts = blogPostsTr;

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPostsTr.find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return blogPostsTr.map((p) => p.slug);
}

// Locale-aware versions
export async function getBlogPostsLocalized(
  locale: Locale
): Promise<BlogPost[]> {
  return loadBlogPosts(locale);
}

export async function getBlogPostLocalized(
  slug: string,
  locale: Locale
): Promise<BlogPost | undefined> {
  const posts = await loadBlogPosts(locale);
  return posts.find((p) => p.slug === slug);
}

export async function getBlogSlugsLocalized(
  locale: Locale
): Promise<string[]> {
  const posts = await loadBlogPosts(locale);
  return posts.map((p) => p.slug);
}
