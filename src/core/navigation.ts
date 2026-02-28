export namespace Navigation {
  export type Link = {
    label: string
    href: string
  }

  export const links: Link[] = [
    { label: 'Home', href: '#home' },
    { label: 'Experience', href: '#experience' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '#contact' },
  ]
}
