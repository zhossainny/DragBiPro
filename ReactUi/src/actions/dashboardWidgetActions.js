import * as types from './actionTypes';

export function editWidget(uid, editing) {
    return { type: types.EDIT_WIDGET, uid, editing };
}

export function registerUrl(uid, url) {
    return { type: types.WIDGET_REGISTER_URL, uid, url };
}

export function localDataLoaded(uid, loaded) {
    return { type: types.LOCAL_DATA_LOADED, uid, loaded };
}

export function registerControls(uid, controls) {
    return { type: types.REGISTER_WIDGET_CONTROLS, uid, controls };
}

export function saveLocalFile(userId, collectionMeta, fileName, payload) {
    return { type: types.SAVE_LOCAL_FILE_UPLOAD, userId, collectionMeta, fileName, payload };
}

export function loadData(url, force) {
    return { type: types.DASHBOARD_DATA_LOAD_REQUEST, url, force };
}

export function registerWidget(uid, title) {
    return { type: types.WIDGET_REGISTER, uid, title };
}

export function deregisterWidget(uid) {
    return { type: types.WIDGET_DEREGISTER, uid };
}

export function dataFilterChanged(uid, filterValue) {
    return { type: types.WIDGET_DATA_FILTER_CHANGED, uid, filterValue };
}

export function setMasterWidget(masterWidget) {
    return { type: types.WIDGET_SET_MASTER_WIDGET, masterWidget };
}

export function iFrameChanged(uid, data) {
    return { type: types.WIDGET_IFRAME_CHANGED, uid, data };
}