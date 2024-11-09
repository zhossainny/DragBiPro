import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function membersReducer(state = initialState.members, action) {
    switch (action.type) {
        case types.LOAD_APP_MEMBERS_SUCCESS:
            return action.members;
        default:
            return state;
    }
}