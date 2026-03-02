// Populated skill relationship shape (depth >= 1)
export type PayloadSkillRef =
  | string
  | number
  | { id: string | number; slug: string; name: string; category: string };

// Loose type for Payload Project document (until payload-types.ts is regenerated)
export type PayloadProject = {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  thumbnail?: { url?: string | null; alt?: string } | null;
  techs?: Array<PayloadSkillRef> | null;
  demoUrl?: string | null;
  codeUrl?: string | null;
  featured?: boolean | null;
  sortOrder?: number | null;
  caseStudy?: {
    enabled?: boolean | null;
    problem?: string | null;
    approach?: string | null;
    outcome?: string | null;
    learnings?: string | null;
  } | null;
};

export namespace Portfolio {
  export type CaseStudy = {
    problem?: string;
    approach?: string;
    outcome?: string;
    learnings?: string;
  };

  export type Project = {
    slug: string;
    title: string;
    description: string;
    thumbnail: { url: string; alt?: string } | null;
    techs: string[];
    demoUrl?: string;
    codeUrl?: string;
    featured?: boolean;
    caseStudy?: CaseStudy;
  };

  export function fromPayload(doc: PayloadProject): Project {
    return {
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      thumbnail:
        doc.thumbnail && doc.thumbnail.url
          ? {
              url: doc.thumbnail.url,
              alt: doc.thumbnail.alt,
            }
          : null,
      techs: (doc.techs ?? []).map((t) => {
        if (t !== null && typeof t === "object" && "name" in t) return t.name;
        return String(t);
      }),
      demoUrl: doc.demoUrl ?? undefined,
      codeUrl: doc.codeUrl ?? undefined,
      featured: doc.featured ?? false,
      caseStudy: doc.caseStudy?.enabled
        ? {
            problem: doc.caseStudy.problem ?? undefined,
            approach: doc.caseStudy.approach ?? undefined,
            outcome: doc.caseStudy.outcome ?? undefined,
            learnings: doc.caseStudy.learnings ?? undefined,
          }
        : undefined,
    };
  }
}
