import * as types from '../actions/actionTypes';
import initialState from './initialState';
import Fuse from 'fuse.js';
import { APP_TYPE_DASHBOARD } from './../configuration/constants';

const fuseOptions = {
    shouldSort: true,
    findAllMatches: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
        "key", "name", "tags.updatedBy"
    ]
};

export default function FilteredAppsReducer(state = initialState.filteredApps, action) {
    const sortFunc = sort => (a, b) => {
        if (sort === 'za') {
            return b.name.localeCompare(a.name);
        }

        return a.name.localeCompare(b.name);
    };

    switch (action.type) {
        case types.LOAD_APPS_SUCCESS: {
            return action.apps.filter(app => app.appType === APP_TYPE_DASHBOARD);
        }
        case types.FILTER_APPS_AND_SORT: {
            let dashboards = action.apps.filter(app => app.appType === APP_TYPE_DASHBOARD);

            if (action.category) {
                dashboards = dashboards.filter(app => app.region === action.category);
            }

            if (action.searchTerm) {
                let fuse = new Fuse(dashboards, fuseOptions);
                dashboards = fuse.search(action.searchTerm);
            }

            return dashboards.sort(sortFunc(action.sort));
        }
        case types.SORT_FILTERED_APPS: {
            return [...state].sort(sortFunc(action.sort));
        }
        case types.RESET_FILTERED_APPS: {
            if (action.sort) {
                return action.apps.filter(app => app.appType === APP_TYPE_DASHBOARD).sort(sortFunc(action.sort));
            }
            return action.apps.filter(app => app.appType === APP_TYPE_DASHBOARD);
        }
        default:
            return state;
    }
}