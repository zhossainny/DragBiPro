import * as types from '../actions/actionTypes';
import AppNavBarReducer from './appNavBarReducer';

describe('AppNavBarReducer tests', () => {
    test('should handle toggle show menu', () => {
        expect(AppNavBarReducer({ appNavBar: { showMenu: false } }, { type: types.TOGGLE_APPNAVBAR_SHOW_MENU, showMenu: true }))
            .toEqual(expect.objectContaining({ showMenu: true }));
    });
});
