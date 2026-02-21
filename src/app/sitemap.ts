import type { MetadataRoute } from "next";
import { SITE_URL, SITE_URL_EN } from "@/utils/constants";
import { gameSlugs } from "@/lib/game-registry";
import { blogPosts } from "@/lib/blog";
import { getBlogSlugEn } from "@/i18n/alternates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Game slugs for both languages
  const games = gameSlugs;

  // Blog slugs
  const trBlogSlugs = blogPosts.map((p) => p.slug);
  const enBlogSlugs = trBlogSlugs
    .map((slug) => getBlogSlugEn(slug))
    .filter(Boolean) as string[];

  return [
    // ===== TURKISH PAGES (bedava-oyun.com) =====
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/oyunlar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...games.map((slug) => ({
      url: `${SITE_URL}/oyunlar/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/siralama`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.7,
    },
    ...games.map((slug) => ({
      url: `${SITE_URL}/siralama/${slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...trBlogSlugs.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    // ===== ENGLISH PAGES (freegames4you.online) =====
    {
      url: `${SITE_URL_EN}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL_EN}/en/games`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...games.map((slug) => ({
      url: `${SITE_URL_EN}/en/games/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL_EN}/en/leaderboard`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.7,
    },
    ...games.map((slug) => ({
      url: `${SITE_URL_EN}/en/leaderboard/${slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL_EN}/en/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...enBlogSlugs.map((slug) => ({
      url: `${SITE_URL_EN}/en/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
