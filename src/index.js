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
import { injectGlobal } from 'styled-components';
import 'primereact/resources/primereact.min.css';
import './styles/theme.css';
import 'primeicons/primeicons.css';

injectGlobal`
    html,
    body {
        height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        font-weight: 100;
        letter-spacing: 1px;
        font-size: 16px !important;
    }
`;

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
            <Route path='/' component={App} />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)
