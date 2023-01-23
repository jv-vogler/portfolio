import styled from 'styled-components';

export const Section = styled.section`
  min-height: calc(100vh - 80px);
  width: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  height: 100%;
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
`;

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  align-self: flex-start;

  @media screen and (min-width: 768px) {
    padding: 3rem;
  }
`;

export const Label = styled.p`
  font-size: 0.9rem;
  font-weight: bold;
`;

export const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  text-align: center;
  padding: 2rem 3rem;

  @media screen and (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-left: 0;
    padding-right: 0;
  }
`;

export const GridItem = styled.div`
  display: grid;
  place-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem 0;
  gap: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px ${props => props.color}, 0 2px 4px -2px ${props => props.color};
  transition: 0.5s;

  &:hover {
    transform: scale(1.05);
  }
`;
