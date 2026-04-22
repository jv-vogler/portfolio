/** Known brand names that need exact casing. */
const BRAND_MAP: Record<string, string> = {
  nextjs: "Next.js",
  nodejs: "Node.js",
  tailwindcss: "Tailwind CSS",
  typescript: "TypeScript",
  javascript: "JavaScript",
  postgresql: "PostgreSQL",
  graphql: "GraphQL",
  reactnative: "React Native",
  "ruby-on-rails": "Ruby on Rails",
  godot: "Godot",
  gdscript: "GDScript",
  expo: "Expo",
  firebase: "Firebase",
  docker: "Docker",
  aws: "AWS",
};

/**
 * Formats a raw tag slug into a human-readable label.
 * e.g. "web-development" → "Web Development", "nextjs" → "Next.js"
 */
export function formatTag(tag: string): string {
  const normalized = tag.toLowerCase().trim();
  if (BRAND_MAP[normalized]) return BRAND_MAP[normalized];
  return normalized.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
