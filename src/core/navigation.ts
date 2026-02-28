export namespace Navigation {
  export type Link = {
    label: string
    href: string
  }

  export const links: Link[] = [
    { label: 'home', href: '#home' },
    { label: 'experience', href: '#experience' },
    { label: 'portfolio', href: '#portfolio' },
    { label: 'blog', href: '/blog' },
    { label: 'contact', href: '#contact' },
  ]
}
