"use client";

import type { Portfolio } from "@/core/portfolio";
import { Badge } from "@/ui/components/ui/badge";
import { useViewTransitionRouter } from "@/ui/lib/useViewTransitionRouter";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DEFAULT_ACCENT = "oklch(0.65 0.24 155)";

type CardAnimConfig = {
  entranceX: number;
  entranceY: number;
  entranceScale: number;
};

const PERSONAL_ANIM_CONFIGS: CardAnimConfig[] = [
  { entranceX: -140, entranceY: 0, entranceScale: 1 },
  { entranceX: 0, entranceY: 120, entranceScale: 1 },
  { entranceX: 140, entranceY: 0, entranceScale: 1 },
  { entranceX: 0, entranceY: -120, entranceScale: 1 },
  { entranceX: 0, entranceY: 0, entranceScale: 0.7 },
];

const PROFESSIONAL_ANIM_CONFIGS: CardAnimConfig[] = [
  { entranceX: 0, entranceY: 60, entranceScale: 0.85 },
  { entranceX: 0, entranceY: 60, entranceScale: 0.85 },
];

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setDesktop(mql.matches);
    const h = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);
  return desktop;
}

type ProjectShowcaseGridProps = {
  projects: Portfolio.Project[];
};

export function ProjectShowcaseGrid({ projects }: ProjectShowcaseGridProps) {
  const t = useTranslations("portfolio");
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  const professionalProjects: Portfolio.Project[] = [];
  const personalProjects: Portfolio.Project[] = [];

  projects.forEach((project) => {
    if (project.isProfessional) {
      professionalProjects.push(project);
    } else {
      personalProjects.push(project);
    }
  });

  return (
    <section className="py-32" aria-labelledby="portfolio-showcase-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="portfolio-showcase-heading"
          className="mb-4 text-4xl font-bold text-foreground sm:text-5xl"
        >
          <span
            aria-hidden="true"
            className="mr-3 font-mono text-xl font-normal text-muted-foreground sm:text-2xl"
          >
            § 01
          </span>
          {t("heading")}
        </h2>
        <p className="mb-16 max-w-xl text-lg text-muted-foreground">{t("description")}</p>

        {/* Personal projects — 2-col grid */}
        <div className="mb-10 flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-12">
          {personalProjects.map((project, i) => (
            <div
              key={project.slug}
              className={
                i === personalProjects.length - 1 && personalProjects.length % 2 === 1
                  ? "md:col-span-2 md:mx-auto md:max-w-[50%]"
                  : undefined
              }
            >
              <ProjectCard
                project={project}
                index={i}
                accentColor={project.accentColor ?? DEFAULT_ACCENT}
                chapter={project.chapterLabel ?? ""}
                narrative={project.narrative ?? ""}
                reducedMotion={!!prefersReducedMotion}
                isDesktop={isDesktop}
                config={PERSONAL_ANIM_CONFIGS[i % PERSONAL_ANIM_CONFIGS.length]}
                isProfessional={false}
              />
            </div>
          ))}
        </div>

        {/* Professional projects — full width */}
        {professionalProjects.length > 0 && (
          <div className="flex flex-col gap-8">
            {professionalProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={personalProjects.length + i}
                accentColor={project.accentColor ?? DEFAULT_ACCENT}
                chapter={project.chapterLabel ?? ""}
                narrative={project.narrative ?? ""}
                reducedMotion={!!prefersReducedMotion}
                isDesktop={isDesktop}
                config={PROFESSIONAL_ANIM_CONFIGS[i % PROFESSIONAL_ANIM_CONFIGS.length]}
                isProfessional={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  accentColor,
  chapter,
  narrative,
  reducedMotion,
  isDesktop,
  config,
  isProfessional,
}: {
  project: Portfolio.Project;
  index: number;
  accentColor: string;
  chapter: string;
  narrative: string;
  reducedMotion: boolean;
  isDesktop: boolean;
  config: CardAnimConfig;
  isProfessional: boolean;
}) {
  const { push, prefetch } = useViewTransitionRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const href = `/portfolio/${project.slug}`;

  return (
    <motion.div
      ref={ref}
      initial={
        reducedMotion
          ? undefined
          : {
              opacity: 0,
              x: isDesktop ? config.entranceX : 0,
              y: isDesktop ? config.entranceY || 60 : 50,
              scale: config.entranceScale,
            }
      }
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, delay: reducedMotion ? 0 : index * 0.13, ease: "easeOut" }}
    >
      <article
        className="group relative overflow-hidden rounded-xl border border-border bg-card"
        onMouseEnter={() => prefetch(href)}
      >
        {/* Image */}
        {project.thumbnail && (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              push(href);
            }}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.thumbnail.url}
                alt={project.thumbnail.alt ?? project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-safe:group-focus-within:scale-105"
                sizes={
                  isProfessional
                    ? "(max-width: 768px) 100vw, 100vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
              />
              {/* Tinted overlay — single per-card surface carrying hue */}
              <div
                className="absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-80"
                style={{
                  background: `linear-gradient(to top, color-mix(in oklch, ${accentColor} 35%, oklch(0.1 0 0)) 0%, transparent 70%)`,
                }}
              />
            </div>
          </a>
        )}

        {/* Content */}
        <div className="relative p-6">
          {/* Chapter marker */}
          <div className="mb-3 flex items-center gap-3">
            <span className="shrink-0 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {chapter}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-foreground">
            <a
              href={href}
              onClick={(e) => {
                e.preventDefault();
                push(href);
              }}
            >
              {project.title}
            </a>
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{narrative}</p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.techs.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="border-border bg-white/5 text-xs text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
