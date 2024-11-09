import * as types from '../actions/actionTypes';
import DashboardReducer from './dashboardReducer';
import sinon from 'sinon';


describe('Dashboard reducer test', () => {
    test('should handle RESIZE_COMPONENTS', () => {
        expect(DashboardReducer(undefined, { type: types.RESIZE_COMPONENTS, eventId: '123', componentId: 'component1' }))
            .toEqual(expect.objectContaining({ resizeEvents: [{ eventId: '123', componentId: 'component1' }] }));
    });

    test('should not return event in state after handle RESIZE_EVENT_CONSUMED', () => {
        expect(DashboardReducer({ resizeEvents: [{ eventId: '1234', componentId: 'component0' },{ eventId: '123', componentId: 'component1' }] }, { type: types.RESIZE_EVENT_CONSUMED, eventId: '123', componentId: 'component1' }))
            .toEqual(expect.objectContaining({ resizeEvents: [{ eventId: '1234', componentId: 'component0' }] }));
    });

    test('should events in state after handle RESIZE_EVENT_CONSUMED with no match', () => {
        expect(DashboardReducer({ resizeEvents: [{ eventId: '123', componentId: 'component1' }] }, { type: types.RESIZE_EVENT_CONSUMED, eventId: '1234', componentId: 'component1' }))
            .toEqual(expect.objectContaining({ resizeEvents: [{ eventId: '123', componentId: 'component1' }] }));
    });

    test('should return reseizeEvents object for state that does not have one when handling RESIZE_COMPONENTS', () => {
        expect(DashboardReducer({ someOtherProperty: 'xxx' }, { type: types.RESIZE_COMPONENTS, eventId: '123', componentId: 'component1' }))
            .toEqual(expect.objectContaining({ resizeEvents: [{ eventId: '123', componentId: 'component1' }] }));
    });

    test('should handle DASHBOARD_DATA_LOAD_IN_PROGRESS set dataCache in progress when no other cache exists', () => {
        expect(DashboardReducer({ someOtherProperty: 'xxx' }, { type: types.DASHBOARD_DATA_LOAD_IN_PROGRESS, url: 'http://somedataurl.com' }))
            .toEqual(expect.objectContaining({ dataCache: { 'http://somedataurl.com': { status: 'IN_PROGRESS' } } }));
    });

    test('should handle DASHBOARD_DATA_LOAD_IN_PROGRESS set dataCache in progress when other cache exists', () => {
        expect(DashboardReducer({ dataCache: { 'http://somedataurl.com': { status: 'IN_PROGRESS' } } }, { type: types.DASHBOARD_DATA_LOAD_IN_PROGRESS, url: 'http://somedataurl2.com' }))
            .toEqual(expect.objectContaining({ dataCache: { 'http://somedataurl.com': { status: 'IN_PROGRESS' }, 'http://somedataurl2.com': { status: 'IN_PROGRESS' } } }));
    });

    test('should handle DASHBOARD_DATA_LOAD_IN_PROGRESS set dataCache in progress when same cache key already loaded', () => {
        expect(DashboardReducer({ dataCache: { 'http://somedataurl.com': { status: 'LOADED' } } }, { type: types.DASHBOARD_DATA_LOAD_IN_PROGRESS, url: 'http://somedataurl.com' }))
            .toEqual(expect.objectContaining({ dataCache: { 'http://somedataurl.com': { status: 'IN_PROGRESS' } } }));
    });

    test('should handle DASHBOARD_DATA_LOADED no cache exist for key', () => {
        const snapshotSpy = { getUrl: () => 'http://somedataurl.com' };
        expect(DashboardReducer({ refreshingUrls: ['http://somedataurl.com'] }, { type: types.DASHBOARD_DATA_LOADED, snapshot: snapshotSpy }))
            .toEqual(expect.objectContaining({ dataCache: { 'http://somedataurl.com': { status: 'CURRENT', snapshot: snapshotSpy } }, refreshingUrls: [], configurationChanged: false }));
    });

    test('should handle DASHBOARD_LOADED and assign refresh interval from action', () => {
        expect(DashboardReducer({ loadedDashboards: [], refreshInterval: 30 }, { type: types.DASHBOARD_LOADED, dashboard: { key: 'dash1', refreshInterval: 40} }))
            .toEqual(expect.objectContaining({ refreshInterval: 40 }));
    });

    test('should handle DASHBOARD_LOADED and assign refresh interval from state', () => {
        expect(DashboardReducer({ loadedDashboards: [], refreshInterval: 30 }, { type: types.DASHBOARD_LOADED, dashboard: { key: 'dash1' } }))
            .toEqual(expect.objectContaining({ refreshInterval: 30 }));
    });
});