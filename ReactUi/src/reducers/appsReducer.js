import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function appsReducer(state = initialState.apps, action) {
    switch (action.type) {
        case types.LOAD_APPS_SUCCESS:
            return action.apps;
        default:
            return state;
    }
}