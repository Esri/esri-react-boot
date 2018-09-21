import { call, put, takeLatest } from 'redux-saga/effects';
import { startup } from '../../services/agis-webscene';
import { types } from '../reducers/webscene';

// WORKER //
function* mapStart (action) {
    try {

        yield call(startup, action.payload.webmapId, action.payload.mapOptions, action.payload.user);

        yield put({
            type: types.MAP_LOADED
        });
    } catch (e) {
        //yield put({type: "USER_FETCH_FAILED", message: e.message});
        console.log('fetchConfig saga error...', e);
    }
}

// WATCHER //
export function* watchStartMap() {
    yield takeLatest(types.MAP_START, mapStart);
}
