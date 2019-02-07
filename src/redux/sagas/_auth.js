import { call, put, takeLatest } from 'redux-saga/effects';
import { types } from '../reducers/auth';
import { logout } from '../../services/api';

// WORKER //
function* checkAuth(action) {
  try {
    const authObj = yield call(window.authManager.login, action.payload.portalUrl);

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

function* authLogout(action) {
  try {
    yield call(window.authManager.logout);
    yield call(logout, action.payload.portalUrl);
    window.location.reload();
  } catch(e) {
    //yield put( {type: types.AUTH_FAIL} );
    console.error('SAGA ERROR: auth/logout, ', e);
  }
}

// WATCHER //
export function* watchStartAPI() {
  yield takeLatest(types.AUTH_CHECK, checkAuth);
  yield takeLatest(types.LOGOUT, authLogout);
}
