export namespace Social {
  export type Type = {
    id: string
    label: string
    url: string
    iconSlug: string
  }

  export const items: Type[] = [
    {
      id: '1',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jv-vogler/',
      iconSlug: 'linkedin',
    },
    {
      id: '2',
      label: 'Email',
      url: 'mailto:jvsvogler@gmail.com',
      iconSlug: 'mail',
    },
    {
      id: '3',
      label: 'Instagram',
      url: 'https://www.instagram.com/jv_vogler/',
      iconSlug: 'instagram',
    },
    {
      id: '4',
      label: 'Github',
      url: 'https://github.com/jv-vogler',
      iconSlug: 'github',
    },
  ]
}
