import * as types from './actionTypes';

export function loadCollections() {
    return { type: types.LOAD_STORE_COLLECTIONS };
}

export function createUserCollection(collectionMeta) {
    return { type: types.CREATE_USER_COLLECTION, collectionMeta};
}

export function loadCollectionContents(collection, label, path) {
    return { type: types.LOAD_COLLECTION_CONTENTS, collection, label, path};
}

export function deleteCollectionFile(collection, label, path) {
    return { type: types.DELETE_COLLECTION_FILE, collection, label, path};
}

export function saveCollectionFile(collection, fileName, payload) {
    return { type: types.SAVE_COLLECTION_FILE, collection, fileName, payload};
}

export function resetCollectionState() {
    return { type: types.RESET_COLLECTION_STATE};
}

export function loadCollectionMembers(collection) {
    return { type: types.LOAD_COLLECTION_MEMBERS_REQUEST, collection};
}

export function addCollectionMembers(collection, members){
    return {type: types.ADD_COLLECTION_MEMBERS_REQUEST, collection, members};
}

export function deleteCollectionMember(collection, member){
    return {type: types.DELETE_COLLECTION_MEMBER_REQUEST, collection, member};
}

export function updateCollectionMember(collection, member){
    return { type: types.UPDATE_COLLECTION_MEMBER_REQUEST, collection, member};
}