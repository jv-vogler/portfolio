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
    icon: <SiHtml5 color="#f05c2a" size={SIZE} />,
    title: 'HTML',
    color: '#f05c2a',
  },
  {
    id: 2,
    icon: <SiCss3 color="#2091eb" size={SIZE} />,
    title: 'CSS',
    color: '#2091eb',
  },
  {
    id: 3,
    icon: <SiJavascript color="#b8a600" size={SIZE} />,
    title: 'JavaScript',
    color: '#b8a600',
  },
  {
    id: 4,
    icon: <SiReact color="#57d2f3" size={SIZE} />,
    title: 'React',
    color: '#57d2f3',
  },
  {
    id: 5,
    icon: <SiTypescript color="#2f74c0" size={SIZE} />,
    title: 'TypeScript',
    color: '#2f74c0',
  },
  {
    id: 6,
    icon: <SiStyledcomponents color="#d273ad" size={SIZE} />,
    title: 'Styled Components',
    color: '#d273ad',
  },
  {
    id: 7,
    icon: <SiTailwindcss color="#16becb" size={SIZE} />,
    title: 'Tailwind CSS',
    color: '#16becb',
  },
  {
    id: 8,
    icon: <SiAdobephotoshop color="#2fa3f7" size={SIZE} />,
    title: 'Adobe Photoshop',
    color: '#2fa3f7',
  },
  {
    id: 9,
    icon: <SiAdobeillustrator color="#f77800" size={SIZE} />,
    title: 'Adobe Illustrator',
    color: '#f77800',
  },
  {
    id: 10,
    icon: <SiGit color="#e84d31" size={SIZE} />,
    title: 'Git',
    color: '#e84d31',
  },
];

export default TECHS;
