import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function appsByRoleReducer(state = initialState.appsByRole, action) {
    switch (action.type) {
        case types.LOAD_APPS_BY_ROLE_SUCCESS: {
            let copy = Object.assign({}, state);
            copy[action.role] = action.apps;
            return copy;
        }
        default:
            return state;
    }
}