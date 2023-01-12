import { useContext } from 'react';
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
  ToggleBtn,
} from './styles';

interface Props {
  toggleTheme(): void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
  const { t, i18n } = useTranslation();
  const { colors, title } = useContext(ThemeContext);

  return (
    <Navbar>
      <Nav>
        <NavLogo src={Logo} />
        <MobileIcon>
          <Hamburger />
        </MobileIcon>
        <NavMenu>
          {LINKS.map(link => (
            <NavItem key={link.id}>
              <NavLinks to={link.name}>{t(link.name)}</NavLinks>
            </NavItem>
          ))}
        </NavMenu>
        <NavBtns>
          <Switch
            onChange={toggleTheme}
            checked={title === 'dark'}
            checkedIcon={false}
            uncheckedIcon={false}
            offColor={colors.accent}
            onColor={colors.textSecondary}
          />
          <ToggleBtn>d/l</ToggleBtn>
        </NavBtns>
      </Nav>
    </Navbar>
  );
};
export default Header;
