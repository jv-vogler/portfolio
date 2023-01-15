import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  place-items: center;
  min-height: calc(100vh - 80px);
  width: 100%;
  padding: 10px;
  margin-bottom: 50px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  height: 100%;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 50px;

  @media screen and (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const GridItem = styled.div`
  display: grid;
  place-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px ${props => props.color}, 0 2px 4px -2px ${props => props.color};
  transition: 0.5s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Label = styled.p`
  font-size: 0.9rem;
  font-weight: bold;
`;
