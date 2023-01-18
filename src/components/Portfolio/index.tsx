import { useTranslation } from 'react-i18next';
import {
  Title,
  Grid,
  GridItem,
  HeadingContainer,
  Main,
  Thumbnail,
  Wrapper,
  ImageWrapper,
  ProjectData,
  BtnContainer,
  Description,
  TechContainer,
  TechLabel,
} from './styles';
import { AnchorButton } from '../Buttons/styles';

import PORTFOLIOS from '../../constants/PORTFOLIOS';
import i18n from '../../i18n';

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
          {PORTFOLIOS.map(
            ({
              id,
              title,
              description,
              description_pt,
              livePage,
              repository,
              techs,
              thumbnail,
            }) => (
              <GridItem key={id}>
                <Title>{title}</Title>
                <ImageWrapper>
                  <Thumbnail src={thumbnail} />
                </ImageWrapper>
                <ProjectData>
                  {title}
                  <TechContainer>
                    {techs.map(t => (
                      <TechLabel key={t}>{t}</TechLabel>
                    ))}
                  </TechContainer>
                  <Description>{i18n.language === 'en' ? description : description_pt}</Description>
                  <BtnContainer>
                    {livePage && (
                      <AnchorButton href={livePage} target="_blank">
                        {t('Demo')}
                      </AnchorButton>
                    )}
                    <AnchorButton href={repository} target="_blank">
                      {t('Code')}
                    </AnchorButton>
                  </BtnContainer>
                </ProjectData>
              </GridItem>
            )
          )}
        </Grid>
      </Wrapper>
    </Main>
  );
};
export default Portfolio;
