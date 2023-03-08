import { ReactElement } from 'react';
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

type Social = {
  id: number;
  title: string;
  icon: ReactElement;
  link: string;
};

const SIZE = 35;
const SOCIALS: Social[] = [
  {
    id: 1,
    title: 'LinkedIn',
    icon: <FaLinkedin size={SIZE} />,
    link: 'https://www.linkedin.com/in/jv-vogler/',
  },
  {
    id: 2,
    title: 'Email',
    icon: <HiOutlineMail size={SIZE} />,
    link: 'mailto:jvsvogler@gmail.com',
  },
  {
    id: 3,
    title: 'Instagram',
    icon: <FaInstagram size={SIZE} />,
    link: 'https://www.instagram.com/jv_vogler/',
  },
  {
    id: 4,
    title: 'Github',
    icon: <FaGithub size={SIZE} />,
    link: 'https://github.com/jv-vogler',
  },
];

export default SOCIALS;
