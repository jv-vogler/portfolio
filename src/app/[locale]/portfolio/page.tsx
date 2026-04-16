import { getAllProjects } from "@/app/actions/portfolio";
import { ProjectShowcaseGrid } from "@/ui/portfolio/components/ProjectShowcaseGrid";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jvogler.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });

  return {
    title: t("heading"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/portfolio`,
      languages: {
        en: `${BASE_URL}/en/portfolio`,
        pt: `${BASE_URL}/pt/portfolio`,
      },
    },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const projects = await getAllProjects(locale);

  return <ProjectShowcaseGrid projects={projects} />;
}
