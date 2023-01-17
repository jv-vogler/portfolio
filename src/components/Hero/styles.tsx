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
