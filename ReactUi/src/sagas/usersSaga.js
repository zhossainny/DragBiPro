import {call, put, takeLatest, takeEvery} from 'redux-saga/effects';
import usersApi from '../api/userApi';
import * as types from '../actions/actionTypes';
import storeApi from "../api/storeApi";

function* rootUsersSaga() {
    yield takeLatest(types.LOAD_USERS_REQUEST, fetchUsers);
    yield takeLatest(types.LOAD_GROUPS_REQUEST, fetchGroups);
    yield takeLatest(types.USER_PREFERENCES_REQUEST, loadUserPreferences);
    yield takeLatest(types.SAVE_USER_PREFERENCES, saveUserPreferences);
}

export function* fetchUsers() {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        let users = yield call(usersApi.fetchUsers);

        users = users.map(user=>{
            let name = user.firstName && user.lastName ? user.lastName + ", "  + user.firstName : user.username;
            return {...user, id: user.username, name: name};
        });

        yield put({type: types.LOAD_USERS_SUCCESS, users: users});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function* fetchGroups() {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        
        let groups = yield call(usersApi.fetchGroups);

        groups = groups.map(group=>{
            return {id:  group, name: group};
        });
        
        yield put({type: types.LOAD_GROUPS_SUCCESS, groups: groups});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}


function* saveUserPreferences(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield put({type: types.CREATE_USER_COLLECTION, collectionMeta: action.collectionMeta}); //todo check if collection exists locally
        yield call(storeApi.saveFile, action.collectionMeta.key, 'preferences.json', action.preferences, true);
        yield put({type: types.USER_PREFERENCES_LOADED, preferences: action.preferences});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}


function* loadUserPreferences(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        let preferences = yield call(storeApi.fetchCollectionContents, action.userId, 'DEV', 'preferences.json');
        yield put({type: types.USER_PREFERENCES_LOADED, preferences: preferences});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}


export default rootUsersSaga;