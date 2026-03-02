import type { Payload } from "payload";

// ---------------------------------------------------------------------------
// Skills data (migrated from src/core/skills.ts + message file translations)
// ---------------------------------------------------------------------------

interface SkillSeedData {
  slug: string;
  category: "frontend" | "backend" | "tools";
  sortOrder: number;
  en: { name: string };
  pt: { name: string };
}

const skills: SkillSeedData[] = [
  // Frontend
  {
    slug: "typescript",
    category: "frontend",
    sortOrder: 1,
    en: { name: "TypeScript" },
    pt: { name: "TypeScript" },
  },
  {
    slug: "react",
    category: "frontend",
    sortOrder: 2,
    en: { name: "React" },
    pt: { name: "React" },
  },
  {
    slug: "nextdotjs",
    category: "frontend",
    sortOrder: 3,
    en: { name: "Next.js" },
    pt: { name: "Next.js" },
  },
  {
    slug: "tailwindcss",
    category: "frontend",
    sortOrder: 4,
    en: { name: "Tailwind CSS" },
    pt: { name: "Tailwind CSS" },
  },
  {
    slug: "html-css",
    category: "frontend",
    sortOrder: 5,
    en: { name: "HTML & CSS" },
    pt: { name: "HTML & CSS" },
  },

  // Backend
  {
    slug: "nodedotjs",
    category: "backend",
    sortOrder: 6,
    en: { name: "Node.js" },
    pt: { name: "Node.js" },
  },
  {
    slug: "rubyonrails",
    category: "backend",
    sortOrder: 7,
    en: { name: "Ruby on Rails" },
    pt: { name: "Ruby on Rails" },
  },
  {
    slug: "postgresql",
    category: "backend",
    sortOrder: 8,
    en: { name: "PostgreSQL" },
    pt: { name: "PostgreSQL" },
  },

  // Tools & Platform
  { slug: "git", category: "tools", sortOrder: 9, en: { name: "Git" }, pt: { name: "Git" } },
  { slug: "aws", category: "tools", sortOrder: 10, en: { name: "AWS" }, pt: { name: "AWS" } },
  {
    slug: "ai",
    category: "tools",
    sortOrder: 11,
    en: { name: "AI / Agentic" },
    pt: { name: "IA / Agentes" },
  },
  {
    slug: "docker",
    category: "tools",
    sortOrder: 12,
    en: { name: "Docker" },
    pt: { name: "Docker" },
  },
];

export async function seedSkills(payload: Payload) {
  for (const skill of skills) {
    // Check if skill already exists (idempotent)
    const existing = await payload.find({
      collection: "skills",
      where: { slug: { equals: skill.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      console.log(`  • Skipping "${skill.slug}" (already exists)`);
      continue;
    }

    // Create with English locale first
    const created = await payload.create({
      collection: "skills",
      locale: "en",
      data: {
        slug: skill.slug,
        name: skill.en.name,
        category: skill.category,
        sortOrder: skill.sortOrder,
      },
      context: { disableRevalidate: true },
      overrideAccess: true,
    });

    // Update with Portuguese locale
    await payload.update({
      collection: "skills",
      id: created.id,
      locale: "pt",
      data: {
        name: skill.pt.name,
      },
      context: { disableRevalidate: true },
      overrideAccess: true,
    });

    console.log(`  ✓ Seeded skill: ${skill.slug}`);
  }

  console.log(`  → ${skills.length} skills processed.`);
}
