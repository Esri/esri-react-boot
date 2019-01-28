import { call, put, takeLatest } from 'redux-saga/effects';
import { getAppConfig } from '../../services/api';
import { types as configTypes } from '../reducers/config';

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

    } catch (e) {
        console.log('SAGA ERROR: config/fetchConfig, ', e);
    }
}

// WATCHER //
export function* watchFetchConfig() {
    yield takeLatest(configTypes.CONFIG_FETCH, fetchConfig);
}
