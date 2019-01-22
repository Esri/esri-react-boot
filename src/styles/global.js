import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

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
        font-weight: ${theme.typography.fontWeightLight};
        letter-spacing: 1px;
        font-size: ${theme.typography.fontSize}px;
    }

    .esri-zoom {
        border-radius: ${theme.shape.borderRadius}px;
    }

    .esri-zoom .esri-widget--button:first-child {
        border-radius: ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0;
    }

    .esri-zoom .esri-widget--button:last-child {
        border-radius: 0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px;
    }
`;
