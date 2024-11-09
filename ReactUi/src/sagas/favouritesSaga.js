import { takeLatest, put, call, takeEvery } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import favouritesApi from './../api/favouritesApi';

function* rootFavouritesSage() {
    yield takeLatest(types.LOAD_FAVOURITES_REQUEST, fetchFavourites);
    yield takeLatest(types.UNFAVOURITE_APP_SUCCESS, fetchFavourites);
    yield takeLatest(types.FAVOURITE_APP_SUCCESS, fetchFavourites);
    yield takeEvery(types.UNFAVOURITE_APP_REQUEST, unfavouriteApp);
    yield takeEvery(types.FAVOURITE_APP_REQUEST, favouriteApp);
}

export function* fetchFavourites(action){
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const favourites = yield call(favouritesApi.fetchFavourites, action.userId);

        yield put({type: types.LOAD_FAVOURITES_SUCCESS, favourites });
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function* unfavouriteApp(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        yield call(favouritesApi.unfavouriteApp, action.userId, action.appKey);

        yield put({type: types.UNFAVOURITE_APP_SUCCESS, userId: action.userId });
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function* favouriteApp(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        yield call(favouritesApi.favouriteApp, action.userId, action.appKey);

        yield put({type: types.FAVOURITE_APP_SUCCESS, userId: action.userId });
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export default rootFavouritesSage;