import { getAllProjects, getShowcaseProjects } from "@/app/actions/portfolio";
import { PortfolioShowcase } from "@/ui/portfolio/components/PortfolioShowcase";
import { ProjectShowcaseGrid } from "@/ui/portfolio/components/ProjectShowcaseGrid";
import { getLocale } from "next-intl/server";

export async function PortfolioSection() {
  const locale = await getLocale();
  const showcaseProjects = await getShowcaseProjects(locale);

  return <PortfolioShowcase projects={showcaseProjects} />;
}

export async function PortfolioReelSection() {
  const locale = await getLocale();
  const showcaseProjects = await getShowcaseProjects(locale);

  return <ProjectShowcaseGrid projects={showcaseProjects} />;
}
