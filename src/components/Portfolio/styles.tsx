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
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px ${props => props.theme.colors.text},
    0 2px 4px -2px ${props => props.theme.colors.accent};
  transition: 0.5s;

  /* background-color: salmon; */
`;

export const ImageWrapper = styled.div`
  height: 400px;
  width: 100%;
`;

export const InfoWrapper = styled.div`
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
  /* color: #fff; */
  background-color: ${props => props.theme.colors.text};
  /* background-color: darkslateblue; */
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`;

export const Button = styled.button`
  width: 50%;
  margin: 1rem;
  padding: 0.75rem 1.5rem;
  transition: 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;
