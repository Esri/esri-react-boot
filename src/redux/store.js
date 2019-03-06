// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

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
