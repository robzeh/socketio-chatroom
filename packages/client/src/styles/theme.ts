import { createGlobalStyle, DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    background: '#f5f5f5',
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: ${props => props.theme.colors.background};
  }
`;

export { theme, GlobalStyle };