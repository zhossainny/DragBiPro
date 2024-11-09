import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import adminApi from '../api/adminApi';
import appsApi from "../api/appsApi";
import userApi from "../api/userApi";
import * as types from '../actions/actionTypes';

function* rootAdminSaga() {
    yield takeEvery(types.CREATE_GROUP_REQUEST, createGroup);
    yield takeLatest(types.ADMIN_BULK_PERMISSIONS_SAVE_REQUEST, saveUserPermissions);
    yield takeLatest(types.LOAD_USER_APPS_REQUEST, fetchUserApps);
    yield takeLatest(types.LOAD_APP_MEMBERS_MULTI_REQUEST, fetchAppMembersMulti);
    yield takeLatest(types.LOAD_USER_ID_REQUEST, fetchUserId);
    yield takeLatest(types.LOAD_ADMIN_DATA_REQUEST, fetchAdminData);
}

function* createGroup(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield call(adminApi.createGroup, action.groupName, action.groupAlias);
        yield put({type: types.LOAD_GROUPS_REQUEST});
        yield put({type: types.CREATE_GROUP_SUCCESS, group: {name: action.groupName, alias: action.groupAlias}});
        yield showAdminNotification({key: 'group', error: false, message: action.groupName + " created successfully!"});
    } catch (e) {
        yield showAdminNotification({key: 'group', error: true, message:"Saving failed: " + e.message});
        yield put({type: types.CREATE_GROUP_FAIL});
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchUserApps(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        const apps = yield call(adminApi.fetchUserApps, action.userId, action.isGroup);
        yield put({type: types.LOAD_USER_APPS_SUCCESS, apps: apps});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchAdminData(action) {
    try {
        yield fetchUserApps({ userId : action.userId, isGroup: action.isGroup});
        yield put({type: types.USER_APPS_LOADING});
        yield fetchAppMembersMulti({appKeys: action.appKeys});
        yield put({type: types.LOAD_ADMIN_DATA_SUCCESS});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* saveUserPermissions(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        for (let change of action.add) {
            yield call(appsApi.addAppMember, change.appKey, change.member);
        }

        for (let change of action.remove) {
            yield call(appsApi.deleteAppMember, change.appKey, change.member);
        }

        for (let change of action.update) {
            yield call(appsApi.updateAppMember, change.appKey, change.member);
        }
        yield fetchAdminData(action);
        yield showAdminNotification({key: 'permissions', error: false, message: "Saved"});
        yield put({type: types.ADMIN_BULK_PERMISSIONS_SAVE_COMPLETE});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
        yield put({type: types.ADMIN_BULK_PERMISSIONS_SAVE_COMPLETE});
        yield showAdminNotification({key: 'permissions', error: true, message: "Failed to save permissions!"});
    }
}

function* fetchAppMembersMulti(action) {

    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        const keys = action.appKeys;
        let results = {};

        for (let key of keys) {
            const members = yield call(appsApi.fetchAppMembers, key);
            results[key.toString()] = members;
        }
        yield put({type: types.LOAD_APP_MEMBERS_MULTI_SUCCESS, result: results});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchUserId(action) {

    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        const user = yield call(userApi.fetchUserId, action);
        yield put({type: types.LOAD_USER_ID_SUCCESS, userId: user.value});
        yield put({type: types.USER_PREFERENCES_REQUEST, userId: user.value});
        yield put({type: types.LOAD_FAVOURITES_REQUEST, userId: user.value});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* showAdminNotification(action) {
    yield put({type: types.SHOW_ADMIN_NOTIFICATION, notification: {key: action.key,  error: action.error,  message: action.message}});
}

export default rootAdminSaga;