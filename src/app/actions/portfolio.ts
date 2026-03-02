import { Portfolio, type PayloadProject } from "@/core/portfolio";
import { getPayloadSafe } from "@/lib/payload";

export async function getAllProjects(locale: string): Promise<Portfolio.Project[]> {
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
}

export async function getProject(slug: string, locale: string): Promise<Portfolio.Project | null> {
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
}
