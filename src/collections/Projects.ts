import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "featured", "updatedAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Auto-generated from the English title on create. Can be edited manually.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "techs",
      type: "relationship",
      relationTo: "skills",
      hasMany: true,
    },
    {
      name: "demoUrl",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "codeUrl",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first.",
      },
    },
    {
      name: "showcaseEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Include this project in the home page showcase.",
      },
    },
    {
      name: "showcaseOrder",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first in the showcase.",
      },
    },
    {
      name: "accentColor",
      type: "text",
      admin: {
        position: "sidebar",
        description: "oklch color string, e.g. oklch(0.70 0.02 250)",
      },
    },
    {
      name: "isProfessional",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Professional projects use a full-width layout in the showcase.",
      },
    },
    {
      name: "narrative",
      type: "textarea",
      localized: true,
    },
    {
      name: "chapterLabel",
      type: "text",
      localized: true,
    },
    {
      name: "caseStudy",
      type: "group",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "content",
          type: "richText",
          localized: true,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === "create" && !data.slug && data.title) {
          const titleValue =
            typeof data.title === "object" ? (data.title as Record<string, string>).en : data.title;
          if (titleValue) {
            data.slug = slugify(titleValue);
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, context }) => {
        if (context.disableRevalidate) return;

        const slug = doc.slug as string | undefined;
        const locales = ["en", "pt"];

        for (const locale of locales) {
          revalidatePath(`/${locale}`);
          if (slug) {
            revalidatePath(`/${locale}/portfolio/${slug}`);
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc, context }) => {
        if (context?.disableRevalidate) return;

        const slug = doc.slug as string | undefined;
        const locales = ["en", "pt"];

        for (const locale of locales) {
          revalidatePath(`/${locale}`);
          if (slug) {
            revalidatePath(`/${locale}/portfolio/${slug}`);
          }
        }
      },
    ],
  },
};
