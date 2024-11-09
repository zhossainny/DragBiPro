import * as actions from './appActions';
import * as types from './actionTypes';


describe('App actions test', () => {
    test('should create action to delete app', () => {
        const appKey = '123';
        const expectedAction = {
            type: types.DELETE_APP_REQUEST,
            appKey
        };

        expect(actions.deleteApp(appKey)).toEqual(expectedAction);
    });
});