import * as actions from './dashboardActions';
import * as types from './actionTypes';


describe('Dashboard actions test', () => {
    test('should create action to mark resize event as consumed', () => {
        const eventId = '123';
        const expectedAction = {
            type: types.RESIZE_EVENT_CONSUMED,
            eventId
        };

        expect(actions.markResizeEventAsConsumed(eventId)).toEqual(expectedAction);
    });
});