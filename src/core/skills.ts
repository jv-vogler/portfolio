export namespace Skills {
  export type Category = 'frontend' | 'backend' | 'tools'

  export type Skill = {
    slug: string
    category: Category
  }

  export const categories: Category[] = ['frontend', 'backend', 'tools']

  export const items: Skill[] = [
    // Frontend — mastery
    { slug: 'typescript', category: 'frontend' },
    { slug: 'react', category: 'frontend' },
    { slug: 'nextdotjs', category: 'frontend' },
    { slug: 'tailwindcss', category: 'frontend' },
    { slug: 'html-css', category: 'frontend' },

    // Backend — experience
    { slug: 'nodedotjs', category: 'backend' },
    { slug: 'rubyonrails', category: 'backend' },
    { slug: 'postgresql', category: 'backend' },

    // Tools & Platform
    { slug: 'git', category: 'tools' },
    { slug: 'aws', category: 'tools' },
    { slug: 'ai', category: 'tools' },
    { slug: 'docker', category: 'tools' },
  ]

  export function byCategory(category: Category): Skill[] {
    return items.filter((s) => s.category === category)
  }
}
