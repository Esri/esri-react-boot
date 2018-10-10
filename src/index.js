// React //
import React from 'react';
import ReactDOM from 'react-dom';

// Redux //
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import rootSaga from './redux/sagas/index';
import { store, history, persistor, sagaMiddleware } from './redux/store';

// React Router //
import { Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

// Components //
import App from './components/App';

// Styles //
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { generateClassName, jss, createInsertPoint, theme } from './styles/theme';
import './styles/global';
import './styles/fonts.css';

console.log('Theme obj: ', theme)

// Create JSS insert point for theming
createInsertPoint();
// Run sagas
sagaMiddleware.run(rootSaga);
// Persist the store
persistStore(store);
// TODO what is this for?
window.persistor = persistor;

// App entry point
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <JssProvider jss={jss} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme}>
                    <Route path='/' component={App} />
                </MuiThemeProvider>
            </JssProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)
