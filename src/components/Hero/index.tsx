import { useTranslation } from 'react-i18next';
import HeroImage from '../HeroImage';
import { Button, Heading, Paragraph, Section, TextContainer } from './styles';

const Hero: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Section id="Home">
      <HeroImage />
      <TextContainer>
        <Heading>{t('HeroHeading')}</Heading>
        <Paragraph>{t('HeroParagraph')}</Paragraph>
        <Button to="Portfolio" smooth={true} offset={-80} duration={500}>
          {t('Portfolio')}
        </Button>
      </TextContainer>
    </Section>
  );
};
export default Hero;
