import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Database adapter (PostgreSQL)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  // Rich text editor (Lexical)
  editor: lexicalEditor(),

  // Collections (will add Users, Media, Posts, Projects, Skills in later phases)
  collections: [],

  // Secret for encrypting cookies and JWT tokens
  secret: process.env.PAYLOAD_SECRET,

  // TypeScript type generation
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Admin panel configuration
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
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
