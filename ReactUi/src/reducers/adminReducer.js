import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function adminReducer(state = initialState.admin, action) {
    switch (action.type) {
        case types.CREATE_GROUP_REQUEST:
            return { ...state, groupsSaving: true };
        case types.CREATE_GROUP_SUCCESS:
            return { ...state, groupsSaving: false };
        case types.CREATE_GROUP_FAIL:
            return { ...state, groupsSaving: false };
        case types.LOAD_USER_APPS_REQUEST:
            return { ...state, appsLoading: true };
        case types.LOAD_ADMIN_DATA_REQUEST:
            return { ...state, appsLoading: true };
        case types.USER_APPS_LOADING:
            return { ...state, appsLoading: true };
        case types.LOAD_ADMIN_DATA_SUCCESS:
            return { ...state, appsLoading: false };
        case types.LOAD_USER_APPS_SUCCESS:
            return { ...state, permissionedApps: action.apps, appsLoading: false };
        case types.LOAD_APP_MEMBERS_MULTI_SUCCESS:
            return { ...state, membersByAppKey: action.result };
        case types.LOAD_USER_ID_SUCCESS:
            return { ...state, userId: action.userId };
        case types.SHOW_ADMIN_NOTIFICATION:
            return { ...state, notification: action.notification };
        case types.CLEAR_ADMIN_NOTIFICATION:
            return { ...state, notification: {} };
        case types.ADMIN_BULK_PERMISSIONS_SAVE_REQUEST:
            return { ...state, permissionsSaving: true};
        case types.ADMIN_BULK_PERMISSIONS_SAVE_COMPLETE:
            return { ...state, permissionsSaving: false};
        default:
            return state;
    }
}