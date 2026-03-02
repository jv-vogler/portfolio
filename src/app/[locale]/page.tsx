import { ContactSection } from "@/ui/contact/components/ContactSection";
import { ExperienceSection } from "@/ui/experience/components/ExperienceSection";
import { Hero } from "@/ui/hero/components/Hero";
import { PortfolioSection } from "@/ui/portfolio/components/Portfolio";
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
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}`,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        pt: `${BASE_URL}/pt`,
      },
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <PortfolioSection />
      <ContactSection />
    </>
  );
}
