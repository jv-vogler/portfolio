import fs from "fs";
import path from "path";
import type { Payload } from "payload";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Portfolio item definitions (migrated from src/core/portfolio.ts)
// ---------------------------------------------------------------------------

interface ProjectSeedData {
  slug: string;
  thumbnail: string; // filename in public/images/portfolio/
  techs: string[]; // human-readable tech names
  demoUrl?: string;
  codeUrl?: string;
  featured?: boolean;
  sortOrder: number;
  en: {
    title: string;
    description: string;
    caseStudy?: {
      problem: string;
      approach: string;
      outcome: string;
      learnings: string;
    };
  };
  pt: {
    title: string;
    description: string;
    caseStudy?: {
      problem: string;
      approach: string;
      outcome: string;
      learnings: string;
    };
  };
}

// Category hints for new skills that aren't in the core 12
const TECH_CATEGORY_HINTS: Record<string, "frontend" | "backend" | "tools"> = {
  react: "frontend",
  "next.js": "frontend",
  typescript: "frontend",
  "tailwind css": "frontend",
  "html & css": "frontend",
  html: "frontend",
  css: "frontend",
  javascript: "frontend",
  "chakra ui": "frontend",
  "styled components": "frontend",
  vite: "tools",
  webpack: "tools",
  "node.js": "backend",
  "ruby on rails": "backend",
  postgresql: "backend",
  firebase: "backend",
  git: "tools",
  aws: "tools",
  "ai / agentic": "tools",
  docker: "tools",
  openai: "tools",
  recoil: "frontend",
  godot: "tools",
  gdscript: "tools",
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

const projects: ProjectSeedData[] = [
  {
    slug: "ai-integration-platform",
    thumbnail: "thumb-ai-platform.png",
    techs: ["React", "Next.js", "TypeScript", "Node.js", "AWS", "OpenAI"],
    featured: true,
    sortOrder: 1,
    en: {
      title: "AI Integration Platform",
      description:
        "A full-stack platform that orchestrates multiple AI providers behind a unified API, enabling teams to build and deploy AI-powered workflows at scale.",
      caseStudy: {
        problem:
          "The company needed to integrate multiple AI providers into existing products without vendor lock-in, while keeping latency low and costs predictable. Each team was building ad-hoc integrations, leading to duplicated effort and inconsistent quality.",
        approach:
          "I designed a layered Node.js/TypeScript service on AWS that abstracts provider-specific APIs behind a unified interface. The architecture includes request routing, response caching, rate limiting, and cost tracking. The React/Next.js dashboard lets teams monitor usage, configure workflows, and A/B test different models.",
        outcome:
          "Reduced integration time for new AI features from weeks to days. Centralized cost tracking saved ~30% on API spend. The platform now serves thousands of daily requests across multiple products.",
        learnings:
          "Building provider-agnostic abstractions requires careful API design — too thin and you lose useful features, too thick and you re-implement each SDK. Streaming responses and graceful fallback between providers were the hardest problems to solve well.",
      },
    },
    pt: {
      title: "Plataforma de Integração AI",
      description:
        "Uma plataforma full-stack que orquestra múltiplos provedores de IA por trás de uma API unificada, permitindo que equipes construam e implantem workflows com IA em escala.",
      caseStudy: {
        problem:
          "A empresa precisava integrar múltiplos provedores de IA nos produtos existentes sem dependência de fornecedor, mantendo latência baixa e custos previsíveis. Cada equipe criava integrações ad-hoc, gerando esforço duplicado e qualidade inconsistente.",
        approach:
          "Projetei um serviço em camadas com Node.js/TypeScript na AWS que abstrai as APIs específicas de cada provedor por trás de uma interface unificada. A arquitetura inclui roteamento de requisições, cache de respostas, rate limiting e rastreamento de custos. O dashboard React/Next.js permite que as equipes monitorem uso, configurem workflows e façam testes A/B com diferentes modelos.",
        outcome:
          "Reduziu o tempo de integração de novas funcionalidades de IA de semanas para dias. O rastreamento centralizado de custos economizou ~30% em gastos com API. A plataforma agora atende milhares de requisições diárias em múltiplos produtos.",
        learnings:
          "Construir abstrações agnósticas de provedor exige um design de API cuidadoso — fina demais e você perde recursos úteis, grossa demais e você reimplementa cada SDK. Streaming de respostas e fallback gracioso entre provedores foram os problemas mais difíceis de resolver bem.",
      },
    },
  },
  {
    slug: "fetchhire",
    thumbnail: "thumb-fetchhire.png",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://fetch-hire.vercel.app/",
    codeUrl: "https://github.com/jv-vogler/fetch-hire",
    sortOrder: 2,
    en: {
      title: "FetchHire",
      description: "A tool to get helpful insight and data about Github users.",
    },
    pt: {
      title: "FetchHire",
      description: "Uma ferramenta para obter informações úteis sobre usuários do Github.",
    },
  },
  {
    slug: "treasure-hunters",
    thumbnail: "thumb-treasurehunters.png",
    techs: ["Godot", "GDScript"],
    demoUrl: "https://github.com/jv-vogler/Treasure-Hunters",
    codeUrl: "https://github.com/jv-vogler/Treasure-Hunters",
    featured: true,
    sortOrder: 3,
    en: {
      title: "Treasure Hunters",
      description:
        "Treasure Hunters is a 2D platformer game where you control the feared Captain Clown Nose in a quest to recover his ship that was taken in a mutiny. Many dangers and treasures hide and await under the tree shadows of Palm Tree Island.",
    },
    pt: {
      title: "Treasure Hunters",
      description:
        "Treasure Hunters é um jogo de plataforma 2D onde você assume o controle do temido Capitão Nariz de Palhaço em busca de recuperar seu navio tomado em um motim. Diversos perigos e tesouros se escondem e o aguardam sob as sombras das árvores da Ilha das Palmeiras.",
    },
  },
  {
    slug: "voltorb-flip",
    thumbnail: "thumb-voltorbflip.png",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://voltorbflip.vercel.app/",
    codeUrl: "https://github.com/jv-vogler/voltorb-flip",
    featured: true,
    sortOrder: 4,
    en: {
      title: "Voltorb Flip",
      description:
        "Voltorb Flip is a minigame of the Goldenrod and Celadon Game Corners in the Korean and Western releases of Pokémon HeartGold and SoulSilver.",
    },
    pt: {
      title: "Voltorb Flip",
      description:
        "Voltorb Flip é um minigame dos Game Corners de Goldenrod e Celadon nas versões Coreanas e Ocidentais dos jogos Pokémon HeartGold e SoulSilver.",
    },
  },
  {
    slug: "another-reddit-clone",
    thumbnail: "thumb-reddit.png",
    techs: ["React", "Next.js", "TypeScript", "Chakra UI", "Firebase", "Recoil"],
    demoUrl: "https://another-reddit-clone-jv-vogler.vercel.app/",
    codeUrl: "https://github.com/jv-vogler/another-reddit-clone",
    sortOrder: 5,
    en: {
      title: "Another Reddit Clone",
      description:
        "A functional Reddit clone. You can log in/sign up, create and join communities, create posts, upvote/downvote posts, and more!",
    },
    pt: {
      title: "Clone do Reddit",
      description:
        "Um clone do Reddit funcional. Você pode logar/se cadastrar, criar e entrar em comunidades, criar posts, votar nos posts, e mais!",
    },
  },
  {
    slug: "portfolio-v1",
    thumbnail: "thumb-portfolio.png",
    techs: ["React", "TypeScript", "Styled Components", "Vite"],
    codeUrl: "https://github.com/jv-vogler/portfolio",
    sortOrder: 6,
    en: {
      title: "Portfolio v1",
      description: "Source code for the first version of my portfolio website.",
    },
    pt: {
      title: "Portfólio v1",
      description: "Código fonte da primeira versão do meu site portfólio.",
    },
  },
  {
    slug: "weather-app",
    thumbnail: "thumb-weatherapp.png",
    techs: ["HTML", "CSS", "JavaScript", "Webpack"],
    demoUrl: "https://jv-vogler.github.io/weather-app/",
    codeUrl: "https://github.com/jv-vogler/weather-app",
    sortOrder: 7,
    en: {
      title: "Weather App",
      description: "Weather forecast for cities around the world.",
    },
    pt: {
      title: "App de Clima",
      description: "Previsão do tempo de cidades ao redor do mundo.",
    },
  },
  {
    slug: "todo-list",
    thumbnail: "thumb-todoapp.png",
    techs: ["React", "TypeScript", "Styled Components", "Vite"],
    demoUrl: "https://jv-vogler.github.io/todo-list/",
    codeUrl: "https://github.com/jv-vogler/todo-list",
    sortOrder: 8,
    en: {
      title: "Todo List",
      description:
        'The good old "Todo List" of React beginners. Creates tasks that can be marked as complete and deleted.',
    },
    pt: {
      title: "Lista de Tarefas",
      description:
        'A boa e velha "Todo List" dos iniciantes em React. Cria tarefas que podem ser marcadas como completas e deletadas.',
    },
  },
  {
    slug: "memory-cats",
    thumbnail: "thumb-memorycats.png",
    techs: ["Godot", "GDScript"],
    demoUrl: "https://jv-vogler.itch.io/memory-cats",
    codeUrl: "https://github.com/jv-vogler/memory-cats",
    featured: true,
    sortOrder: 9,
    en: {
      title: "Memory Cats",
      description:
        "A simple yet challenging memory game, because not only you have to identify the pairs but also remember the name of each cat you've found.",
    },
    pt: {
      title: "Memory Cats",
      description:
        "Um jogo da memória simples, porém desafiador, pois além de identificar os pares iguais você também precisa se lembrar do nome de cada gato que encontrou.",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const IMAGES_DIR = path.resolve(__dirname, "../../public/images/portfolio");

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return mimeTypes[ext] ?? "image/png";
}

/**
 * Upload a thumbnail image to the Payload Media collection.
 * Returns the created media document id.
 */
async function uploadThumbnail(
  payload: Payload,
  filename: string,
  alt: string,
): Promise<string | number> {
  const filePath = path.join(IMAGES_DIR, filename);
  const fileBuffer = fs.readFileSync(filePath);
  const mimetype = getMimeType(filename);

  const media = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: fileBuffer,
      mimetype,
      name: filename,
      size: fileBuffer.length,
    },
  });

  return media.id;
}

