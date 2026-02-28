export namespace Portfolio {
  export type Type = {
    id: number
    slug: string
    title: string
    descriptionKey: string
    thumbnail: string
    techs: string[]
    demoUrl: string
    codeUrl: string
    isPassionProject?: boolean
  }

  export const items: Type[] = [
    {
      id: 8,
      slug: 'fetchhire',
      title: 'Fetch Hire',
      descriptionKey: 'portfolio.fetchhire.description',
      thumbnail: 'thumb-fetchhire.jpg',
      techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      demoUrl: 'https://fetch-hire.vercel.app/',
      codeUrl: 'https://github.com/jv-vogler/fetch-hire',
    },
    {
      id: 7,
      slug: 'treasure-hunters',
      title: 'Treasure Hunters',
      descriptionKey: 'portfolio.treasure-hunters.description',
      thumbnail: 'thumb-treasurehunters.jpg',
      techs: ['Godot', 'GDScript'],
      demoUrl: 'https://github.com/jv-vogler/Treasure-Hunters',
      codeUrl: 'https://github.com/jv-vogler/Treasure-Hunters',
      isPassionProject: true,
    },
    {
      id: 6,
      slug: 'voltorb-flip',
      title: 'Voltorb Flip',
      descriptionKey: 'portfolio.voltorb-flip.description',
      thumbnail: 'thumb-voltorbflip.jpg',
      techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      demoUrl: 'https://voltorbflip.vercel.app/',
      codeUrl: 'https://github.com/jv-vogler/voltorb-flip',
      isPassionProject: true,
    },
    {
      id: 5,
      slug: 'another-reddit-clone',
      title: 'Another Reddit Clone',
      descriptionKey: 'portfolio.another-reddit-clone.description',
      thumbnail: 'thumb-reddit.jpg',
      techs: ['React', 'Next.js', 'TypeScript', 'Chakra UI', 'Firebase', 'Recoil'],
      demoUrl: 'https://another-reddit-clone-jv-vogler.vercel.app/',
      codeUrl: 'https://github.com/jv-vogler/another-reddit-clone',
    },
    {
      id: 4,
      slug: 'portfolio',
      title: 'Portfolio',
      descriptionKey: 'portfolio.portfolio.description',
      thumbnail: 'thumb-portfolio.jpg',
      techs: ['React', 'TypeScript', 'Styled Components', 'Vite'],
      demoUrl: '',
      codeUrl: 'https://github.com/jv-vogler/portfolio',
    },
    {
      id: 3,
      slug: 'weather-app',
      title: 'Weather App',
      descriptionKey: 'portfolio.weather-app.description',
      thumbnail: 'thumb-weatherapp.jpg',
      techs: ['HTML', 'CSS', 'JavaScript', 'Webpack'],
      demoUrl: 'https://jv-vogler.github.io/weather-app/',
      codeUrl: 'https://github.com/jv-vogler/weather-app',
    },
    {
      id: 2,
      slug: 'todo-list',
      title: 'To-do List',
      descriptionKey: 'portfolio.todo-list.description',
      thumbnail: 'thumb-todoapp.jpg',
      techs: ['React', 'TypeScript', 'Styled Components', 'Vite'],
      demoUrl: 'https://jv-vogler.github.io/todo-list/',
      codeUrl: 'https://github.com/jv-vogler/todo-list',
    },
    {
      id: 1,
      slug: 'memory-cats',
      title: 'Memory Cats',
      descriptionKey: 'portfolio.memory-cats.description',
      thumbnail: 'thumb-memorycats.jpg',
      techs: ['Godot', 'GDScript'],
      demoUrl: 'https://jv-vogler.itch.io/memory-cats',
      codeUrl: 'https://github.com/jv-vogler/memory-cats',
      isPassionProject: true,
    },
  ]
}
