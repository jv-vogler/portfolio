import { getAllPosts, getPost } from "@/app/actions/blog";
import { locales } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/date";
import { BlogPost } from "@/ui/blog/components/BlogPost";
import { Badge } from "@/ui/components/ui/badge";
import { BlogPostingJsonLd } from "@/ui/lib/jsonLd";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jv-portfolio.vercel.app";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const { post } = await getPost(slug, locale);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        tags: post.tags,
        url: `${BASE_URL}/${locale}/blog/${slug}`,
      },
      alternates: {
        canonical: `${BASE_URL}/${locale}/blog/${slug}`,
        languages: {
          en: `${BASE_URL}/en/blog/${slug}`,
          pt: `${BASE_URL}/pt/blog/${slug}`,
        },
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  try {
    const { post, content } = await getPost(slug, locale);

    return (
      <section aria-labelledby="post-heading" className="container mx-auto max-w-3xl px-4 py-20">
        <BlogPostingJsonLd post={post} locale={locale} />
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("backToList")}
        </Link>

        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          </div>
          <h1 id="post-heading" className="mb-4 text-4xl font-bold tracking-tight">
            {post.title}
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">{post.description}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <BlogPost content={content} />
      </section>
    );
  } catch {
    notFound();
  }
}
