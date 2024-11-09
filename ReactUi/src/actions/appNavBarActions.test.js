import * as actions from './appNavBarActions';
import * as types from './actionTypes';


describe('AppNavBar actions test', () => {
    test('should toggle show menu', () => {
        const showMenu = true;
        const expectedAction = {
            type: types.TOGGLE_APPNAVBAR_SHOW_MENU,
            showMenu
        };

        expect(actions.toggleAppNavBarShowMenu(showMenu)).toEqual(expectedAction);
    });
});