export namespace Portfolio {
  export type Project = {
    slug: string;
    thumbnail: string;
    techs: string[];
    demoUrl?: string;
    codeUrl?: string;
    featured?: boolean;
    caseStudy?: boolean;
  };

  export const items: Project[] = [
    {
      slug: "ai-integration-platform",
      thumbnail: "thumb-ai-platform.png",
      techs: ["React", "Next.js", "TypeScript", "Node.js", "AWS", "OpenAI"],
      featured: true,
      caseStudy: true,
    },
    {
      slug: "fetchhire",
      thumbnail: "thumb-fetchhire.png",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://fetch-hire.vercel.app/",
      codeUrl: "https://github.com/jv-vogler/fetch-hire",
    },
    {
      slug: "treasure-hunters",
      thumbnail: "thumb-treasurehunters.png",
      techs: ["Godot", "GDScript"],
      demoUrl: "https://github.com/jv-vogler/Treasure-Hunters",
      codeUrl: "https://github.com/jv-vogler/Treasure-Hunters",
      featured: true,
    },
    {
      slug: "voltorb-flip",
      thumbnail: "thumb-voltorbflip.png",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://voltorbflip.vercel.app/",
      codeUrl: "https://github.com/jv-vogler/voltorb-flip",
      featured: true,
    },
    {
      slug: "another-reddit-clone",
      thumbnail: "thumb-reddit.png",
      techs: ["React", "Next.js", "TypeScript", "Chakra UI", "Firebase", "Recoil"],
      demoUrl: "https://another-reddit-clone-jv-vogler.vercel.app/",
      codeUrl: "https://github.com/jv-vogler/another-reddit-clone",
    },
    {
      slug: "portfolio-v1",
      thumbnail: "thumb-portfolio.png",
      techs: ["React", "TypeScript", "Styled Components", "Vite"],
      codeUrl: "https://github.com/jv-vogler/portfolio",
    },
    {
      slug: "weather-app",
      thumbnail: "thumb-weatherapp.png",
      techs: ["HTML", "CSS", "JavaScript", "Webpack"],
      demoUrl: "https://jv-vogler.github.io/weather-app/",
      codeUrl: "https://github.com/jv-vogler/weather-app",
    },
    {
      slug: "todo-list",
      thumbnail: "thumb-todoapp.png",
      techs: ["React", "TypeScript", "Styled Components", "Vite"],
      demoUrl: "https://jv-vogler.github.io/todo-list/",
      codeUrl: "https://github.com/jv-vogler/todo-list",
    },
    {
      slug: "memory-cats",
      thumbnail: "thumb-memorycats.png",
      techs: ["Godot", "GDScript"],
      demoUrl: "https://jv-vogler.itch.io/memory-cats",
      codeUrl: "https://github.com/jv-vogler/memory-cats",
      featured: true,
    },
  ];
}
