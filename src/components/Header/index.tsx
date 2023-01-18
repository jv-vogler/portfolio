import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';

import Switch from 'react-switch';
import { Spin as Hamburger } from 'hamburger-react';

import Logo from '../../assets/logo.svg';
import LINKS from '../../constants/LINKS';

import {
  Nav,
  Navbar,
  MobileIcon,
  NavBtns,
  NavItem,
  NavLinks,
  NavLogo,
  NavMenu,
  Sun,
  Moon,
  Flag,
  MobileMenu,
  MobileBtns,
} from './styles';

interface Props {
  toggleTheme(): void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
  const { t, i18n } = useTranslation();
  const { colors, title } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  function toggleLanguage() {
    i18n.changeLanguage(i18n.language === 'pt_br' ? 'en' : 'pt_br');
    localStorage.setItem('language', i18n.language)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <Navbar>
        <Nav>
          <NavLogo
            to="Home"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            onClick={() => setIsOpen(false)}
          >
            <img src={Logo} alt="logo" width="90px" />
          </NavLogo>
          <MobileIcon>
            <Hamburger toggled={isOpen} toggle={() => setIsOpen(!isOpen)} />
          </MobileIcon>
          <NavMenu>
            {LINKS.map(link => (
              <NavItem key={link.id}>
                <NavLinks to={link.name} spy={true} smooth={true} offset={-80} duration={500}>
                  {t(link.name)}
                </NavLinks>
              </NavItem>
            ))}
          </NavMenu>
          <NavBtns>
            <Switch
              onChange={toggleTheme}
              checked={title === 'dark'}
              checkedIcon={false}
              uncheckedIcon={false}
              offHandleColor="#555"
              onHandleColor="#555"
              checkedHandleIcon={<Moon color={colors.text} />}
              uncheckedHandleIcon={<Sun color="gold" />}
              offColor="#555"
              onColor="#555"
              width={60}
              height={30}
            />
            <Switch
              onChange={toggleLanguage}
              checked={i18n.language === 'en'}
              checkedIcon={false}
              uncheckedIcon={false}
              checkedHandleIcon={<Flag countryCode="us" width={30} />}
              uncheckedHandleIcon={<Flag countryCode="br" width={30} />}
              offColor="#555"
              onColor="#555"
              width={60}
              height={30}
            />
          </NavBtns>
        </Nav>
      </Navbar>
      <MobileMenu isOpen={isOpen} onClick={() => setIsOpen(false)}>
        {LINKS.map(link => (
          <NavItem key={link.id}>
            <NavLinks
              to={link.name}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              onClick={() => setIsOpen(false)}
            >
              {t(link.name)}
            </NavLinks>
          </NavItem>
        ))}
        <MobileBtns onClick={e => e.stopPropagation()}>
          <Switch
            onChange={toggleTheme}
            checked={title === 'dark'}
            checkedIcon={false}
            uncheckedIcon={false}
            offHandleColor="#555"
            onHandleColor="#555"
            checkedHandleIcon={<Moon color={colors.text} />}
            uncheckedHandleIcon={<Sun color="gold" />}
            offColor="#555"
            onColor="#555"
            width={60}
            height={30}
          />
          <Switch
            onChange={toggleLanguage}
            checked={i18n.language === 'en'}
            checkedIcon={false}
            uncheckedIcon={false}
            checkedHandleIcon={<Flag countryCode="us" width={30} />}
            uncheckedHandleIcon={<Flag countryCode="br" width={30} />}
            offColor="#555"
            onColor="#555"
            width={60}
            height={30}
          />
        </MobileBtns>
      </MobileMenu>
    </>
  );
};
export default Header;
