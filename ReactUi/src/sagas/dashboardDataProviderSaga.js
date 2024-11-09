import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import 'isomorphic-fetch';
import DataSnapshot from '../models/dashboard/DataSnapshot';
import ErrorSnapshot from "../models/dashboard/ErrorSnapshot";

function* rootDashboardDataProviderSaga() {
    yield takeEvery(types.DASHBOARD_DATA_LOAD_REQUEST, loadData);
}

const dataCacheSelector = state => state.dashboard.dataCache;
const dashboardConfigSelector = state => state.dashboard.configurationItems;
const widgetSelector = state => state.dashboard.widgets;

export function* loadData(action) {
    try {
        yield put({ type: types.BEGIN_AJAX_CALL });
        yield put({ type: types.DASHBOARD_DATA_BEGIN_LOAD, url: action.url });
        let currentSnapshot = null;
        let cache = yield select(dataCacheSelector);
        if (cache && action.url in cache) {
            currentSnapshot = cache[action.url].snapshot;
            if (cache[action.url].status === 'IN_PROGRESS') {
                return;
            }
            if (!action.force && currentSnapshot.isFresh(15) && !(currentSnapshot instanceof ErrorSnapshot)) {
                return;
            }
        }
        let url = action.url;
        let configItems = yield select(dashboardConfigSelector);
        for (let configItem of configItems) {
            let placeholder = '{' + configItem.name + '}';
            if (url.includes(placeholder)) {
                url = url.toString().replace(placeholder, configItem.value);
            }
        }
        if (url.includes('{')) {
            let widgets = yield select(widgetSelector);
            for (let id of Object.getOwnPropertyNames(widgets)) {
                if (url.includes('{' + widgets[id].title + '}')) {
                    let placeholder = '{' + widgets[id].title + '}';
                    url = url.toString().replace(placeholder, widgets[id].publishedFilterValue);
                }
            }
        }
        yield put({ type: types.DASHBOARD_DATA_LOAD_IN_PROGRESS, url: action.url });
        let data = yield call(genericFetch, url);
        let version = currentSnapshot === null ? 0 : currentSnapshot.getVersion() + 1;
        let newSnapshot = new DataSnapshot(action.url, data, version);
        yield put({ type: types.DASHBOARD_DATA_LOADED, snapshot: newSnapshot });

    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
        let errorSnapshot = new ErrorSnapshot(action.url, e.message);
        yield put({ type: types.DASHBOARD_DATA_LOADED, snapshot: errorSnapshot });
    }
}

function genericFetch(url) {
    return fetch(url, {
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            let errorMessage = response.statusText;
            if (response.headers.has('errorText')) {
                errorMessage = response.headers.get('errorText');
            }
            throw Error(errorMessage);
        } else {
            return response.text();
        }
    })
        .catch(error => {
            let errorMsg = error.message === 'Failed to fetch' ?
                'Use \'External\' control to display other widgets.' : error.message;
            throw Error('No data returned: ' + errorMsg);
        });
}



export default rootDashboardDataProviderSaga;