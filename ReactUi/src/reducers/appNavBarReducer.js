import initialState from './initialState';
import * as types from '../actions/actionTypes';

export default function AppNavBarReducer(state = initialState.appNavBar, action) {
    switch (action.type) {
        case types.TOGGLE_APPNAVBAR_SHOW_MENU:
            return { ...state, showMenu: action.showMenu };
        default:
            return state;
    }
}