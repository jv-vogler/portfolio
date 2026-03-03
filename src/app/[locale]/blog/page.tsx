import { getAllPosts, getAllTags } from "@/app/actions/blog";
import { Blog } from "@/core/blog";
import { BlogList } from "@/ui/blog/components/BlogList";
import { TagFilter } from "@/ui/blog/components/TagFilter";
import { MotionSection } from "@/ui/lib/motion";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jvogler.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("heading"),
    description: t("description"),
    openGraph: {
      title: `${t("heading")} | JV Vogler`,
      description: t("description"),
      url: `${BASE_URL}/${locale}/blog`,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        en: `${BASE_URL}/en/blog`,
        pt: `${BASE_URL}/pt/blog`,
      },
    },
  };
}

type BlogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[] }>;
};

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { tag } = await searchParams;

  // Normalise tag param to a single string (use the first if multiple provided)
  const activeTag = Array.isArray(tag) ? tag[0] : tag;

  const [allPosts, tags] = await Promise.all([getAllPosts(locale, activeTag), getAllTags(locale)]);

  const posts = Blog.sortFeaturedFirst(allPosts);

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <section aria-labelledby="blog-heading" className="container mx-auto max-w-4xl px-4 py-20">
      <MotionSection className="mb-12 text-center">
        <h1 id="blog-heading" className="mb-4 text-4xl font-bold">
          {t("heading")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
      </MotionSection>

      <Suspense>
        <TagFilter tags={tags} />
      </Suspense>

      <BlogList posts={posts} tags={tags} />
    </section>
  );
}
