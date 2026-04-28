"use client";

import type { Portfolio } from "@/core/portfolio";
import { useViewTransitionRouter } from "@/ui/lib/useViewTransitionRouter";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export type LayoutVariant = "hero" | "left" | "right-compact" | "full-bleed" | "center";

type Props = {
  project: Portfolio.Project;
  layoutVariant: LayoutVariant;
  index: number;
  reducedMotion: boolean;
  chapter: string;
  narrative: string;
};

// ---------------------------------------------------------------------------
// Scroll-linked helpers
// ---------------------------------------------------------------------------

/**
 * Every section is wrapped in a tall container. As the viewport scrolls
 * through it, `scrollYProgress` drives all transforms continuously —
 * nothing fires once and stops.
 */
function useParallax(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { scrollYProgress };
}

// ---------------------------------------------------------------------------
// Clickable title — navigates with View Transition
// ---------------------------------------------------------------------------

function ProjectTitle({
  slug,
  children,
  className,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { push } = useViewTransitionRouter();
  const href = `/portfolio/${slug}`;

  return (
    <h3 className={`w-fit ${className ?? ""}`}>
      <a
        href={href}
        onClick={(e) => {
          // Allow modifier-clicks (open in new tab, etc.) to use default behaviour.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          push(href);
        }}
        className="cursor-pointer rounded-sm outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {children}
      </a>
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Layout: Hero — 100vh, image fills screen, text floats up from bottom
// ---------------------------------------------------------------------------

function HeroLayout({ project, reducedMotion, chapter, narrative }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useParallax(ref);

  // Image: slow parallax (moves less than scroll)
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1]);

  // Text: enters from below, pins in the middle zone, then leaves
  const textY = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [120, 0, 0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  // Chapter label: slightly ahead of text
  const chapterY = useTransform(scrollYProgress, [0.05, 0.3, 0.65, 0.85], [80, 0, 0, -60]);
  const chapterOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.7, 0.85], [0, 1, 1, 0]);

  return (
    <article ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 flex h-screen w-full items-end overflow-hidden">
        {project.thumbnail && (
          <motion.div
            style={reducedMotion ? undefined : { y: imageY, scale: imageScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt ?? project.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-[12vh] sm:px-10 lg:px-16">
          {/* Chapter marker — the one intentional accent moment for this viewport (Principle 5). */}
          <motion.span
            style={reducedMotion ? undefined : { y: chapterY, opacity: chapterOpacity }}
            className="mb-4 block text-sm font-medium tracking-widest text-primary uppercase"
          >
            {chapter}
          </motion.span>
          <motion.div style={reducedMotion ? undefined : { y: textY, opacity: textOpacity }}>
            <ProjectTitle
              slug={project.slug}
              className="mb-6 text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl"
            >
              {project.title}
            </ProjectTitle>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {narrative}
            </p>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Layout: Left — image left, text right, both parallax at different rates
// ---------------------------------------------------------------------------

function LeftLayout({ project, reducedMotion, chapter, narrative }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useParallax(ref);

  // Image: moves slower than scroll (parallax feel)
  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  // Text: enters from right/below, stays, exits up
  const textY = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [100, 0, 0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const textX = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [60, 0, 0, 0]);

  // Image opacity
  const imageOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [0, 1, 1, 0]);

  return (
    <article ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 grid h-screen items-center gap-0 overflow-hidden lg:grid-cols-2">
        {/* Image side */}
        <motion.div
          style={reducedMotion ? undefined : { y: imageY, opacity: imageOpacity }}
          className="relative h-full"
        >
          {project.thumbnail && (
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt ?? project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </motion.div>

        {/* Text side */}
        <div className="flex h-full items-center px-6 sm:px-10 lg:px-16">
          <motion.div
            style={reducedMotion ? undefined : { y: textY, opacity: textOpacity, x: textX }}
          >
            <span className="mb-4 block text-sm font-medium tracking-widest text-primary uppercase">
              {chapter}
            </span>
            <ProjectTitle
              slug={project.slug}
              className="mb-6 text-4xl font-bold text-foreground sm:text-5xl"
            >
              {project.title}
            </ProjectTitle>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">{narrative}</p>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Layout: Right-compact — text left, image right, offset feel
// ---------------------------------------------------------------------------

function RightCompactLayout({ project, reducedMotion, chapter, narrative }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useParallax(ref);

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0.1, 0.4], [1.1, 1]);

  const textY = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [100, 0, 0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const textX = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [-60, 0, 0, 0]);

  const imageOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [0, 1, 1, 0]);

  return (
    <article ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 grid h-screen items-center gap-0 overflow-hidden lg:grid-cols-2">
        {/* Text side */}
        <div className="order-2 flex h-full items-center px-6 sm:px-10 lg:order-1 lg:px-16">
          <motion.div
            style={reducedMotion ? undefined : { y: textY, opacity: textOpacity, x: textX }}
          >
            <span className="mb-4 block text-sm font-medium tracking-widest text-primary uppercase">
              {chapter}
            </span>
            <ProjectTitle
              slug={project.slug}
              className="mb-6 text-4xl font-bold text-foreground sm:text-5xl"
            >
              {project.title}
            </ProjectTitle>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">{narrative}</p>
          </motion.div>
        </div>

        {/* Image side */}
        <motion.div
          style={
            reducedMotion ? undefined : { y: imageY, scale: imageScale, opacity: imageOpacity }
          }
          className="relative order-1 h-full lg:order-2"
        >
          {project.thumbnail && (
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt ?? project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </motion.div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Layout: Full-bleed — image fills entire screen, text card floats over it
// ---------------------------------------------------------------------------

function FullBleedLayout({ project, reducedMotion, chapter, narrative }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useParallax(ref);

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1.05]);

  const cardY = useTransform(scrollYProgress, [0.15, 0.4, 0.65, 0.9], [150, 0, 0, -100]);
  const cardOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <article ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {project.thumbnail && (
          <motion.div
            style={reducedMotion ? undefined : { y: imageY, scale: imageScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt ?? project.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        <motion.div
          style={reducedMotion ? undefined : { y: cardY, opacity: cardOpacity }}
          className="relative z-10 mx-6 max-w-2xl rounded-2xl bg-card/80 p-8 shadow-2xl ring-1 ring-border/30 backdrop-blur-lg sm:mx-0 sm:p-12"
        >
          <span className="mb-4 block text-sm font-medium tracking-widest text-primary uppercase">
            {chapter}
          </span>
          <ProjectTitle
            slug={project.slug}
            className="mb-6 text-4xl font-bold text-foreground sm:text-5xl"
          >
            {project.title}
          </ProjectTitle>
          <p className="text-lg leading-relaxed text-muted-foreground">{narrative}</p>
        </motion.div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Layout: Center — text-only closing, everything fades in from different rates
// ---------------------------------------------------------------------------

function CenterLayout({ project, reducedMotion, chapter, narrative }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useParallax(ref);

  const chapterY = useTransform(scrollYProgress, [0.05, 0.3, 0.7, 0.9], [60, 0, 0, -40]);
  const chapterOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.9], [0, 1, 1, 0]);

  const titleY = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [80, 0, 0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  const bodyY = useTransform(scrollYProgress, [0.15, 0.4, 0.65, 0.9], [100, 0, 0, -60]);
  const bodyOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <article ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.span
            style={reducedMotion ? undefined : { y: chapterY, opacity: chapterOpacity }}
            className="mb-6 block text-sm font-medium tracking-widest text-primary uppercase"
          >
            {chapter}
          </motion.span>
          <motion.div style={reducedMotion ? undefined : { y: titleY, opacity: titleOpacity }}>
            <ProjectTitle
              slug={project.slug}
              className="mb-8 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl"
            >
              {project.title}
            </ProjectTitle>
          </motion.div>
          <motion.p
            style={reducedMotion ? undefined : { y: bodyY, opacity: bodyOpacity }}
            className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {narrative}
          </motion.p>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const LAYOUT_COMPONENTS: Record<LayoutVariant, React.ComponentType<Props>> = {
  hero: HeroLayout,
  left: LeftLayout,
  "right-compact": RightCompactLayout,
  "full-bleed": FullBleedLayout,
  center: CenterLayout,
};

export function ProjectStorySection(props: Props) {
  const Layout = LAYOUT_COMPONENTS[props.layoutVariant];
  return <Layout {...props} />;
}
