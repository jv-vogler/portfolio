import { ContactSection } from "@/ui/contact/components/ContactSection";
import { Experience } from "@/ui/experience/components/Experience";
import { Hero } from "@/ui/hero/components/Hero";
import { PortfolioSection } from "@/ui/portfolio/components/Portfolio";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jvvogler.com";

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
      <Experience />
      <PortfolioSection />
      <ContactSection />
    </>
  );
}
