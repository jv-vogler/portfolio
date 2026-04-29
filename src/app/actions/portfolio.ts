import { Portfolio, type PayloadProject } from "@/core/portfolio";
import { getPayloadSafe } from "@/lib/payload";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getAllProjects = cache(async function getAllProjects(
  locale: string,
): Promise<Portfolio.Project[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const { docs } = await payload.find({
    collection: "projects",
    locale: locale as "en" | "pt",
    sort: "sortOrder",
    depth: 1,
    limit: 100,
    overrideAccess: true,
  });

  return (docs as PayloadProject[]).map(Portfolio.fromPayload);
});

export const getShowcaseProjects = cache(async function getShowcaseProjects(
  locale: string,
): Promise<Portfolio.Project[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const { docs } = await payload.find({
    collection: "projects",
    locale: locale as "en" | "pt",
    where: {
      showcaseEnabled: { equals: true },
    },
    sort: "showcaseOrder",
    depth: 1,
    limit: 100,
    overrideAccess: true,
  });

  return (docs as PayloadProject[]).map(Portfolio.fromPayload);
});

/** Cached minimal project data for CommandPalette — persists across requests for 1 hour. */
export const getCachedMinimalProjects = unstable_cache(
  async (locale: string) => {
    const projects = await getAllProjects(locale);
    return projects.map(({ slug, title, techs }) => ({ slug, title, techs }));
  },
  ["command-palette-projects"],
  { revalidate: 3600 },
);

export const getProject = cache(async function getProject(
  slug: string,
  locale: string,
): Promise<Portfolio.Project | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const { docs } = await payload.find({
    collection: "projects",
    locale: locale as "en" | "pt",
    where: {
      slug: { equals: slug },
    },
    depth: 1,
    limit: 1,
    overrideAccess: true,
  });

  if (!docs.length) return null;

  return Portfolio.fromPayload(docs[0] as PayloadProject);
});
