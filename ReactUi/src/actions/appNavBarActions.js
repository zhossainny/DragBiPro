import * as types from './actionTypes';


export function toggleAppNavBarShowMenu(showMenu) {
    return { type: types.TOGGLE_APPNAVBAR_SHOW_MENU, showMenu };
}