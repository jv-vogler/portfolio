import TreasureHunters from '../assets/thumb-treasurehunters.jpg';
import WeatherApp from '../assets/thumb-weatherapp.jpg';
import TodoApp from '../assets/thumb-todoapp.jpg';
import MemoryCats from '../assets/thumb-memorycats.jpg';
import Portfolio from '../assets/thumb-portfolio.jpg';

const PORTFOLIOS = [
  {
    id: 1,
    title: 'Treasure Hunters',
    description:
      'Treasure Hunters is a 2D platformer game where you control the feared Captain Clown Nose in a quest to recover his ship that was taken in a mutiny. Many dangers and treasures hide and await under the tree shadows of Palm Tree Island.',
    description_pt:
      'Treasure Hunters é um jogo de plataforma 2D onde você assume o controle do temido Capitão Nariz de Palhaço em busca de recuperar seu navio tomado em um motim. Diversos perigos e tesouros se escondem e o aguardam sob as sombras das árvores da Ilha das Palmeiras.',
    thumbnail: TreasureHunters,
    techs: ['Godot', 'GDScript'],
    livePage: 'https://github.com/jv-vogler/Treasure-Hunters',
    repository: 'https://github.com/jv-vogler/Treasure-Hunters',
  },
  {
    id: 2,
    title: 'Weather App',
    description: 'Weather forecast for cities around the world.',
    description_pt: 'Previsão do tempo de cidades ao redor do mundo.',
    thumbnail: WeatherApp,
    techs: ['HTML', 'CSS', 'JavaScript', 'Webpack'],
    livePage: 'https://jv-vogler.github.io/weather-app/',
    repository: 'https://github.com/jv-vogler/weather-app',
  },
  {
    id: 3,
    title: 'To-do List',
    description:
      'The good old "Todo List" of React beginners. Creates tasks that can be marked as complete and deleted.',
    description_pt:
      'A boa e velha "Todo List" dos iniciantes em React. Cria tarefas que podem ser marcadas como completas e deletadas.',
    thumbnail: TodoApp,
    techs: ['React', 'TypeScript', 'Styled Components', 'Vite'],
    livePage: 'https://jv-vogler.github.io/todo-list/',
    repository: 'https://github.com/jv-vogler/todo-list',
  },
  {
    id: 4,
    title: 'Memory Cats',
    description:
      "A simple yet challenging memory game, because not only you have to identify the pairs but also remember the name of each cat you've found.",
    description_pt:
      'Um jogo da memória simples, porém desafiador, pois além de identificar os pares iguais você também precisa se lembrar do nome de cada gato que encontrou.',
    thumbnail: MemoryCats,
    techs: ['Godot', 'GDScript'],
    livePage: 'https://jv-vogler.itch.io/memory-cats',
    repository: 'https://github.com/jv-vogler/memory-cats',
  },
  {
    id: 5,
    title: "Portfolio",
    description: 'Source code for this website.',
    description_pt: 'Código fonte desse website.',
    thumbnail: Portfolio,
    techs: ['React', 'TypeScript', 'Styled Components', 'Vite'],
    livePage: '',
    repository: 'https://github.com/jv-vogler/portfolio',
  },
];

export default PORTFOLIOS;
