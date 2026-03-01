import { getAllPosts } from "@/app/actions/blog";
import { BlogList } from "@/ui/blog/components/BlogList";
import { MotionSection } from "@/ui/lib/motion";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jv-portfolio.vercel.app";

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

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getAllPosts(locale);

  return (
    <section aria-labelledby="blog-heading" className="container mx-auto max-w-4xl px-4 py-20">
      <MotionSection className="mb-12 text-center">
        <h1 id="blog-heading" className="mb-4 text-4xl font-bold">
          {t("heading")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
      </MotionSection>
      <BlogList posts={posts} />
    </section>
  );
}
