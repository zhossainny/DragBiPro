import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import appsApi from "../api/appsApi";
import storeApi from "../api/storeApi";
import * as types from '../actions/actionTypes';

function* rootDashboardSaga() {
    yield takeEvery(types.SAVE_NEW_DASHBOARD, saveNewDashboard);
    yield takeEvery(types.LOAD_DASHBOARD, loadUserDashboard);
    yield takeEvery(types.UPDATE_DASHBOARD, updateDashboard);
    yield takeEvery(types.SAVE_LOCAL_FILE_UPLOAD, saveLocalFile);
    yield takeEvery(types.DASHBOARD_DATA_UPDATE, updateDashboardData);
    yield takeEvery(types.WIDGET_DATA_FILTER_CHANGED, widgetDataFilterCHanged);
}

const widgetSelector = state => state.dashboard.widgets;

function* saveNewDashboard(action) {
    try {
        yield put({ type: types.DASHBOARD_SAVING });
        yield put({ type: types.BEGIN_AJAX_CALL });
        yield call(appsApi.createApp, action.dashboardMeta);
        yield call(appsApi.uploadVersion, action.versionMeta, action.payload, true);
        yield put({ type: types.DASHBOARD_SAVED });
        yield put({ type: types.SHOW_DASHBOARD_NOTIFICATION, notification: { type: "info", message: "Saved!" } });
        yield put({ type: types.LOAD_APPS_REQUEST });
        yield put({ type: types.LOAD_DASHBOARD, dashboardKey: action.versionMeta.appKey });
        if (action.redirect) {
            yield put({ type: types.DASHBOARD_REDIRECT, redirect: action.redirect });
        }
        yield put({ type: types.LOAD_APPS_BY_ROLE_REQUEST, role: 'Admin' });
    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
        yield put({ type: types.DASHBOARD_SAVED });
        yield put({ type: types.SHOW_DASHBOARD_NOTIFICATION, notification: { type: "error", message: "Saving failed. " + e.message } });
    }
}

export function* updateDashboard(action) {
    try {
        const apps = yield select(state => state.apps);
        const { region, category, department } = apps.find(app => app.key === action.dashboardMeta.key);

        yield put({ type: types.BEGIN_AJAX_CALL });
        yield put({ type: types.DASHBOARD_SAVING });
        yield call(appsApi.saveAppMeta, {...action.dashboardMeta, region, category, department});
        yield call(appsApi.uploadVersion, action.versionMeta, action.payload, true);
        yield put({ type: types.LOAD_DASHBOARD, dashboardKey: action.versionMeta.appKey });
        yield put({ type: types.DASHBOARD_SAVED });
        yield put({ type: types.SHOW_DASHBOARD_NOTIFICATION, notification: { type: "info", message: "Saved!" } });
        yield put({ type: types.LOAD_APPS_REQUEST });
    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
        yield put({ type: types.DASHBOARD_SAVED });
        yield put({ type: types.SHOW_DASHBOARD_NOTIFICATION, notification: { type: "error", message: "Saving failed. " + e.message } });
    }
}

function* updateDashboardData(action) {
    try {
        let widgets = yield select(widgetSelector);
        let urls = new Set();
        for (let id of Object.getOwnPropertyNames(widgets)) {
            if (widgets[id] && widgets[id].url) {
                urls.add(widgets[id].url);
            }
        }
        for (let url of urls) {
            yield put({ type: types.DASHBOARD_DATA_LOAD_REQUEST, url: url, force: true });
        }
    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
    }
}

function* saveLocalFile(action) {
    try {
        yield put({ type: types.BEGIN_AJAX_CALL });
        yield put({ type: types.CREATE_USER_COLLECTION, collectionMeta: action.collectionMeta });
        yield call(storeApi.saveFile, action.collectionMeta.key, action.fileName, action.payload);
    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
    }
}

function* widgetDataFilterCHanged(action) {
    try {
        let widgets = yield select(widgetSelector);
        let masterWidget = widgets[action.uid];
        for (let id of Object.getOwnPropertyNames(widgets)) {
            if (masterWidget && widgets[id] && widgets[id].url && widgets[id].url.includes('{' + masterWidget.title + '}')) {
                yield put({
                    type: types.DASHBOARD_DATA_LOAD_REQUEST,
                    url: widgets[id].url,
                    force: true
                });
            }
        }
    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
    }
}

function* loadUserDashboard(action) {
    try {
        yield put({ type: types.BEGIN_AJAX_CALL });
        yield put({ type: types.DASHBOARD_LOADING });
        const versions = [2,3]//yield call(appsApi.fetchVersions, action.dashboardKey);
        if (versions.length > 0) {
            yield put({ type: types.DASHBOARD_VERSIONS_LOADED, versions: versions });
            let specificVersion = action.version;
            let versionToLoad = null;
            if (specificVersion) {
                versionToLoad = versions.find(x => x.tag === specificVersion.toString());
            }
            if (!versionToLoad) {
                versions.sort(function (a, b) {
                    if (a.timestamp === b.timestamp) {
                        return 0;
                    }
                    let aDate = new Date(a.timestamp);
                    let bDate = new Date(b.timestamp);
                    return aDate < bDate ? 1 : -1;
                });
                versionToLoad = versions[0];
            }
            const result = yield call(appsApi.fetchAppContent, action.dashboardKey, versionToLoad.tag);
            result.version = versionToLoad;
            yield put({ type: types.DASHBOARD_LOADED, dashboard: result });
        }
    } catch (e) {
        yield put({ type: types.AJAX_CALL_ERROR, error: e.message });
        yield put({ type: types.DASHBOARD_LOADED, dashboard: null });
        yield put({ type: types.SHOW_DASHBOARD_NOTIFICATION, notification: { type: "error", message: "Failed to load a dashboard. " + e.message } });
    }
}

export default rootDashboardSaga;