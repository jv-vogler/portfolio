import { Skills, type PayloadSkill } from "@/core/skills";
import { getPayloadSafe } from "@/lib/payload";

export async function getAllSkills(locale: string): Promise<Skills.Skill[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const { docs } = await payload.find({
    collection: "skills",
    locale: locale as "en" | "pt",
    where: {
      showInExperience: { equals: true },
    },
    sort: "sortOrder",
    limit: 200,
    overrideAccess: true,
  });

  return (docs as PayloadSkill[]).map(Skills.fromPayload);
}

export async function getSkillsByCategory(
  category: Skills.Category,
  locale: string,
): Promise<Skills.Skill[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const { docs } = await payload.find({
    collection: "skills",
    locale: locale as "en" | "pt",
    where: {
      category: { equals: category },
      showInExperience: { equals: true },
    },
    sort: "sortOrder",
    limit: 200,
    overrideAccess: true,
  });

  return (docs as PayloadSkill[]).map(Skills.fromPayload);
}
