// Loose type for Payload Skill document (until payload-types.ts is regenerated)
export type PayloadSkill = {
  id: string | number;
  slug: string;
  name: string;
  category: "frontend" | "backend" | "tools";
  sortOrder?: number | null;
};

export namespace Skills {
  export type Category = "frontend" | "backend" | "tools";

  export type Skill = {
    slug: string;
    name: string;
    category: Category;
  };

  export const categories: Category[] = ["frontend", "backend", "tools"];

  export function byCategory(skills: Skill[], category: Category): Skill[] {
    return skills.filter((s) => s.category === category);
  }

  export function fromPayload(doc: PayloadSkill): Skill {
    return {
      slug: doc.slug,
      name: doc.name,
      category: doc.category,
    };
  }
}
