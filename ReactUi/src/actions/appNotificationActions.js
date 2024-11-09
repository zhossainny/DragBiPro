import * as types from './actionTypes';

export function showNotification(notification){ 
    return {type: types.SHOW_APP_NOTIFICATION, notification};
}

export function clearNotification(){
    return {type: types.CLEAR_APP_NOTIFICATION};
}