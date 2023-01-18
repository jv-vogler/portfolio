import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const SIZE = 40;
const SOCIALS = [
  {
    id: 1,
    title: 'LinkedIn',
    icon: <FaLinkedin size={SIZE} />,
    link: 'https://www.linkedin.com/in/jv-vogler/',
  },
  {
    id: 2,
    title: 'Github',
    icon: <FaGithub size={SIZE} />,
    link: 'https://github.com/jv-vogler',
  },
  {
    id: 3,
    title: 'Email',
    icon: <HiOutlineMail size={SIZE} />,
    link: 'mailto:jvsvogler@gmail.com',
  },
  {
    id: 4,
    title: 'Instagram',
    icon: <FaInstagram size={SIZE} />,
    link: 'https://www.instagram.com/jv_vogler/',
  },
];

export default SOCIALS;
