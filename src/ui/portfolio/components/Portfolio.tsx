import { getShowcaseProjects } from "@/app/actions/portfolio";
import { ProjectShowcaseGrid } from "@/ui/portfolio/components/ProjectShowcaseGrid";
import { getLocale } from "next-intl/server";

export async function PortfolioReelSection() {
  const locale = await getLocale();
  const showcaseProjects = await getShowcaseProjects(locale);

  return <ProjectShowcaseGrid projects={showcaseProjects} />;
}
