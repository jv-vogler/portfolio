import { getAllSkills } from "@/app/actions/skills";
import { Experience } from "@/ui/experience/components/Experience";
import { getLocale } from "next-intl/server";

export async function ExperienceSection() {
  const locale = await getLocale();
  const skills = await getAllSkills(locale);

  return <Experience skills={skills} />;
}
