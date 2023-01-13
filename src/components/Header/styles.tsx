import styled from 'styled-components';
import { Link } from 'react-scroll';
import { FaSun, FaMoon } from 'react-icons/fa';
import { CircleFlag } from 'react-circle-flags';

export const Navbar = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  height: 80px;
  z-index: 10;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 0 24px;
  z-index: 1;
`;

export const NavLogo = styled(Link)`
  user-select: none;
  cursor: pointer;
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 25%);
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text};
    cursor: pointer;

    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.li`
  height: 50px;
`;

export const NavLinks = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 5px 2rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  user-select: none;
  transition: 0.3s color;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }

  &.active {
    border-bottom: 3px solid ${props => props.theme.colors.accent};
  }
`;

interface MobileMenuProps {
  isOpen: boolean;
  onClick: React.MouseEventHandler<HTMLUListElement>;
}

export const MobileMenu = styled.ul<MobileMenuProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  height: calc(100vh - 80px);
  width: 100%;
  gap: 10vh;
  padding: 20% 0;
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  list-style: none;
  transition: 0.5s transform;
  z-index: 1;

  @media screen and (max-width: 568px) {
    gap: 10px;
  }
`;

export const MobileBtns = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 3vh;
`;

export const NavBtns = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const Sun = styled(FaSun)`
  position: absolute;
  transform: translate(2px, 1px);
  font-size: 1.5rem;
  text-align: center;
  user-select: none;
`;

export const Moon = styled(FaMoon)`
  position: absolute;
  transform: translate(0, 2px);
  font-size: 1.5rem;
  text-align: center;
  user-select: none;
`;

export const Flag = styled(CircleFlag)`
  position: absolute;
  transform: translate(-1px, -36px);
`;
