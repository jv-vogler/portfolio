import styled from 'styled-components';

export const Main = styled.main`
  min-height: calc(100vh - 80px);
  width: 100%;
  padding: 10px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 0 12px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 0;
  }
`;

export const GridItem = styled.div`
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-color: #4b5563;
  border-radius: 0.5rem;
`;

export const Thumbnail = styled.img``;

export const BtnsWrapper = styled.div``;

export const Button = styled.button``;
