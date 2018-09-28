import { call, put, takeLatest } from 'redux-saga/effects';
import { startup as websceneStartup } from '../../services/agis-webscene';
import { startup as mapviewStartup } from '../../services/agis-mapview';
import { types } from '../reducers/map';

// WORKERS //
function* mapStart (action) {
    console.log('calling mapStart: ', action);
    try {

        yield call(
            mapviewStartup,
            action.payload.webmapId,
            action.payload.mapOptions,
            action.payload.user,
            action.payload.node
        );

        yield put({
            type: types.MAP_LOADED
        });
    } catch (e) {
        //yield put({type: "USER_FETCH_FAILED", message: e.message});
        console.log('fetchConfig saga error...', e);
    }
}

function* mapViewStart (action) {
    console.log('calling mapStart: ', action);
    try {

        let mapResponse = yield call(
            mapviewStartup,
            action.payload.mapConfig,
            action.payload.node,
        );

        console.log('mapResponse: ', mapResponse);

        yield put({
            type: types.MAP_LOADED
        });
    } catch (e) {
        //yield put({type: "USER_FETCH_FAILED", message: e.message});
        console.log('fetchConfig saga error...', e);
    }
}

// WATCHERS //
export function* watchStartMap() {
    console.log('watching watchStartMap...');
    yield takeLatest(types.WEB_SCENE_START, mapStart);
}

export function* watchStartMapView() {
    console.log('watching watchStartMapView...');
    yield takeLatest(types.MAP_VIEW_START, mapViewStart);
}
