import { call, put, takeLatest } from 'redux-saga/effects';
import { types } from '../reducers/auth';

// WORKER //
function* checkAuth(action) {
  try {
    const authObj = yield call(window.authManager.login);

    if (authObj) {
      yield put({
          type: types.AUTH_SUCCESS,
          payload: authObj
      });
    } else {
      yield put( {type: types.AUTH_FAIL} );
    }

  } catch(e) {
    yield put( {type: types.AUTH_FAIL} );
    console.error('SAGA ERROR: auth/checkAuth, ', e);
  }
}

// WATCHER //
export function* watchStartAPI() {
    yield takeLatest(types.AUTH_CHECK, checkAuth);
}
