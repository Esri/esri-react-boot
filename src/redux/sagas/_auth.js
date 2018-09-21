import { call, put, takeLatest } from 'redux-saga/effects';
import { startup, login } from '../../services/agis-auth';
import { types } from '../reducers/auth';

// WORKER //
function* fetchAPI(action) {
    try {
        // Call startup to get IdentityManager
        // params = config payload from action
        const mgmt = yield call(startup, action.payload);

        // Call login and return the user info
        // params = action.payload and IdentityManager
        const user = yield call(login, action.payload, mgmt);

        // Put the user info in the store and take success action
        yield put({
            type: types.AUTH_SUCCESS,
            payload: user
        });
    } catch (e) {
        // TODO - create better error handling
        //yield put({type: "FAILED", message: e.message});
        console.log('saga error...', e);
    }
}

// WATCHER //
export function* watchStartAPI() {
    yield takeLatest(types.API_START, fetchAPI);
}
