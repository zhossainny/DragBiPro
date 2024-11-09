import * as types from '../actions/actionTypes';
import FilteredAppsReducer from './filteredAppsReducer';
import Fuse from 'fuse.js';

const mockFuseSearch = jest.fn();
jest.mock('fuse.js', () => {
    return jest.fn().mockImplementation(() => ({ search: mockFuseSearch }));
});


describe('FilteredAppsReducer tests', () => {
    let initialApps = [
        { key: 'app1', name: 'App 1', appType: 'DASHBOARD', region: 'global' },
        { key: 'app2', name: 'App 2', appType: 'WEBAPP' },
        { key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' },
        { key: 'app3', name: 'App 3', appType: 'DASHBOARD', region: 'emea' }
    ];

    beforeEach(() => {
        Fuse.mockClear();
        mockFuseSearch.mockClear();
    });

    test('should copy dashboards to filteredApps', () => {
        expect(FilteredAppsReducer([], { type: types.LOAD_APPS_SUCCESS, apps: initialApps }))
            .toEqual([
                { key: 'app1', name: 'App 1', appType: 'DASHBOARD', region: 'global' },
                { key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' },
                { key: 'app3', name: 'App 3', appType: 'DASHBOARD', region: 'emea' }
            ]);
    });

    test('should filter apps based on fuse search result', () => {
        mockFuseSearch.mockReturnValue([{ key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }]);

        expect(FilteredAppsReducer([], { type: types.FILTER_APPS_AND_SORT, apps: initialApps, searchTerm: 'app4' }))
            .toEqual([{ key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }]);
        expect(mockFuseSearch.mock.calls[0][0]).toBe('app4');
    });

    test('should not call Fuse if filterText is empty', () => {
        expect(FilteredAppsReducer([], { type: types.FILTER_APPS_AND_SORT, apps: initialApps, searchTerm: '' }))
            .toEqual([
                { key: 'app1', name: 'App 1', appType: 'DASHBOARD', region: 'global' },
                { key: 'app3', name: 'App 3', appType: 'DASHBOARD', region: 'emea' },
                { key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }
            ]);
        expect(mockFuseSearch.mock.calls.length).toBe(0);
    });

    test('should filter by category', () => {
        expect(FilteredAppsReducer([], { type: types.FILTER_APPS_AND_SORT, apps: initialApps, category: 'global' }))
            .toEqual([
                { key: 'app1', name: 'App 1', appType: 'DASHBOARD', region: 'global' },
                { key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }
            ]);
    });

    test('should search by both category and searchTerm', () => {
        mockFuseSearch.mockReturnValue([{ key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }]);

        expect(FilteredAppsReducer([], { type: types.FILTER_APPS_AND_SORT, apps: initialApps, category: 'global', searchTerm: 'app4' }))
            .toEqual([{ key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }]);
    });

    test('should sort A-Z', () => {
        expect(FilteredAppsReducer(initialApps, { type: types.SORT_FILTERED_APPS, sort: 'az' }))
            .toEqual([
                { key: 'app1', name: 'App 1', appType: 'DASHBOARD', region: 'global' },
                { key: 'app2', name: 'App 2', appType: 'WEBAPP' },
                { key: 'app3', name: 'App 3', appType: 'DASHBOARD', region: 'emea' },
                { key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }
            ]);
    });

    test('should reset filtered apps and sort', () => {
        expect(FilteredAppsReducer([], { type: types.RESET_FILTERED_APPS, apps: initialApps, sort: 'az' }))
            .toEqual([
                { key: 'app1', name: 'App 1', appType: 'DASHBOARD', region: 'global' },
                { key: 'app3', name: 'App 3', appType: 'DASHBOARD', region: 'emea' },
                { key: 'app4', name: 'App 4', appType: 'DASHBOARD', region: 'global' }
            ]);
    });
});