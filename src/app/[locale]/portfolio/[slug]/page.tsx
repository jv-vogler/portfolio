import { getAllProjects, getProject } from "@/app/actions/portfolio";
import { locales } from "@/i18n/config";
import { RichTextRenderer } from "@/ui/blog/components/RichTextRenderer";
import { enrichCodeBlocks } from "@/ui/blog/lib/highlightCode";
import { Badge } from "@/ui/components/ui/badge";
import { PortfolioBackButton } from "@/ui/portfolio/components/PortfolioBackButton";
import { ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jvogler.vercel.app";

export async function generateStaticParams() {
  const projects = await getAllProjects("en");
  return projects.flatMap((project) => locales.map((locale) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);

  if (!project) return { title: "Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `${BASE_URL}/${locale}/portfolio/${slug}`,
      images: project.thumbnail ? [{ url: project.thumbnail.url }] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/portfolio/${slug}`,
      languages: {
        en: `${BASE_URL}/en/portfolio/${slug}`,
        pt: `${BASE_URL}/pt/portfolio/${slug}`,
      },
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);

  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const accent = project.accentColor ?? "oklch(0.70 0.02 250)";

  return (
    <section className="bg-[oklch(0.18_0.01_260)] py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back button */}
        <PortfolioBackButton />

        {/* HUD chapter label + title */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="shrink-0 font-mono text-xs uppercase tracking-[0.25em]"
              style={{ color: accent }}
            >
              {project.chapterLabel ?? project.title}
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                opacity: 0.4,
              }}
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-[oklch(0.95_0_0)] sm:text-4xl">
              {project.title}
            </h1>
            {project.featured && (
              <Badge
                variant="default"
                className="border-white/10 bg-white/5 text-xs text-[oklch(0.75_0_0)]"
              >
                {t("featured")}
              </Badge>
            )}
          </div>
          {project.narrative && (
            <p className="mb-2 text-lg leading-relaxed text-[oklch(0.65_0_0)]">
              {project.narrative}
            </p>
          )}
        </div>

        {/* Screenshot with HUD styling */}
        <div
          className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl"
          style={{
            border: `1px solid color-mix(in oklch, ${accent} 25%, transparent)`,
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 z-10 h-0.5 w-full"
            style={{
              background: `linear-gradient(90deg, transparent 5%, ${accent} 50%, transparent 95%)`,
            }}
          />

          {/* HUD corner brackets */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div
              className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2"
              style={{ borderColor: accent, opacity: 0.5 }}
            />
            <div
              className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2"
              style={{ borderColor: accent, opacity: 0.5 }}
            />
            <div
              className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2"
              style={{ borderColor: accent, opacity: 0.5 }}
            />
            <div
              className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2"
              style={{ borderColor: accent, opacity: 0.5 }}
            />
          </div>

          {project.thumbnail ? (
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt ?? project.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="h-full w-full bg-[oklch(0.15_0.01_260)]" />
          )}

          {/* Tinted gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, color-mix(in oklch, ${accent} 25%, oklch(0.1 0 0)) 0%, transparent 50%)`,
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

        <p className="text-lg leading-relaxed text-[oklch(0.65_0_0)] mb-6">{project.description}</p>

        {/* Tech stack */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-[oklch(0.85_0_0)]">{t("techStack")}</h2>
          <div className="flex flex-wrap gap-2">
            {project.techs.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="border-white/10 bg-white/5 text-sm text-[oklch(0.75_0_0)]"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* External links */}
        {(project.demoUrl || project.codeUrl) && (
          <div className="mb-12 flex flex-wrap gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[oklch(0.95_0_0)] transition-colors"
                style={{
                  background: `color-mix(in oklch, ${accent} 30%, oklch(0.18 0.01 260))`,
                  border: `1px solid color-mix(in oklch, ${accent} 40%, transparent)`,
                }}
              >
                <ExternalLink className="h-4 w-4" />
                {t("liveDemo")}
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[oklch(0.75_0_0)] transition-colors"
                style={{
                  border: `1px solid color-mix(in oklch, ${accent} 25%, transparent)`,
                }}
              >
                <Github className="h-4 w-4" />
                {t("viewCode")}
              </a>
            )}
          </div>
        )}

        {/* Case study — rich text */}
        {project.caseStudy && (
          <div
            className="space-y-10 pt-10"
            style={{
              borderTop: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
            }}
          >
            <h2 className="text-2xl font-bold text-[oklch(0.95_0_0)]">{t("caseStudy.heading")}</h2>
            <div className="prose prose-invert max-w-none prose-headings:text-[oklch(0.85_0_0)] prose-p:text-[oklch(0.65_0_0)] prose-a:text-[oklch(0.75_0.1_250)] prose-strong:text-[oklch(0.80_0_0)]">
              <RichTextRenderer data={await enrichCodeBlocks(project.caseStudy.content)} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
