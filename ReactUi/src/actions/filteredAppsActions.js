import * as types from './actionTypes';

export function filterAndSort(apps, category, searchTerm, sort) {
    return { type: types.FILTER_APPS_AND_SORT, apps, category, searchTerm, sort };
}
export function sort(sort) {
    return { type: types.SORT_FILTERED_APPS, sort };
}

export function resetFilteredApps(apps, sort) {
    return { type: types.RESET_FILTERED_APPS, apps, sort };
}