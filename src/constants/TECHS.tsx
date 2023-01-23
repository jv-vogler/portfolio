import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiTypescript,
  SiStyledcomponents,
  SiTailwindcss,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiGit,
} from 'react-icons/si';

const SIZE = 65;
const TECHS = [
  {
    id: 1,
    icon: <SiHtml5 color="#f05c2a" size={SIZE} aria-hidden={true} />,
    title: 'HTML5',
    color: '#f05c2a',
  },
  {
    id: 2,
    icon: <SiCss3 color="#2091eb" size={SIZE} aria-hidden={true} />,
    title: 'CSS3',
    color: '#2091eb',
  },
  {
    id: 3,
    icon: <SiJavascript color="#b8a600" size={SIZE} aria-hidden={true} />,
    title: 'JavaScript (ES6+)',
    color: '#b8a600',
  },
  {
    id: 4,
    icon: <SiReact color="#57d2f3" size={SIZE} aria-hidden={true} />,
    title: 'React',
    color: '#57d2f3',
  },
  {
    id: 5,
    icon: <SiTypescript color="#2f74c0" size={SIZE} aria-hidden={true} />,
    title: 'TypeScript',
    color: '#2f74c0',
  },
  {
    id: 6,
    icon: <SiStyledcomponents color="#d273ad" size={SIZE} aria-hidden={true} />,
    title: 'Styled Components',
    color: '#d273ad',
  },
  {
    id: 7,
    icon: <SiTailwindcss color="#16becb" size={SIZE} aria-hidden={true} />,
    title: 'Tailwind CSS',
    color: '#16becb',
  },
  {
    id: 8,
    icon: <SiGit color="#e84d31" size={SIZE} aria-hidden={true} />,
    title: 'Git',
    color: '#e84d31',
  },
  {
    id: 9,
    icon: <SiAdobephotoshop color="#2fa3f7" size={SIZE} aria-hidden={true} />,
    title: 'Adobe Photoshop',
    color: '#2fa3f7',
  },
  {
    id: 10,
    icon: <SiAdobeillustrator color="#f77800" size={SIZE} aria-hidden={true} />,
    title: 'Adobe Illustrator',
    color: '#f77800',
  },
];

export default TECHS;
