import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function storeReducer(state = initialState.store, action) {
    switch (action.type) {
        case types.STORE_COLLECTIONS_LOADED:
            return { ...state, collections: action.collections };
        case types.LOAD_COLLECTION_MEMBERS_SUCCESS:
            return { ...state, members: action.members };
        case types.COLLECTION_CONTENTS_LOADED:
            return { ...state, contents: action.contents };
        case types.RESET_COLLECTION_STATE:
            return { ...state, contents: [] , error: null };
        case types.COLLECTION_ERROR:
            return { ...state, error: action.error };
        default:
            return state;
    }
}