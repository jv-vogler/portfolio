import { RefObject } from 'react';
import { Link } from 'react-scroll';
import styled from 'styled-components';

type Props = {
  ref: RefObject<HTMLInputElement> | null
}

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 150px;
  height: 50px;
  background-color: ${props => props.theme.colors.button};
  color: ${props => props.theme.colors.buttonText};
  font-family: inherit;
  font-weight: bold;
  font-size: 1.5rem;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: 0px 0px 10px 3px ${props => props.theme.colors.text};
    transform: scale(1.1);
  }

  @media screen and (max-width: 768px) {
    align-self: center;
    min-width: 150px;
  }
`;

export const AnchorButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 50px;
  background-color: #e6e6e6;
  color: #333;
  font-family: inherit;
  font-weight: bold;
  font-size: 1.5rem;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: 0px 0px 15px 5px ${props => props.theme.colors.accent};
    transform: scale(1.1);
  }
`;

export const LinkButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 150px;
  height: 50px;
  background-color: ${props => props.theme.colors.button};
  color: ${props => props.theme.colors.buttonText};
  font-family: inherit;
  font-weight: bold;
  font-size: 1.5rem;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: 0px 0px 5px 2px ${props => props.theme.colors.accent};
    transform: scale(1.1);
  }

  @media screen and (max-width: 768px) {
    align-self: center;
    min-width: 150px;
  }
`;
