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

      {/* Connective tissue — geometric line */}
      <div className="relative" aria-hidden="true">
        <div className="h-px w-full bg-primary/10" />
        <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-primary/20 bg-background" />
      </div>

      <div id="portfolio">
        <PortfolioReelSection />
      </div>

      <SkillsSection />

      {/* Connective tissue */}
      <div className="relative" aria-hidden="true">
        <div className="h-px w-full bg-primary/10" />
        <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-primary/20 bg-background" />
      </div>

      <Suspense fallback={null}>
        <AboutCard profileImage={about.profileImage} elevatorPitch={about.elevatorPitch} />
      </Suspense>

      <Suspense fallback={null}>
        <ContactSection />
      </Suspense>
    </>
  );
}
