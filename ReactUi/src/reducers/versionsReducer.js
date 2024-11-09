import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function versionsReducer(state = initialState.versions, action) {
    switch (action.type) {
        case types.LOAD_VERSIONS_SUCCESS:
            return action.versions;
        default:
            return state;
    }
}