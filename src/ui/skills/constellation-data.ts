export type ConstellationNode = {
  id: string;
  label: string;
  slug: string;
  cluster: "frontend" | "backend" | "tools" | "ai";
  x: number; // percentage 0-100
  y: number; // percentage 0-100
};

export type ConstellationEdge = [string, string];

export const CLUSTER_COLORS = {
  frontend: "oklch(0.65 0.24 155)", // teal
  backend: "oklch(0.7 0.15 50)", // warm
  tools: "oklch(0.65 0.18 290)", // purple
  ai: "oklch(0.7 0.2 100)", // gold
} as const;

export const NODES: ConstellationNode[] = [
  // Frontend cluster — upper-left region
  { id: "nextjs", label: "Next.js", slug: "nextdotjs", cluster: "frontend", x: 25, y: 12 },
  { id: "react", label: "React", slug: "react", cluster: "frontend", x: 10, y: 30 },
  { id: "typescript", label: "TypeScript", slug: "typescript", cluster: "frontend", x: 40, y: 28 },
  { id: "tailwind", label: "Tailwind", slug: "tailwindcss", cluster: "frontend", x: 26, y: 45 },

  // AI cluster — center
  { id: "ai", label: "AI Integrations", slug: "ai", cluster: "ai", x: 52, y: 40 },
  { id: "agentic", label: "Agentic Engineering", slug: "ai", cluster: "ai", x: 62, y: 55 },

  // Backend cluster — right side
  { id: "nodejs", label: "Node.js", slug: "nodedotjs", cluster: "backend", x: 75, y: 15 },
  { id: "rails", label: "Ruby on Rails", slug: "rubyonrails", cluster: "backend", x: 88, y: 35 },
  { id: "postgresql", label: "PostgreSQL", slug: "postgresql", cluster: "backend", x: 74, y: 48 },
  { id: "firebase", label: "Firebase", slug: "firebase", cluster: "backend", x: 85, y: 62 },

  // Tools cluster — bottom
  { id: "docker", label: "Docker", slug: "docker", cluster: "tools", x: 18, y: 78 },
  { id: "git", label: "Git", slug: "git", cluster: "tools", x: 48, y: 82 },
  { id: "aws", label: "AWS", slug: "aws", cluster: "tools", x: 76, y: 80 },
];

export const EDGES: ConstellationEdge[] = [
  // Frontend connections
  ["react", "nextjs"],
  ["nextjs", "typescript"],
  ["react", "tailwind"],
  ["typescript", "tailwind"],

  // Backend connections
  ["nodejs", "rails"],
  ["nodejs", "postgresql"],
  ["rails", "postgresql"],
  ["postgresql", "firebase"],

  // Tools connections
  ["docker", "git"],
  ["git", "aws"],

  // AI hub
  ["ai", "agentic"],

  // Cross-cluster bridges
  ["nextjs", "nodejs"],
  ["tailwind", "ai"],
  ["ai", "postgresql"],
  ["agentic", "firebase"],
  ["agentic", "aws"],
  ["docker", "tailwind"],
];
