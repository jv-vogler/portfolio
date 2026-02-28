import { Github, Image, Instagram, Linkedin, Mail, PenTool, type LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import {
  siChakraui,
  siCss,
  siFirebase,
  siGit,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siStyledcomponents,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'

type SimpleIcon = {
  title: string
  slug: string
  svg: string
  path: string
  hex: string
}

const techIconMap: Record<string, SimpleIcon> = {
  html5: siHtml5,
  css3: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  chakraui: siChakraui,
  styledcomponents: siStyledcomponents,
  tailwindcss: siTailwindcss,
  firebase: siFirebase,
  git: siGit,
}

const lucideFallbackMap: Record<string, ComponentType<LucideProps>> = {
  adobephotoshop: Image,
  adobeillustrator: PenTool,
}

type TechIconProps = {
  slug: string
  size?: number
  className?: string
}

export function TechIcon({ slug, size = 24, className }: TechIconProps) {
  const icon = techIconMap[slug]

  if (icon) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        aria-label={icon.title}
      >
        <path d={icon.path} />
      </svg>
    )
  }

  const FallbackIcon = lucideFallbackMap[slug]
  if (FallbackIcon) {
    return <FallbackIcon size={size} className={className} />
  }

  return null
}

const socialIconMap: Record<string, ComponentType<LucideProps>> = {
  linkedin: Linkedin,
  mail: Mail,
  instagram: Instagram,
  github: Github,
}

type SocialIconProps = {
  slug: string
  size?: number
  className?: string
}

export function SocialIcon({ slug, size = 20, className }: SocialIconProps) {
  const Icon = socialIconMap[slug]

  if (!Icon) return null

  return <Icon size={size} className={className} />
}
