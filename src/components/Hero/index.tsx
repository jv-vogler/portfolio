import { useTranslation } from 'react-i18next';
import HeroImage from '../HeroImage';
import { Heading, Paragraph, Section, TextContainer } from './styles';
import { LinkButton } from '../Buttons/styles';

const Hero: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Section id="Home">
      <HeroImage />
      <TextContainer>
        <Heading>{t('HeroHeading')}</Heading>
        <Paragraph>{t('HeroParagraph')}</Paragraph>
        <LinkButton to="Portfolio" smooth={true} offset={-80} duration={500}>
          {t('Portfolio')}
        </LinkButton>
      </TextContainer>
    </Section>
  );
};
export default Hero;
