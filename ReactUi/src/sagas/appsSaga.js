import {all, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects';
import appsApi from '../api/appsApi';
import * as types from '../actions/actionTypes';

const userSelector = state => state.users;

function* rootAppsSaga() {
    yield takeLatest(types.LOAD_APPS_REQUEST, fetchApps);
    //yield takeLatest(types.LOAD_APPS_BY_ROLE_REQUEST, fetchAppsByRole);
   // yield takeLatest(types.LOAD_VERSIONS_REQUEST, fetchVersions);
    //yield takeLatest(types.LOAD_APP_MEMBERS_REQUEST, fetchAppMembers);
    //yield takeEvery(types.ADD_APP_MEMBERS_REQUEST, addAppMembers);
    //yield takeLatest(types.ADD_APP_MEMBERS_COMPLETE, fetchAppMembers);
    //yield takeEvery(types.UPDATE_APP_MEMBER_REQUEST, updateAppMember);
    //yield takeLatest(types.UPDATE_APP_MEMBER_COMPLETE, fetchAppMembers);
    //yield takeEvery(types.DELETE_APP_MEMBER_REQUEST, deleteAppMember);
    //yield takeLatest(types.DELETE_APP_MEMBER_COMPLETE, fetchAppMembers);
    yield takeEvery(types.DELETE_APP_REQUEST, deleteApp);
    yield takeLatest(types.DELETE_APP_COMPLETE, fetchApps);//https://stark-journey-33195.herokuapp.com/
    yield takeEvery(types.SAVE_APP_META_REQUEST, saveApp);
    yield takeLatest(types.SAVE_APP_META_COMPLETE, fetchApps);
    yield takeEvery(types.CREATE_APP_REQUEST, createApp);
    //yield takeEvery(types.CREATE_APP_SUCCESS, notifyAppCreated);
    //yield takeEvery(types.UPLOAD_VERSION_REQUEST, uploadVersion);
    //yield takeEvery(types.UPLOAD_VERSION_SUCCESS, labelVersion);
    //yield takeLatest(types.LABEL_VERSION_SUCCESS, fetchVersions);
}

function* fetchApps() {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const apps = yield call(appsApi.fetchApps);

        yield put({type: types.LOAD_APPS_SUCCESS, apps: apps});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchAppsByRole(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const apps = yield call(appsApi.fetchAppsByRole, action.role);

        yield put({type: types.LOAD_APPS_BY_ROLE_SUCCESS, apps: apps, role: action.role});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* createApp(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const app = yield call(appsApi.createApp, action.appMeta);

        yield fetchApps();

        yield put({type: types.CREATE_APP_SUCCESS, app: app});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* saveApp(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const result = yield call(appsApi.saveAppMeta, action.appMeta);

        yield put({type: types.SAVE_APP_META_COMPLETE, app: result});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function* deleteApp(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        yield call(appsApi.deleteApp, action.appKey);

        yield put({type: types.DELETE_APP_COMPLETE, appKey: action.appKey});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function* fetchAppMembers(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        let users = yield select(userSelector);

        let members = yield call(appsApi.fetchAppMembers, action.appKey);

        members = members.map(member=> {
            let user = users.find(user=> user.username === member.id);

            return user != null
                ? {...member, name: user.name}
                : {...member, name: member.id};
        });

        yield put({type: types.LOAD_APP_MEMBERS_SUCCESS, members: members});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* addAppMembers(action) {
    let apiCalls = [];

    const members = action.members;

    for (let member in members) {
        yield put({type: types.BEGIN_AJAX_CALL});

        apiCalls.push(call(appsApi.addAppMember, action.appKey, members[member]));
    }

    try {
        const responses = yield all(apiCalls);

        for (let response in responses) {
            if (response.status !== 200) {
                yield put({type: types.AJAX_CALL_ERROR, error: response.status + " " + response.statusText});
            }
        }
        yield put({type: types.ADD_APP_MEMBERS_COMPLETE, appKey: action.appKey});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});

    }
}

function* updateAppMember(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        yield call(appsApi.updateAppMember, action.appKey, action.member);

        yield put({type: types.UPDATE_APP_MEMBER_COMPLETE, appKey: action.appKey});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* deleteAppMember(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        yield call(appsApi.deleteAppMember, action.appKey, action.member);

        yield put({type: types.DELETE_APP_MEMBER_COMPLETE, appKey: action.appKey});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchVersions(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const versions = [2,3]//yield call(appsApi.fetchVersions, action.appKey);

        yield put({type: types.LOAD_VERSIONS_SUCCESS, versions: versions});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* clearVersions() {
    yield put({type: types.LOAD_APPS_SUCCESS, versions: []});
}

function* uploadVersion(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        const version = yield call(appsApi.uploadVersion, action.version, action.file);

        yield put({type: types.UPLOAD_VERSION_SUCCESS, version: version});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* labelVersion(action) {
    try {
        let appKey = action.version.appKey;
        let label = "PROD";
        let tag = action.version.tag;

        yield put({type: types.BEGIN_AJAX_CALL});

        yield call(appsApi.labelVersion, appKey, label, tag);

        yield put({type: types.LABEL_VERSION_SUCCESS, appKey: appKey});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* notifyAppCreated(action) {
    yield put({type: types.SHOW_APP_NOTIFICATION, notification: {app: action.app}});
}

function memberDisplayName(id, allUsers){
    let user =  allUsers.find(user=> user.username === id);

    if(user){
        return user.firstName && user.lastName ? user.lastName + ", "  + user.firstName : id;
    }

    return id;
}

export default rootAppsSaga;