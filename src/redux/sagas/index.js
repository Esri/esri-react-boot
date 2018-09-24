import { all, fork } from 'redux-saga/effects';

import * as authSagas from './_auth';
import * as configSagas from './_config';
import * as mapSagas from './_map';

export default function* rootSaga() {
  yield all([
    ...Object.values(authSagas),
    ...Object.values(configSagas),
    ...Object.values(mapSagas),
    // more sagas from different files
  ].map(fork));
}
