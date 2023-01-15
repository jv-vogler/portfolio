import { useTranslation } from 'react-i18next';
import { Grid, GridItem, Label, Section, Wrapper } from './styles';

import TECHS from '../../constants/TECHS';

const Experience = () => {
  const [t] = useTranslation();

  return (
    <Section id="Experience">
      <Wrapper>
        <div>
          <h2>{t('Experience')}</h2>
          <p>{t('ExperienceDescription')}</p>
        </div>
        <Grid>
          {TECHS.map(({ id, title, icon, color }) => (
            <GridItem key={id} color={color}>
              {icon}
              <Label>{title}</Label>
            </GridItem>
          ))}
        </Grid>
      </Wrapper>
    </Section>
  );
};

export default Experience;
