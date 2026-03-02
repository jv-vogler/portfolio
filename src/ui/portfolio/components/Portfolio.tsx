import { getAllProjects } from "@/app/actions/portfolio";
import { PortfolioGrid } from "@/ui/portfolio/components/PortfolioGrid";
import { getLocale } from "next-intl/server";

export async function PortfolioSection() {
  const locale = await getLocale();
  const projects = await getAllProjects(locale);

  return <PortfolioGrid projects={projects} />;
}
