import { revalidatePath } from "next/cache";
import type { GlobalConfig } from "payload";

export const AboutGlobal: GlobalConfig = {
  slug: "about",
  label: "About",
  admin: {
    description: "Q&A items displayed on the About page.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context.disableRevalidate) return;
        revalidatePath("/[locale]/about", "page");
      },
    ],
  },
  fields: [
    {
      name: "items",
      label: "Q&A Items",
      type: "array",
      admin: {
        description: "Each row is a question/answer pair shown on the About page.",
      },
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "answer",
          type: "textarea",
          required: true,
          localized: true,
        },
      ],
    },
  ],
};
