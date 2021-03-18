import { createGlobalStyle, DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    background: '#f5f5f5',
  }
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.background};
  }
`;

export { theme, GlobalStyle };