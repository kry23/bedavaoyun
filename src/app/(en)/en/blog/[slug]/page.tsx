import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostLocalized, getBlogSlugsLocalized } from "@/lib/blog";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_NAME, SITE_URL, SITE_URL_EN } from "@/utils/constants";
import { enAlternates, getBlogSlugTr } from "@/i18n/alternates";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostLocalized(params.slug, "en");
  if (!post) return {};
  const trSlug = getBlogSlugTr(params.slug);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL_EN}/en/blog/${post.slug}`,
    },
    alternates: trSlug ? enAlternates(`/blog/${trSlug}`, `/en/blog/${params.slug}`) : { canonical: `${SITE_URL_EN}/en/blog/${params.slug}` },
  };
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugsLocalized("en");
  return slugs.map((slug) => ({ slug }));
}

export default async function EnglishBlogPostPage({ params }: Props) {
  const [post, t] = await Promise.all([
    getBlogPostLocalized(params.slug, "en"),
    getDictionary("en"),
  ]);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/en/blog/${post.slug}`,
    inLanguage: "en",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/en/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.blog.backToBlog}
      </Link>

      <article>
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {post.category}
            </span>
            <time
              className="text-xs text-[hsl(var(--muted-foreground))]"
              dateTime={post.date}
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3
            prose-p:leading-7 prose-p:mb-4
            prose-ul:mb-4 prose-ol:mb-4
            prose-li:mb-1
            prose-strong:text-[hsl(var(--foreground))]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
