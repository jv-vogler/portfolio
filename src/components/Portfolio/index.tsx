import { useTranslation } from 'react-i18next';
import { BtnsWrapper, Button, Grid, GridItem, Main, Thumbnail } from './styles';

const Portfolio: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Main id="Portfolio">
      <h2>{t('Portfolio')}</h2>
      <p>{t('PortfolioDescription')}</p>
      <Grid>
        <GridItem>
          <Thumbnail />
          <BtnsWrapper>
            <Button>{t('Demo')}</Button>
            <Button>{t('Code')}</Button>
          </BtnsWrapper>
        </GridItem>
      </Grid>
    </Main>
  );
};
export default Portfolio;
