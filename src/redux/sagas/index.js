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
 * Combine your Sagas into one output
 */

import { all, fork } from 'redux-saga/effects';

import * as authSagas from './_auth';
import * as configSagas from './_config';

export default function* rootSaga() {
  yield all([
    ...Object.values(authSagas),
    ...Object.values(configSagas),
    // more sagas from different files
  ].map(fork));
}
