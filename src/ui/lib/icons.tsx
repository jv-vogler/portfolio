import {
  BrainCircuit,
  Cloud,
  Code2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  siDocker,
  siFirebase,
  siGit,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siRubyonrails,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

type SimpleIcon = {
  title: string;
  slug: string;
  svg: string;
  path: string;
  hex: string;
};

const techIconMap: Record<string, SimpleIcon> = {
  typescript: siTypescript,
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  nodedotjs: siNodedotjs,
  rubyonrails: siRubyonrails,
  postgresql: siPostgresql,
  git: siGit,
  docker: siDocker,
  firebase: siFirebase,
};

const lucideFallbackMap: Record<string, ComponentType<LucideProps>> = {
  "html-css": Code2,
  aws: Cloud,
  ai: BrainCircuit,
};

type TechIconProps = {
  slug: string;
  size?: number;
  className?: string;
};

export function TechIcon({ slug, size = 24, className }: TechIconProps) {
  const icon = techIconMap[slug];

  if (icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const FallbackIcon = lucideFallbackMap[slug];
  if (FallbackIcon) {
    return <FallbackIcon size={size} className={className} aria-hidden="true" />;
  }

  return null;
}

const socialIconMap: Record<string, ComponentType<LucideProps>> = {
  linkedin: Linkedin,
  mail: Mail,
  instagram: Instagram,
  github: Github,
};

type SocialIconProps = {
  slug: string;
  size?: number;
  className?: string;
};

export function SocialIcon({ slug, size = 20, className }: SocialIconProps) {
  const Icon = socialIconMap[slug];

  if (!Icon) return null;

  return <Icon size={size} className={className} aria-hidden="true" />;
}
