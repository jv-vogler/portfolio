import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Projects } from "./collections/Projects";
import { Skills } from "./collections/Skills";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Database adapter (Vercel Postgres / Neon)
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
  }),

  // Rich text editor (Lexical)
  editor: lexicalEditor(),

  // Collections
  collections: [Users, Media, Posts, Projects, Skills],

  // CORS (admin/API browser requests)
  cors: [process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"].filter(Boolean),

  // Secret for encrypting cookies and JWT tokens
  secret: process.env.PAYLOAD_SECRET || "",

  // TypeScript type generation
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Admin panel configuration
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, "app/(payload)/importMap.js"),
    },
  },

  // Localization configuration (matching next-intl locales)
  localization: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "Português",
        code: "pt",
      },
    ],
    defaultLocale: "en",
    fallback: true,
  },

  // Storage: Vercel Blob (requires BLOB_READ_WRITE_TOKEN in environment)
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],

  // Sharp for image processing
  sharp,
});
