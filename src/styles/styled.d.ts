import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      accent: string;
      background: string;
      text: string;
      textSecondary: string;
      divider: string;
      focus: string;
    };
  }
}
