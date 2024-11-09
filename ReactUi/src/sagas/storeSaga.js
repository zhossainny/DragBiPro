import {call, put, takeLatest, takeEvery, all, select} from 'redux-saga/effects';
import storeApi from '../api/storeApi';
import * as types from '../actions/actionTypes';

const userSelector = state => state.users;

function* rootStoreSaga() {
    yield takeLatest(types.LOAD_STORE_COLLECTIONS, fetchCollections);
    yield takeLatest(types.LOAD_COLLECTION_CONTENTS, fetchCollectionContents);
    yield takeLatest(types.CREATE_USER_COLLECTION, createUserQdCollection);
    yield takeLatest(types.DELETE_COLLECTION_FILE, deleteCollectionFile);
    yield takeLatest(types.SAVE_COLLECTION_FILE, saveCollectionFile);
    yield takeLatest(types.LOAD_COLLECTION_MEMBERS_REQUEST, fetchCollectionMembers);
    yield takeLatest(types.ADD_COLLECTION_MEMBERS_REQUEST, addCollectionMembers);
    yield takeLatest(types.UPDATE_COLLECTION_MEMBER_REQUEST, updateCollectionMember);
    yield takeLatest(types.DELETE_COLLECTION_MEMBER_REQUEST, deleteCollectionMember);
}

function* createUserQdCollection(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield call(storeApi.createCollection, action.collectionMeta);
        yield put({type: types.LOAD_STORE_COLLECTIONS});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchCollections() {
    try {
        //yield put({type: types.BEGIN_AJAX_CALL});

        //const collections = yield call(storeApi.fetchCollections);
        
       // yield put({type: types.STORE_COLLECTIONS_LOADED, collections: collections});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function* fetchCollectionMembers(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});

        let users = yield select(userSelector);

        let members = yield call(storeApi.fetchCollectionMembers, action.collection);

        members = members.map(member=> {
            let user = users.find(user=> user.username === member.id);

            return user != null
                ? {...member, name: user.name}
                : {...member, name: member.id};
        });

        yield put({type: types.LOAD_COLLECTION_MEMBERS_SUCCESS, members: members});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* fetchCollectionContents(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        const contents = yield call(storeApi.fetchCollectionContents, action.collection, action.label, action.path);
        yield put({type: types.COLLECTION_CONTENTS_LOADED, contents: contents});
        yield put({type: types.COLLECTION_ERROR, error: null});

    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
        yield put({type: types.COLLECTION_CONTENTS_LOADED, contents: []});
        yield put({type: types.COLLECTION_ERROR, error: e.message});
    }
}

function* deleteCollectionFile(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield call(storeApi.deleteCollectionFile, action.collection, action.label, action.path);
        let path = getDirName(action.path);
        yield put({type: types.LOAD_COLLECTION_CONTENTS, collection: action.collection, label: action.label, path: path});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* saveCollectionFile(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield call(storeApi.saveFile, action.collection, action.fileName, action.payload, false);
        let path = getDirName(action.fileName);
        yield put({type: types.LOAD_COLLECTION_CONTENTS, collection: action.collection, label: 'DEV', path: path});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}


function* addCollectionMembers(action) {
    let apiCalls = [];
    const members = action.members;
    for (let member in members) {
        yield put({type: types.BEGIN_AJAX_CALL});
        apiCalls.push(call(storeApi.addCollectionMember, action.collection, members[member]));
    }

    try {
        const responses = yield all(apiCalls);
        for (let response in responses) {
            if (response.status !== 200) {
                yield put({type: types.AJAX_CALL_ERROR, error: response.status + " " + response.statusText});
            }
        }
        yield put({type: types.LOAD_COLLECTION_MEMBERS_REQUEST, collection: action.collection});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});

    }
}

function* updateCollectionMember(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield call(storeApi.updateCollectionMember, action.collection, action.member);
        yield put({type: types.LOAD_COLLECTION_MEMBERS_REQUEST, collection: action.collection});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

function* deleteCollectionMember(action) {
    try {
        yield put({type: types.BEGIN_AJAX_CALL});
        yield call(storeApi.deleteCollectionMember, action.collection, action.member);
        yield put({type: types.LOAD_COLLECTION_MEMBERS_REQUEST, collection: action.collection});
    } catch (e) {
        yield put({type: types.AJAX_CALL_ERROR, error: e.message});
    }
}

export function getDirName(fullPath) {
    let path = fullPath.split('/').filter(Boolean);
    path = path.slice(0, path.length - 1);
    path = path.join('/') + '/';
    return path;
}

export default rootStoreSaga;