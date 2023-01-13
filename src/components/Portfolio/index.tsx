import {
  BtnsWrapper,
  Button,
  Description,
  Grid,
  GridItem,
  Heading,
  Main,
  Thumbnail,
} from './styles';

const Portfolio = () => {
  return (
    <Main id="Portfolio">
      <Heading>Portfolio</Heading>
      <Description>Check out some of my work here</Description>
      <Grid>
        <GridItem>
          <Thumbnail />
          <BtnsWrapper>
            <Button>Demo</Button>
            <Button>Code</Button>
          </BtnsWrapper>
        </GridItem>
      </Grid>
    </Main>
  );
};
export default Portfolio;
