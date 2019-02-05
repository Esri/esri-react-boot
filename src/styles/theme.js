import { createMuiTheme } from '@material-ui/core/styles';

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
            '"Montserrat"',
            'sans-serif',
        ].join(','),
        fontSize: 16,
    },
});
