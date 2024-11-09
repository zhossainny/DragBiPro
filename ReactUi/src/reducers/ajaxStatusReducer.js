import * as types from '../actions/actionTypes';
import initialState from './initialState';

function actionTypeEndsInSuccess(type) {
    return type.substring(type.length - 8) === '_SUCCESS' ? type : "";
}

export default function ajaxStatusReducer(state = initialState.ajax, action) {
    switch (action.type) {
        case types.BEGIN_AJAX_CALL:
            return Object.assign({}, state, {ajaxCallsInProgress: state.ajaxCallsInProgress + 1, error: ""});
        case actionTypeEndsInSuccess(action.type):
            return Object.assign({}, state, {ajaxCallsInProgress: state.ajaxCallsInProgress - 1, error: ""});
        case types.AJAX_CALL_ERROR: {
            return Object.assign({}, state, {
                ajaxCallsInProgress: state.ajaxCallsInProgress - 1,
                error: action.error
            });}
        default:
            return state;
    }
}