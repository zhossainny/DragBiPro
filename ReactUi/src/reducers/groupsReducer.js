import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function groupsReducer(state = initialState.groups, action) {
    switch (action.type) {
        case types.LOAD_GROUPS_SUCCESS:
            return action.groups;
        default:
            return state;
    }
}