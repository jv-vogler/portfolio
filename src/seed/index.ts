/**
 * Payload seed script — populates the database with initial content.
 *
 * Usage:
 *   pnpm seed
 *
 * Make sure your .env.local (or .env) contains DATABASE_URL / POSTGRES_URL
 * and PAYLOAD_SECRET before running.
 */

import config from "@payload-config";
import { getPayload } from "payload";

import { seedBlog } from "./blog";
import { seedPortfolio } from "./portfolio";

async function main() {
  console.log("🌱 Starting seed...\n");

  const payload = await getPayload({ config });

  // ── Phase 4: Blog posts ──────────────────────────────────────────────────
  console.log("📚 Seeding blog posts...");
  await seedBlog(payload);

  // ── Phase 6: Portfolio projects ──────────────────────────────────────────
  console.log("\n🗂️  Seeding portfolio projects...");
  await seedPortfolio(payload);

  // ── Future phases will add skills seed here ───────────────────────────────

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
