import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Database adapter (Vercel Postgres / Neon)
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),

  // Rich text editor (Lexical)
  editor: lexicalEditor(),

  // Collections (will add Users, Media, Posts, Projects, Skills in later phases)
  collections: [],

  // Secret for encrypting cookies and JWT tokens
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript type generation
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Admin panel configuration
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(payload)/importMap.js'),
    },
  },

  // Localization configuration (matching next-intl locales)
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Português',
        code: 'pt',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // Sharp for image processing
  sharp,
})
