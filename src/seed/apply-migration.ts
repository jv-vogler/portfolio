/**
 * Direct SQL migration for Phase 8:
 * - Adds show_in_experience column to skills table
 * - Creates projects_rels table (Payload relationship table for techs→skills)
 * - Drops old projects_techs array table
 *
 * Runs against the Neon DB directly, bypassing Drizzle push interactive prompts.
 *
 * Usage: tsx --env-file .env.local src/seed/apply-migration.ts
 */
import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL ?? "";

if (!connectionString) {
  console.error("❌ POSTGRES_URL not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function run() {
  const client = await pool.connect();
  console.log("🔗 Connected to Neon PostgreSQL");

  try {
    // 1. Add show_in_experience column to skills
    console.log("→ Adding show_in_experience to skills...");
    await client.query(`
      ALTER TABLE skills
      ADD COLUMN IF NOT EXISTS show_in_experience boolean DEFAULT true;
    `);
    console.log("  ✓ show_in_experience column added");

    // 2. Drop old projects_techs table (array data — will be re-seeded as relationships)
    console.log("→ Dropping projects_techs table...");
    await client.query(`DROP TABLE IF EXISTS projects_techs;`);
    console.log("  ✓ projects_techs dropped");

    // 3. Create projects_rels table (Payload relationship table format)
    console.log("→ Creating projects_rels table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects_rels (
        id        serial    PRIMARY KEY NOT NULL,
        "order"   integer,
        parent_id integer   NOT NULL REFERENCES projects(id) ON DELETE CASCADE ON UPDATE NO ACTION,
        path      varchar   NOT NULL,
        skills_id integer   REFERENCES skills(id) ON DELETE CASCADE ON UPDATE NO ACTION
      );
    `);
    console.log("  ✓ projects_rels created");

    // 4. Create indexes
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_rels_order_idx ON projects_rels ("order");`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_rels_parent_id_idx ON projects_rels (parent_id);`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_rels_path_idx ON projects_rels (path);`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_rels_skills_id_idx ON projects_rels (skills_id);`,
    );
    console.log("  ✓ Indexes created");

    console.log("\n✅ Migration applied successfully!");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(async (err) => {
  console.error("❌ Migration failed:", err);
  await pool.end();
  process.exit(1);
});
