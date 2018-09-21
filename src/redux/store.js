// REDUX IMPORTS //
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as reducers from './';
// PERSIST IMPORTS //
import { createBrowserHistory } from 'history';
import { createPersistoid } from 'redux-persist';
// ROUNTER IMPORTS //
import { routerMiddleware, connectRouter } from 'connected-react-router';

let basename;
process.env.NODE_ENV !== 'production' ? basename = '' : basename = '/inspector';

export const history = createBrowserHistory({ basename });

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers(reducers);

export const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(
    applyMiddleware(routerMiddleware(history), sagaMiddleware)
  )
);

export const persistor = createPersistoid(store, { blacklist: ['auth'] });
