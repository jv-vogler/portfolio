import { Link } from "@/i18n/routing";
import type { Portfolio } from "@/core/portfolio";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

type ProjectNavigationProps = {
  prevProject: Pick<Portfolio.Project, "slug" | "title"> | null;
  nextProject: Pick<Portfolio.Project, "slug" | "title"> | null;
};

export async function ProjectNavigation({ prevProject, nextProject }: ProjectNavigationProps) {
  const t = await getTranslations("portfolio");

  return (
    <nav aria-label={t("projectNavigation")} className="mt-12 border-t border-border/40 pt-8">
      <div className="flex items-start justify-between gap-4">
        {prevProject ? (
          <Link
            href={`/portfolio/${prevProject.slug}`}
            className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="size-4 shrink-0 transition-transform group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1"
              aria-hidden="true"
            />
            <span className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                {t("prevProject")}
              </span>
              <span className="font-medium text-foreground">{prevProject.title}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject ? (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="group flex items-center gap-3 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                {t("nextProject")}
              </span>
              <span className="font-medium text-foreground">{nextProject.title}</span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
