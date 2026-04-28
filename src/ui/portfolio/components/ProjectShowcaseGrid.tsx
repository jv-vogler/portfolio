"use client";

import type { Portfolio } from "@/core/portfolio";
import { Badge } from "@/ui/components/ui/badge";
import { useViewTransitionRouter } from "@/ui/lib/useViewTransitionRouter";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DEFAULT_ACCENT = "oklch(0.70 0.02 250)";

type CardAnimConfig = {
  rotateX: number;
  rotateY: number;
  offsetX: number;
  entranceX: number;
  entranceY: number;
  entranceScale: number;
};

const PERSONAL_ANIM_CONFIGS: CardAnimConfig[] = [
  { rotateX: 2, rotateY: 6, offsetX: 8, entranceX: -140, entranceY: 0, entranceScale: 1 },
  { rotateX: 2, rotateY: -6, offsetX: -8, entranceX: 0, entranceY: 120, entranceScale: 1 },
  { rotateX: 2, rotateY: 5, offsetX: 6, entranceX: 140, entranceY: 0, entranceScale: 1 },
  { rotateX: 2, rotateY: -7, offsetX: -10, entranceX: 0, entranceY: -120, entranceScale: 1 },
  { rotateX: 2, rotateY: 0, offsetX: 0, entranceX: 0, entranceY: 0, entranceScale: 0.7 },
];

const PROFESSIONAL_ANIM_CONFIGS: CardAnimConfig[] = [
  { rotateX: 2, rotateY: 0, offsetX: 0, entranceX: 0, entranceY: 60, entranceScale: 0.85 },
  { rotateX: 2, rotateY: 0, offsetX: 0, entranceX: 0, entranceY: 60, entranceScale: 0.85 },
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

  // Split into professional and personal projects
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
    <section className="py-32" aria-label="Featured projects">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">{t("heading")}</h2>
        <p className="mb-16 max-w-xl text-lg text-muted-foreground">{t("description")}</p>

        {/* Personal projects — 2-col curved-monitor grid */}
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
  const [hovered, setHovered] = useState(false);

  // --- 3D values ---
  const rx = isDesktop ? config.rotateX : 0;
  const ry = isDesktop ? config.rotateY : isProfessional ? 0 : index % 2 === 0 ? 2 : -2;
  const ox = isDesktop ? config.offsetX : isProfessional ? 0 : index % 2 === 0 ? -4 : 4;

  const restingTransform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateX(${ox}px)`;
  const hoverTransform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) scale(1.04)";

  // --- Glow ---
  const glowRestOpacity = isProfessional ? "20%" : "15%";
  const glowRest = `0 4px 16px color-mix(in oklch, ${accentColor} ${glowRestOpacity}, transparent)`;
  const glowHover = [
    `0 0 20px color-mix(in oklch, ${accentColor} 35%, transparent)`,
    `0 0 40px color-mix(in oklch, ${accentColor} 15%, transparent)`,
  ].join(", ");

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
      style={{ zIndex: hovered ? 10 : 1, position: "relative" }}
    >
      <article
        className="group relative overflow-hidden rounded-xl"
        style={{
          transformStyle: "preserve-3d",
          transform: hovered ? hoverTransform : restingTransform,
          transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease",
          boxShadow: hovered ? glowHover : glowRest,
          background: "oklch(0.18 0.01 260)",
          border: `1px solid color-mix(in oklch, ${accentColor} 25%, transparent)`,
        }}
        onMouseEnter={() => {
          setHovered(true);
          prefetch(href);
        }}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top accent bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${accentColor} 50%, transparent 95%)`,
          }}
        />

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
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={
                  isProfessional
                    ? "(max-width: 768px) 100vw, 100vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
              />
              {/* Tinted overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, color-mix(in oklch, ${accentColor} 35%, oklch(0.1 0 0)) 0%, transparent 70%)`,
                  opacity: hovered ? 0.9 : 0.5,
                }}
              />
              {/* Scanlines */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                }}
              />
            </div>
          </a>
        )}

        {/* Content */}
        <div className="relative p-6">
          {/* HUD chapter label */}
          <div className="mb-3 flex items-center gap-3">
            <span
              className="shrink-0 font-mono text-xs uppercase tracking-[0.25em]"
              style={{ color: accentColor }}
            >
              {chapter}
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                opacity: 0.4,
              }}
            />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-[oklch(0.95_0_0)]">
            <a
              href={href}
              onClick={(e) => {
                e.preventDefault();
                push(href);
              }}
              className="transition-colors"
              style={{ color: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
            >
              {project.title}
            </a>
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-[oklch(0.65_0_0)]">{narrative}</p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.techs.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="border-white/10 bg-white/5 text-xs text-[oklch(0.75_0_0)]"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${accentColor} 50%, transparent 95%)`,
          }}
        />
      </article>
    </motion.div>
  );
}
