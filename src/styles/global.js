import { createGlobalStyle } from "styled-components";

// Global page styling
// override AGIS JS API Widgets here
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    font-family: Avenir Next, sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    font-weight: 300;
    letter-spacing: 1px;
    font-size: 16px;
  }

  .esri-layer-list__item{
    &::before {
      width: 100%;
      left: 0;
    }
  }
`;
