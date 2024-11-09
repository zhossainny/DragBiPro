import * as actions from './dashboardWidgetActions';
import * as types from './actionTypes';


describe('Dashboard widget actions test', () => {
    test('should create action on iframe changes', () => {
        const uid = '123';
        const data = [{ key: 'value' }];
        const expectedAction = {
            type: types.WIDGET_IFRAME_CHANGED,
            uid,
            data
        };

        expect(actions.iFrameChanged(uid, data)).toEqual(expectedAction);
    });
});