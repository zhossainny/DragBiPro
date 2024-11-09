import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function notificationReducer(state = initialState.notification, action) {
    switch (action.type) {        
        case types.SHOW_APP_NOTIFICATION:
            return action.notification;
        case types.CLEAR_APP_NOTIFICATION:
            return {};
        default:
            return state;
    }
}