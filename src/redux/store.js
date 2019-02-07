/**
 * Configure and create the Redux here
 * includes Saga
 * @type {Object} This is the store object that Redux uses
 */

// REDUX IMPORTS //
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index';

import * as reducers from './';

export function initStore() {
  // Setup Redux dev tools
  // NOTE - Redux Devtool issue - see https://github.com/zalmoxisus/redux-devtools-extension/issues/619
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // Setup Redux store
  const rootReducer = combineReducers(reducers);
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(sagaMiddleware))
  );

  // Run sagas
  sagaMiddleware.run(rootSaga);

  return store;
}
