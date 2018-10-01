import { call, put, takeLatest } from 'redux-saga/effects';
import { startup as websceneStartup } from '../../services/agis-sceneview';
import { startup as mapviewStartup } from '../../services/agis-mapview';
import { types } from '../reducers/map';

// WORKERS //
function* sceneViewStart (action) {
    console.log('calling sceneStart: ', action);
    try {

        yield call(
            websceneStartup,
            action.payload.mapConfig,
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
            action.payload.features
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
export function* watchStartSceneView() {
    console.log('watching watchStartSceneView...');
    yield takeLatest(types.SCENE_VIEW_START, sceneViewStart);
}

export function* watchStartMapView() {
    console.log('watching watchStartMapView...');
    yield takeLatest(types.MAP_VIEW_START, mapViewStart);
}
