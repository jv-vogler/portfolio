import WIP from '../assets/thumb-wip.jpg'
import WIPWebp from '../assets/thumb-wip.webp'
import TreasureHunters from '../assets/thumb-treasurehunters.jpg'
import TreasureHuntersWebp from '../assets/thumb-treasurehunters.webp'
import WeatherApp from '../assets/thumb-weatherapp.jpg'
import WeatherAppWebp from '../assets/thumb-weatherapp.webp'
import TodoApp from '../assets/thumb-todoapp.jpg'
import TodoAppWebp from '../assets/thumb-todoapp.webp'
import MemoryCats from '../assets/thumb-memorycats.jpg'
import MemoryCatsWebp from '../assets/thumb-memorycats.webp'
import Portfolio from '../assets/thumb-portfolio.jpg'
import PortfolioWebp from '../assets/thumb-portfolio.webp'
import Reddit from '../assets/thumb-reddit.jpg'
import RedditWebp from '../assets/thumb-reddit.webp'
import VoltorbFlip from '../assets/thumb-voltorbflip.jpg'
import VoltorbFlipWebp from '../assets/thumb-voltorbflip.webp'
import FetchHire from '../assets/thumb-fetchhire.jpg'
import FetchHireWebp from '../assets/thumb-fetchhire.webp'

type Thumbnail = {
  jpg: string
  webp: string
}

type Project = {
  id: number
  title: string
  description: string
  description_pt: string
  thumbnail: Thumbnail
  techs: string[]
  livePage: string
  repository: string
}

const PORTFOLIOS: Project[] = [
  {
    id: 8,
    title: 'Fetch Hire',
    description: 'A tool to get helpful insight and data about Github users.',
    description_pt: 'Uma ferramenta para obter informações úteis sobre usuários do Github.',
    thumbnail: { jpg: FetchHire, webp: FetchHireWebp },
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwindcss'],
    livePage: 'https://fetch-hire.vercel.app/',
    repository: 'https://github.com/jv-vogler/fetch-hire',
  },
  {
    id: 7,
    title: 'Treasure Hunters',
    description:
      'Treasure Hunters is a 2D platformer game where you control the feared Captain Clown Nose in a quest to recover his ship that was taken in a mutiny. Many dangers and treasures hide and await under the tree shadows of Palm Tree Island.',
    description_pt:
      'Treasure Hunters é um jogo de plataforma 2D onde você assume o controle do temido Capitão Nariz de Palhaço em busca de recuperar seu navio tomado em um motim. Diversos perigos e tesouros se escondem e o aguardam sob as sombras das árvores da Ilha das Palmeiras.',
    thumbnail: { jpg: TreasureHunters, webp: TreasureHuntersWebp },
    techs: ['Godot', 'GDScript'],
    livePage: 'https://github.com/jv-vogler/Treasure-Hunters',
    repository: 'https://github.com/jv-vogler/Treasure-Hunters',
  },
  {
    id: 6,
    title: 'Voltorb Flip',
    description:
      'Voltorb Flip is a minigame of the Goldenrod and Celadon Game Corners in the Korean and Western releases of Pokémon HeartGold and SoulSilver.',
    description_pt:
      'Voltorb Flip é um minigame dos Game Corners de Goldenrod e Celadon nas versões Coreanas e Ocidentais dos jogos Pokémon HeartGold e SoulSilver.',
    thumbnail: { jpg: VoltorbFlip, webp: VoltorbFlipWebp },
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwindcss'],
    livePage: 'https://voltorbflip.vercel.app/',
    repository: 'https://github.com/jv-vogler/voltorb-flip',
  },
  {
    id: 5,
    title: 'Another Reddit Clone',
    description: `A functional Reddit clone. You can log in/sign up, create and join communities, create posts, upvote/downvote posts, and more!`,
    description_pt:
      'Um clone do Reddit funcional. Você pode logar/se cadastrar, criar e entrar em comunidades, criar posts, votar nos posts, e mais!',
    thumbnail: { jpg: Reddit, webp: RedditWebp },
    techs: ['React', 'Next.js', 'TypeScript', 'Chakra UI', 'Firebase', 'Recoil'],
    livePage: 'https://another-reddit-clone-jv-vogler.vercel.app/',
    repository: 'https://github.com/jv-vogler/another-reddit-clone',
  },
  {
    id: 4,
    title: 'Portfolio',
    description: 'Source code for this website.',
    description_pt: 'Código fonte desse website.',
    thumbnail: { jpg: Portfolio, webp: PortfolioWebp },
    techs: ['React', 'TypeScript', 'Styled Components', 'Vite'],
    livePage: '',
    repository: 'https://github.com/jv-vogler/portfolio',
  },
  {
    id: 3,
    title: 'Weather App',
    description: 'Weather forecast for cities around the world.',
    description_pt: 'Previsão do tempo de cidades ao redor do mundo.',
    thumbnail: { jpg: WeatherApp, webp: WeatherAppWebp },
    techs: ['HTML', 'CSS', 'JavaScript', 'Webpack'],
    livePage: 'https://jv-vogler.github.io/weather-app/',
    repository: 'https://github.com/jv-vogler/weather-app',
  },
  {
    id: 2,
    title: 'To-do List',
    description:
      'The good old "Todo List" of React beginners. Creates tasks that can be marked as complete and deleted.',
    description_pt:
      'A boa e velha "Todo List" dos iniciantes em React. Cria tarefas que podem ser marcadas como completas e deletadas.',
    thumbnail: { jpg: TodoApp, webp: TodoAppWebp },
    techs: ['React', 'TypeScript', 'Styled Components', 'Vite'],
    livePage: 'https://jv-vogler.github.io/todo-list/',
    repository: 'https://github.com/jv-vogler/todo-list',
  },
  {
    id: 1,
    title: 'Memory Cats',
    description:
      "A simple yet challenging memory game, because not only you have to identify the pairs but also remember the name of each cat you've found.",
    description_pt:
      'Um jogo da memória simples, porém desafiador, pois além de identificar os pares iguais você também precisa se lembrar do nome de cada gato que encontrou.',
    thumbnail: { jpg: MemoryCats, webp: MemoryCatsWebp },
    techs: ['Godot', 'GDScript'],
    livePage: 'https://jv-vogler.itch.io/memory-cats',
    repository: 'https://github.com/jv-vogler/memory-cats',
  },
]

export default PORTFOLIOS
