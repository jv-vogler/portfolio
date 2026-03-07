import type { SerializedEditorState } from "lexical";

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
  showcaseEnabled?: boolean | null;
  showcaseOrder?: number | null;
  accentColor?: string | null;
  isProfessional?: boolean | null;
  narrative?: string | null;
  chapterLabel?: string | null;
  caseStudy?: {
    enabled?: boolean | null;
    content?: SerializedEditorState | null;
  } | null;
};

export namespace Portfolio {
  export type CaseStudy = {
    content: SerializedEditorState;
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
    showcaseEnabled?: boolean;
    showcaseOrder?: number;
    accentColor?: string;
    isProfessional?: boolean;
    narrative?: string;
    chapterLabel?: string;
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
      techs: (doc.techs ?? []).map((tech) => {
        if (tech !== null && typeof tech === "object" && "name" in tech) return tech.name;
        return String(tech);
      }),
      demoUrl: doc.demoUrl ?? undefined,
      codeUrl: doc.codeUrl ?? undefined,
      featured: doc.featured ?? false,
      showcaseEnabled: doc.showcaseEnabled ?? false,
      showcaseOrder: doc.showcaseOrder ?? undefined,
      accentColor: doc.accentColor ?? undefined,
      isProfessional: doc.isProfessional ?? false,
      narrative: doc.narrative ?? undefined,
      chapterLabel: doc.chapterLabel ?? undefined,
      caseStudy:
        doc.caseStudy?.enabled && doc.caseStudy.content
          ? { content: doc.caseStudy.content }
          : undefined,
    };
  }
}
