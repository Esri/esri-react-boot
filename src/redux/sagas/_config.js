import { call, put, takeLatest } from 'redux-saga/effects';
import { getAppConfig } from '../../services/api';
import { types as configTypes } from '../reducers/config';
import { types as authTypes } from '../reducers/auth';

// WORKER //
function* fetchConfig (action) {
    try {
        // call API to fetch config
        const config = yield call(getAppConfig);

        // Put config in store
        yield put({
            type: configTypes.SET_CONFIG,
            payload: config
        });

        // Send config to auth to use
        yield put({
            type: authTypes.API_START,
            payload: config
        });
    } catch (e) {
        //TODO error handling...
        //yield put({type: "USER_FETCH_FAILED", message: e.message});
        console.log('fetchConfig saga error...', e);
    }
}

// WATCHER //
export function* watchFetchConfig() {
    yield takeLatest(configTypes.CONFIG_FETCH, fetchConfig);
}
