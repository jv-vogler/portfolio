import fs from "fs";
import path from "path";
import type { Payload } from "payload";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Portfolio item definitions
// ---------------------------------------------------------------------------

interface ProjectSeedData {
  slug: string;
  thumbnail: string; // filename in public/images/portfolio/
  techs: string[]; // human-readable tech names
  demoUrl?: string;
  codeUrl?: string;
  featured?: boolean;
  sortOrder: number;
  showcaseEnabled: boolean;
  showcaseOrder: number;
  accentColor: string;
  isProfessional: boolean;
  en: {
    title: string;
    description: string;
    narrative?: string;
    chapterLabel?: string;
  };
  pt: {
    title: string;
    description: string;
    narrative?: string;
    chapterLabel?: string;
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
    slug: "treasure-hunters",
    thumbnail: "thumb-treasurehunters.png",
    techs: ["Godot", "GDScript"],
    demoUrl: "https://github.com/jv-vogler/Treasure-Hunters",
    codeUrl: "https://github.com/jv-vogler/Treasure-Hunters",
    featured: true,
    sortOrder: 1,
    showcaseEnabled: true,
    showcaseOrder: 1,
    accentColor: "oklch(0.70 0.02 250)", // common
    isProfessional: false,
    en: {
      title: "Treasure Hunters",
      description:
        "Treasure Hunters is a 2D platformer game where you control the feared Captain Clown Nose in a quest to recover his ship that was taken in a mutiny. Many dangers and treasures hide and await under the tree shadows of Palm Tree Island.",
      narrative:
        "My first real project — a 2D platformer built in Godot. Captain Clown Nose's quest for treasure taught me game loops, state machines, and the joy of shipping something playable. This is where the love for building things started.",
      chapterLabel: "Where it all began",
    },
    pt: {
      title: "Treasure Hunters",
      description:
        "Treasure Hunters é um jogo de plataforma 2D onde você assume o controle do temido Capitão Nariz de Palhaço em busca de recuperar seu navio tomado em um motim. Diversos perigos e tesouros se escondem e o aguardam sob as sombras das árvores da Ilha das Palmeiras.",
      narrative:
        "Meu primeiro projeto de verdade — um platformer 2D feito em Godot. A busca do Capitão Nariz de Palhaço por tesouros me ensinou game loops, máquinas de estado e a alegria de entregar algo jogável. Foi aqui que o amor por construir coisas começou.",
      chapterLabel: "Onde tudo começou",
    },
  },
  {
    slug: "voltorb-flip",
    thumbnail: "thumb-voltorbflip.png",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://voltorbflip.vercel.app/",
    codeUrl: "https://github.com/jv-vogler/voltorb-flip",
    featured: true,
    sortOrder: 2,
    showcaseEnabled: true,
    showcaseOrder: 2,
    accentColor: "oklch(0.70 0.02 250)", // common
    isProfessional: false,
    en: {
      title: "Voltorb Flip",
      description:
        "Voltorb Flip is a minigame of the Goldenrod and Celadon Game Corners in the Korean and Western releases of Pokémon HeartGold and SoulSilver.",
      narrative:
        "A faithful recreation of the Pokémon HG/SS minigame. Building this sharpened my logic skills and proved that web tech could deliver polished, interactive experiences — bridging my game dev roots with the web.",
      chapterLabel: "Where it all began",
    },
    pt: {
      title: "Voltorb Flip",
      description:
        "Voltorb Flip é um minigame dos Game Corners de Goldenrod e Celadon nas versões Coreanas e Ocidentais dos jogos Pokémon HeartGold e SoulSilver.",
      narrative:
        "Uma recriação fiel do minigame de Pokémon HG/SS. Construir isso afiou minha lógica e provou que tecnologias web conseguem entregar experiências interativas polidas — unindo minhas raízes em game dev com a web.",
      chapterLabel: "Onde tudo começou",
    },
  },
  {
    slug: "fetchhire",
    thumbnail: "thumb-fetchhire.png",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://fetch-hire.vercel.app/",
    codeUrl: "https://github.com/jv-vogler/fetch-hire",
    sortOrder: 3,
    showcaseEnabled: true,
    showcaseOrder: 3,
    accentColor: "oklch(0.68 0.18 150)", // uncommon
    isProfessional: false,
    en: {
      title: "FetchHire",
      description: "A tool to get helpful insight and data about Github users.",
      narrative:
        'When I decided to transition into web development, I built FetchHire — a tool that helps tech recruiters get quick insights on GitHub users. It was my way of saying "hire me" while proving I could build useful things. AI-powered enhancements are on the roadmap.',
      chapterLabel: "The career pivot",
    },
    pt: {
      title: "FetchHire",
      description: "Uma ferramenta para obter informações úteis sobre usuários do Github.",
      narrative:
        'Quando decidi migrar para desenvolvimento web, criei o FetchHire — uma ferramenta que ajuda recrutadores tech a obter insights rápidos sobre usuários do GitHub. Foi meu jeito de dizer "me contrate" enquanto provava que sabia construir coisas úteis. Melhorias com IA estão no roadmap.',
      chapterLabel: "A virada de carreira",
    },
  },
  {
    slug: "jv-portfolio",
    thumbnail: "thumb-portfolio-v2.png",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Payload CMS"],
    codeUrl: "https://github.com/jv-vogler/jv-portfolio",
    sortOrder: 4,
    showcaseEnabled: true,
    showcaseOrder: 5,
    accentColor: "oklch(0.58 0.24 300)", // epic
    isProfessional: false,
    en: {
      title: "This Portfolio",
      description:
        "The site you're looking at right now. A modern, accessible portfolio built with Next.js, Payload CMS, and Tailwind CSS — featuring i18n, dark mode, a blog with syntax highlighting, and scroll-driven animations.",
      narrative:
        "The site you're browsing right now. Built with Next.js, Payload CMS, and Tailwind — featuring i18n, dark mode, a blog, and the scroll-driven storytelling you're experiencing. A living project that evolves with me.",
      chapterLabel: "Full circle",
    },
    pt: {
      title: "Este Portfólio",
      description:
        "O site que você está vendo agora. Um portfólio moderno e acessível construído com Next.js, Payload CMS e Tailwind CSS — com i18n, modo escuro, blog com syntax highlighting e animações baseadas em scroll.",
      narrative:
        "O site que você está navegando agora. Construído com Next.js, Payload CMS e Tailwind — com i18n, modo escuro, blog e o storytelling com scroll que você está experimentando. Um projeto vivo que evolui comigo.",
      chapterLabel: "Ciclo completo",
    },
  },
  {
    slug: "joblogger",
    thumbnail: "thumb-joblogger.png",
    techs: ["Expo", "React Native", "TypeScript"],
    codeUrl: "",
    sortOrder: 5,
    showcaseEnabled: true,
    showcaseOrder: 4,
    accentColor: "oklch(0.62 0.20 255)", // rare
    isProfessional: false,
    en: {
      title: "JobLogger",
      description:
        "A lightweight job application tracker that helps you organize your job search. Log applications, track statuses, and keep notes — all in one place.",
      narrative:
        "A job application tracker with AI-powered features. JobLogger represents my current focus — combining practical tooling with intelligent automation to solve real problems.",
      chapterLabel: "Embracing AI",
    },
    pt: {
      title: "JobLogger",
      description:
        "Um rastreador leve de candidaturas de emprego que ajuda a organizar sua busca. Registre candidaturas, acompanhe status e mantenha anotações — tudo em um só lugar.",
      narrative:
        "Um rastreador de candidaturas com funcionalidades de IA. O JobLogger representa meu foco atual — combinando ferramentas práticas com automação inteligente para resolver problemas reais.",
      chapterLabel: "Abraçando a IA",
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

export async function seedPortfolio(
  payload: Payload,
  { force = false }: { force?: boolean } = {},
): Promise<void> {
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
    limit: 100,
    overrideAccess: true,
  });

  if (existing.totalDocs > 0) {
    if (force) {
      console.log(
        `  🗑️  --force: deleting ${existing.totalDocs} existing project(s) and their thumbnails...`,
      );
      for (const project of existing.docs) {
        // Delete thumbnail from media collection if present
        const thumbnailId =
          project.thumbnail && typeof project.thumbnail === "object"
            ? (project.thumbnail as { id: string | number }).id
            : typeof project.thumbnail === "string" || typeof project.thumbnail === "number"
              ? project.thumbnail
              : undefined;
        if (thumbnailId !== undefined) {
          try {
            await payload.delete({
              collection: "media",
              id: thumbnailId,
              overrideAccess: true,
              context: { disableRevalidate: true },
            });
          } catch {
            // ignore — media may have already been removed
          }
        }
        await payload.delete({
          collection: "projects",
          id: project.id,
          overrideAccess: true,
          context: { disableRevalidate: true },
        });
      }
      console.log("  ✔ Deleted existing projects.");
    } else {
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
    } // end else (no --force)
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
      showcaseEnabled: project.showcaseEnabled,
      showcaseOrder: project.showcaseOrder,
      accentColor: project.accentColor,
      isProfessional: project.isProfessional,
      narrative: project.en.narrative ?? "",
      chapterLabel: project.en.chapterLabel ?? "",
      caseStudy: {
        enabled: false,
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
        narrative: project.pt.narrative ?? "",
        chapterLabel: project.pt.chapterLabel ?? "",
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    });

    console.log(`    ✔ Created project id=${created.id} (slug: ${project.slug})`);
  }

  console.log(`  ✅ Portfolio seed complete — ${projects.length} projects created.`);
}
