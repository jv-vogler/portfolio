import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJson from './translations/en.json';
import pt_brJson from './translations/pt_br.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: enJson,
    pt_br: pt_brJson,
  },
});

export default i18n;
