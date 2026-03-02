import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

export const Skills: CollectionConfig = {
  slug: "skills",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "sortOrder"],
  },
  fields: [
    {
      name: "name",
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
        description: "Used for icon lookup. Auto-generated from the English name on create.",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
        { label: "Tools & Platform", value: "tools" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first within their category.",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create" && !data.slug && data.name) {
          data.slug = slugify(data.name as string);
        }
        return data;
      },
    ],
    afterChange: [
      ({ context }) => {
        if (context?.disableRevalidate) return;
        revalidatePath("/en", "page");
        revalidatePath("/pt", "page");
      },
    ],
    afterDelete: [
      ({ context }) => {
        if (context?.disableRevalidate) return;
        revalidatePath("/en", "page");
        revalidatePath("/pt", "page");
      },
    ],
  },
};

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
