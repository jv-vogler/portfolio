import { revalidatePath } from "next/cache";
import type { GlobalConfig } from "payload";

export const AboutGlobal: GlobalConfig = {
  slug: "about",
  label: "About",
  admin: {
    description: "Profile info and Q&A items for the About page and About card.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context.disableRevalidate) return;
        revalidatePath("/[locale]", "page");
        revalidatePath("/[locale]/about", "page");
      },
    ],
  },
  fields: [
    {
      name: "profileImage",
      label: "Card Profile Image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Profile photo used on the home page About card.",
      },
    },
    {
      name: "aboutPageImage",
      label: "About Page Image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Photo displayed on the About page (can differ from the card image).",
      },
    },
    {
      name: "elevatorPitch",
      label: "Elevator Pitch",
      type: "textarea",
      localized: true,
      admin: {
        description: "Short bio shown on the home page About card.",
      },
    },
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
