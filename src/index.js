// React //
import React from 'react';
import ReactDOM from 'react-dom';

// Redux //
import { Provider } from 'react-redux';
import { initStore } from './redux/store';

// React Router //
import { BrowserRouter, Route } from 'react-router-dom';

// Components //
import { homepage } from '../package.json';
import App from './components/App';

// Styles //
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { generateClassName, jss, createInsertPoint, theme } from './styles/theme';
import './styles/global';
import './styles/fonts.css';

console.log('Theme obj: ', theme)

// App runs at the root locally, but under /{homepage} in production
let basename;
process.env.NODE_ENV !== 'production' ? (basename = '') : (basename = homepage);

// Create JSS insert point for theming
createInsertPoint();
// Create Redux Store
export const store = initStore();

// App entry point
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={basename}>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <Route path='/' component={App} />
        </MuiThemeProvider>
      </JssProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
