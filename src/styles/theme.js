import { createMuiTheme, createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';

export const generateClassName = createGenerateClassName();
export const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: 'jss-insertion-point',
});


// function to creat JSS insertion point so it is lower specificity than styled-components
// requires <noscript> tag in head with id
export function createInsertPoint() {
    const styleNode = document.createComment("jss-insertion-point");
    document.head.insertBefore(styleNode, document.getElementById("jss-insertion-point"));
}

// MUI Theme object
// can inject custom properties
export const theme = createMuiTheme({
    palette: {
        background: {
            header: {
                main: '#eff0f2',
                dark: '#dadce0',
            }
        },
        text: {
            primary: '#4d4d4d',
        }
    },
    typography: {
        useNextVariants: true,
        fontFamily: [
            '"Avenir Next"',
            'sans-serif',
        ].join(','),
        fontSize: 16,
    },
});
