"use client";

import type { Portfolio } from "@/core/portfolio";
import {
  type LayoutVariant,
  ProjectStorySection,
} from "@/ui/portfolio/components/ProjectStorySection";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

type Props = {
  projects: Portfolio.Project[];
};

export function PortfolioShowcase({ projects }: Props) {
  const t = useTranslations("portfolio");
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading">
      {/* Heading — visible before the scroll journey begins */}
      <div className="flex flex-col items-center justify-center px-4 pb-8 pt-20 text-center">
        <h2
          id="portfolio-heading"
          className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl"
        >
          {t("heading")}
        </h2>
        <p className="max-w-md text-lg text-muted-foreground">{t("description")}</p>
      </div>

      {/* Scroll-driven project sections */}
      {projects.map((project, index) => {
        const layoutVariant: LayoutVariant = "hero";

        return (
          <ProjectStorySection
            key={project.slug}
            project={project}
            layoutVariant={layoutVariant}
            index={index}
            reducedMotion={reducedMotion}
            chapter={project.chapterLabel ?? ""}
            narrative={project.narrative ?? ""}
          />
        );
      })}
    </section>
  );
}
