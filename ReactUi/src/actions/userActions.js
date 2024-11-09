import * as types from './actionTypes';

export function loadUsers() {
    return {type: types.LOAD_USERS_REQUEST};
}

export function loadGroups() {
    return {type: types.LOAD_GROUPS_REQUEST};
}

export function laodCurrentUser() {
    return {type: types.LOAD_USER_ID_REQUEST};
}