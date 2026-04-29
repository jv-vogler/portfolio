import { getHeroPost } from "@/app/actions/blog";
import { getAbout } from "@/lib/payload";
import { Hero } from "@/ui/hero/components/Hero";
import { PortfolioReelSection } from "@/ui/portfolio/components/Portfolio";
import { SkillsSection } from "@/ui/skills/components/SkillsSection";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import type { TypedLocale } from "payload";
import { Suspense } from "react";

const AboutCard = dynamic(() => import("@/ui/about/components/AboutCard").then((m) => m.AboutCard));
const ContactSection = dynamic(() =>
  import("@/ui/contact/components/ContactSection").then((m) => m.ContactSection),
);

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [latestPost, about] = await Promise.all([
    getHeroPost(locale),
    getAbout(locale as TypedLocale),
  ]);

  return (
    <>
      <Hero latestPost={latestPost} />

      <div id="portfolio">
        <PortfolioReelSection />
      </div>

      <SkillsSection />

      <Suspense fallback={null}>
        <AboutCard profileImage={about.profileImage} elevatorPitch={about.elevatorPitch} />
      </Suspense>

      <Suspense fallback={null}>
        <ContactSection />
      </Suspense>
    </>
  );
}
