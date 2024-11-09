import * as actions from './filteredAppsActions';
import * as types from './actionTypes';

describe('Filtered apps actions tests', () => {
    test('should create action to filter apps', () => {
        const apps = [{}];
        const expectedAction = {
            type: types.FILTER_APPS_AND_SORT,
            apps,
            category: 'emea',
            searchTerm: 'kamen',
            sort: 'za'
        };

        expect(actions.filterAndSort(apps, 'emea', 'kamen', 'za')).toEqual(expectedAction);
    });

    test('should create sort action', () => {
        const expectedAction = {
            type: types.SORT_FILTERED_APPS,
            sort: 'az'
        };

        expect(actions.sort('az')).toEqual(expectedAction);
    });
});