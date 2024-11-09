import * as types from './actionTypes';

export function createGroup(groupName, groupAlias) {
    return {type: types.CREATE_GROUP_REQUEST, groupName, groupAlias};
}

export function fetchPermissionedApps(userId, isGroup) {
    return {type: types.LOAD_USER_APPS_REQUEST, userId, isGroup};
}

export function fetchAppMembersMulti(appKeys) {
    return {type: types.LOAD_APP_MEMBERS_MULTI_REQUEST, appKeys};
}

export function loadAdminData(userId, isGroup, appKeys) {
    return {type: types.LOAD_ADMIN_DATA_REQUEST, userId, isGroup, appKeys};
}

export function showAdminNotification(notification){
    return {type: types.SHOW_ADMIN_NOTIFICATION, notification};
}

export function clearAdminNotification(){
    return {type: types.CLEAR_ADMIN_NOTIFICATION};
}

export function savePermissionChanges(add, remove, update, userId, isGroup, appKeys){
    return {type: types.ADMIN_BULK_PERMISSIONS_SAVE_REQUEST, add, remove, update, userId, isGroup, appKeys};
}