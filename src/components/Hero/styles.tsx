import { Link } from 'react-scroll';
import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  align-items: center;
  height: calc(100vh - 80px);
  width: 100%;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1280px;
  padding: 0 1rem;
  height: 100%;
`;

export const Heading = styled.h1`
  max-width: 850px;
  font-size: 4.5rem;
  line-height: 1;

  @media screen and (max-width: 768px) {
    font-size: 2.9rem;
    text-align: center;
  }

  @media screen and (max-width: 320px) {
    font-size: 2.4rem;
  }
`;

export const Paragraph = styled.p`
  padding: 1rem 0;
  max-width: 28rem;

  @media screen and (max-width: 768px) {
    text-align: center;
    font-size: 0.9rem;
  }
`;

export const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 150px;
  height: 50px;
  background-color: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.background};
  font-family: inherit;
  font-weight: bold;
  font-size: 1.5rem;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.textSecondary};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.1);
  }
  
  @media screen and (max-width: 768px) {
    align-self: center;
    min-width: 150px;
  }
`;
