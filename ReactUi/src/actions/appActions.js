import * as types from './actionTypes';

export function loadApps() {
    return { type: types.LOAD_APPS_REQUEST };
}

export function loadAppsByRole(role) {
    return { type: types.LOAD_APPS_BY_ROLE_REQUEST, role };
}

export function loadMembers(appKey) {
    return { type: types.LOAD_APP_MEMBERS_REQUEST, appKey };
}

export function addMembers(appKey, members) {
    return { type: types.ADD_APP_MEMBERS_REQUEST, appKey, members };
}

export function deleteMember(appKey, member) {
    return { type: types.DELETE_APP_MEMBER_REQUEST, appKey, member };
}

export function deleteApp(appKey) {
    return { type: types.DELETE_APP_REQUEST, appKey };
}

export function updateMember(appKey, member) {
    return { type: types.UPDATE_APP_MEMBER_REQUEST, appKey, member };
}

export function saveAppMeta(appMeta) {
    return { type: types.SAVE_APP_META_REQUEST, appMeta };
}

export function createApp(appMeta) {
    return { type: types.CREATE_APP_REQUEST, appMeta };
}

export function uploadVersion(version, file) {
    return { type: types.UPLOAD_VERSION_REQUEST, version, file };
}

export function labelVersion(appKey, label, tag) {
    return { type: types.LABEL_VERSION_REQUEST, appKey, label, tag };
}