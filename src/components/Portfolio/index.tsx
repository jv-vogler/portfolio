import { useTranslation } from 'react-i18next';
import {
  InfoWrapper,
  Button,
  Grid,
  GridItem,
  HeadingContainer,
  Main,
  Thumbnail,
  Wrapper,
  ImageWrapper,
} from './styles';

import PORTFOLIOS from '../../constants/PORTFOLIOS';

const Portfolio: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Main id="Portfolio">
      <Wrapper>
        <HeadingContainer>
          <h2>{t('Portfolio')}</h2>
          <p>{t('PortfolioDescription')}</p>
        </HeadingContainer>
        <Grid>
          {PORTFOLIOS.map(({ id, title, description, livePage, repository, techs, thumbnail }) => (
            <GridItem key={id}>
              <InfoWrapper>
                {title}
              </InfoWrapper>
              <ImageWrapper>
                <Thumbnail src={thumbnail} />
              </ImageWrapper>
            </GridItem>
          ))}
        </Grid>
      </Wrapper>
    </Main>
  );
};
export default Portfolio;
