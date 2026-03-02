import { Skills, type PayloadSkill } from "@/core/skills";
import config from "@payload-config";
import { getPayload } from "payload";

export async function getAllSkills(locale: string): Promise<Skills.Skill[]> {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "skills",
    locale: locale as "en" | "pt",
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
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "skills",
    locale: locale as "en" | "pt",
    where: {
      category: { equals: category },
    },
    sort: "sortOrder",
    limit: 200,
    overrideAccess: true,
  });

  return (docs as PayloadSkill[]).map(Skills.fromPayload);
}
