import { useTranslation } from 'react-i18next';
import HeroImage from '../HeroImage';
import { Heading, Paragraph, Section, TextContainer } from './styles';
import { LinkButton } from '../Buttons/styles';
import { scroller } from 'react-scroll';

const Hero: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Section id="Home">
      <HeroImage />
      <TextContainer>
        <Heading>{t('HeroHeading')}</Heading>
        <Paragraph>{t('HeroParagraph')}</Paragraph>
        <LinkButton
          to="Portfolio"
          smooth={true}
          offset={-80}
          duration={500}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              scroller.scrollTo('Portfolio', { offset: -80 });
            }
          }}
        >
          {t('Portfolio')}
        </LinkButton>
      </TextContainer>
    </Section>
  );
};
export default Hero;