/**
 * Build a name→id map for all skills, creating missing ones as needed.
 * New skills (not in the core 12) get showInExperience: false so they
 * don't appear in the Experience section.
 */
async function buildSkillsMap(
  payload: Payload,
  techNames: string[],
): Promise<Map<string, string | number>> {
  // Fetch all existing skills (locale-agnostic — slugs/ids are shared)
  const { docs } = await payload.find({
    collection: "skills",
    limit: 500,
    overrideAccess: true,
  });

  // Build name→id map (keyed by lowercased EN name)
  const nameToId = new Map<string, string | number>();
  for (const skill of docs) {
    nameToId.set((skill.name as string).toLowerCase(), skill.id);
  }

  // Ensure every tech name has a corresponding skill entry
  for (const techName of techNames) {
    const key = techName.toLowerCase();
    if (!nameToId.has(key)) {
      const category = TECH_CATEGORY_HINTS[key] ?? "tools";
      const slug = slugify(techName);

      // Check by slug too (e.g. "HTML & CSS" slug = "html-css")
      const bySlug = docs.find((s) => s.slug === slug);
      if (bySlug) {
        nameToId.set(key, bySlug.id);
        continue;
      }

      console.log(`    + Creating missing skill: "${techName}" (${category})`);
      const created = await payload.create({
        collection: "skills",
        locale: "en",
        data: {
          slug,
          name: techName,
          category,
          showInExperience: false,
        },
        context: { disableRevalidate: true },
        overrideAccess: true,
      });
      // PT name defaults to EN name for project-specific techs
      await payload.update({
        collection: "skills",
        id: created.id,
        locale: "pt",
        data: { name: techName },
        context: { disableRevalidate: true },
        overrideAccess: true,
      });
      nameToId.set(key, created.id);
    }
  }

  return nameToId;
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function seedPortfolio(payload: Payload): Promise<void> {
  // Collect all unique tech names across all projects
  const allTechNames = [...new Set(projects.flatMap((p) => p.techs))];
  const skillsMap = await buildSkillsMap(payload, allTechNames);

  /** Resolve tech names to skill IDs */
  function resolveSkillIds(techNames: string[]): (string | number)[] {
    return techNames
      .map((name) => skillsMap.get(name.toLowerCase()))
      .filter((id): id is string | number => id !== undefined);
  }

  // Check if projects already exist
  const existing = await payload.find({
    collection: "projects",
    limit: 1,
    overrideAccess: true,
  });

  if (existing.totalDocs > 0) {
    // ── Migration pass: update techs on existing projects ──────────────────
    console.log("  🔄 Projects already exist — migrating techs to skill relationships...");

    const { docs: existingProjects } = await payload.find({
      collection: "projects",
      limit: 100,
      overrideAccess: true,
    });

    for (const project of existingProjects) {
      const seedData = projects.find((p) => p.slug === project.slug);
      if (!seedData) continue;

      await payload.update({
        collection: "projects",
        id: project.id,
        data: {
          techs: resolveSkillIds(seedData.techs),
        },
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
      console.log(`    ✔ Updated techs for: ${project.slug}`);
    }

    console.log("  ✅ Techs migration complete.");
    return;
  }

  // ── Full seed: create all projects ─────────────────────────────────────
  for (const project of projects) {
    console.log(`  → Seeding "${project.en.title}"...`);

    // 1. Upload thumbnail
    let thumbnailId: string | number | undefined;
    try {
      thumbnailId = await uploadThumbnail(payload, project.thumbnail, project.en.title);
      console.log(`    ✔ Uploaded thumbnail: ${project.thumbnail}`);
    } catch (err) {
      console.warn(`    ⚠ Could not upload thumbnail "${project.thumbnail}":`, err);
    }

    // 2. Build project data
    const hasCaseStudy = Boolean(project.en.caseStudy);

    const projectData = {
      slug: project.slug,
      title: project.en.title,
      description: project.en.description,
      thumbnail: thumbnailId ?? undefined,
      techs: resolveSkillIds(project.techs),
      demoUrl: project.demoUrl ?? undefined,
      codeUrl: project.codeUrl ?? undefined,
      featured: project.featured ?? false,
      sortOrder: project.sortOrder,
      caseStudy: {
        enabled: hasCaseStudy,
        problem: project.en.caseStudy?.problem ?? "",
        approach: project.en.caseStudy?.approach ?? "",
        outcome: project.en.caseStudy?.outcome ?? "",
        learnings: project.en.caseStudy?.learnings ?? "",
      },
    };

    // 3. Create the project (EN locale)
    const created = await payload.create({
      collection: "projects",
      locale: "en",
      data: projectData,
      overrideAccess: true,
      context: { disableRevalidate: true },
    });

    // 4. Update the PT locale fields
    await payload.update({
      collection: "projects",
      id: created.id,
      locale: "pt",
      data: {
        title: project.pt.title,
        description: project.pt.description,
        caseStudy: {
          enabled: hasCaseStudy,
          problem: project.pt.caseStudy?.problem ?? "",
          approach: project.pt.caseStudy?.approach ?? "",
          outcome: project.pt.caseStudy?.outcome ?? "",
          learnings: project.pt.caseStudy?.learnings ?? "",
        },
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    });

    console.log(`    ✔ Created project id=${created.id} (slug: ${project.slug})`);
  }

  console.log(`  ✅ Portfolio seed complete — ${projects.length} projects created.`);
}
