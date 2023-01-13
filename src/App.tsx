import { ThemeProvider, DefaultTheme } from 'styled-components';

import usePersistedState from './utils/usePersistedState';
import light from './styles/themes/light';
import dark from './styles/themes/dark';

import GlobalStyle from './styles/global';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';

const App: React.FC = () => {
  const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', light);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header toggleTheme={toggleTheme} />
      <Hero />
      <Experience />
      <Portfolio />
    </ThemeProvider>
  );
};
export default App;
