import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    margin: auto;
    height: 100%;
  }

  #root {
    position: relative;
    height: 100%;
    width: 100%;
  }
`;

export default GlobalStyles;
