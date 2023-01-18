import styled from 'styled-components';

export const Main = styled.main`
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

export const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  text-align: center;
  padding: 2rem 3rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    padding-left: 0;
    padding-right: 0;
  }
`;

export const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  position: relative;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px ${props => props.theme.colors.text},
    0 2px 4px -2px ${props => props.theme.colors.accent};
  transition: 0.5s;
`;

export const ImageWrapper = styled.div`
  height: 400px;
  width: 100%;
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  place-items: center;
  width: 100%;
  height: 75px;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  font-weight: 300;
  font-size: 1.5rem;

  color: ${props => props.theme.colors.background};
  background-color: ${props => props.theme.colors.button};
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`;

export const ProjectData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  opacity: 0;
  transition: 0.5s;

  &:hover {
    opacity: 1;
  }

  &:focus-within {
    opacity: 1;
  }
`;

export const TechContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  place-content: center;
  gap: 10px;
`;

export const TechLabel = styled.p`
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  color: black;
  background-color: lightgrey;
  font-weight: 600;
`;

export const Description = styled.p`
  max-width: 85%;
  align-self: center;
`;

export const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
`;
