import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  &::selection {
    color: ${props => props.theme.colors.textSecondary};
    background: ${props => props.theme.colors.accent};
  }
}

a {
  text-decoration: none;

}

body {
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-family: Poppins, sans-serif;
  -ms-overflow-style: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &::-webkit-scrollbar {
    width: 0.2em;
    background-color: #F5F5F5;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #000000;
  }
}

h2 {
  font-size: 2.5rem;
  border-bottom: 4px solid ${props => props.theme.colors.text};
  width: fit-content;
}
`;
