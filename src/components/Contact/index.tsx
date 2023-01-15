import { useTranslation } from 'react-i18next';
import { Section } from './styles';

const Contact: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Section id="Contact">
      <h2>{t('Contact')}</h2>
    </Section>
  );
};

export default Contact;
