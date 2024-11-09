import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function DashboardReducer(state = initialState.dashboard, action) {
    switch (action.type) {
        case types.EDIT_WIDGET: {
            let widgetCopy = getWidgetCopy(action.uid);
            widgetCopy.editing = action.editing;
            let allWidgets = Object.assign({}, state.widgets);
            allWidgets[action.uid] = widgetCopy;
            return { ...state, widgets: allWidgets };
        }
        case types.WIDGET_REGISTER_URL: {
            let widgetCopy = getWidgetCopy(action.uid);
            widgetCopy.url = action.url;
            let allWidgets = Object.assign({}, state.widgets);
            allWidgets[action.uid] = widgetCopy;
            return { ...state, widgets: allWidgets };
        }
        case types.WIDGET_REGISTER: {
            let widgetCopy = getWidgetCopy(action.uid);
            widgetCopy.title = action.title;
            widgetCopy.uid = action.uid;
            let allWidgets = Object.assign({}, state.widgets);
            allWidgets[action.uid] = widgetCopy;
            return { ...state, widgets: allWidgets };
        }
        case types.WIDGET_DEREGISTER: {
            let allWidgets = Object.assign({}, state.widgets);
            delete allWidgets[action.uid];
            return { ...state, widgets: allWidgets };
        }
        case types.USER_PREFERENCES_LOADED: {
            return { ...state, preferences: action.preferences };
        }
        case types.WIDGET_SET_MASTER_WIDGET: {
            let widgetCopy = getWidgetCopy(action.uid);
            widgetCopy.masterWidget = action.masterWidget;
            let allWidgets = Object.assign({}, state.widgets);
            if (action.masterWidget) {
                let masterWidgetCopy = getWidgetCopy(action.masterWidget);
                masterWidgetCopy.publishing = true;
                allWidgets[action.masterWidget] = masterWidgetCopy;
            }
            allWidgets[action.uid] = widgetCopy;
            return { ...state, widgets: allWidgets };
        }
        case types.WIDGET_DATA_FILTER_CHANGED: {
            let widgetCopy = getWidgetCopy(action.uid);
            widgetCopy.publishedFilterValue = action.filterValue;
            let allWidgets = Object.assign({}, state.widgets);
            allWidgets[action.uid] = widgetCopy;
            return { ...state, widgets: allWidgets };
        }
        case types.LOCAL_DATA_LOADED: {
            let widgetCopy = getWidgetCopy(action.uid);
            widgetCopy.containsLocalData = action.loaded;
            let allWidgets = Object.assign({}, state.widgets);
            allWidgets[action.uid] = widgetCopy;
            return { ...state, widgets: allWidgets };
        }
        case types.DASHBOARD_DATA_LOADED: {
            let cacheCopy = Object.assign({}, state.dataCache);
            cacheCopy[action.snapshot.getUrl()] = { status: 'CURRENT', snapshot: action.snapshot };
            let refreshingUrls = state.refreshingUrls.filter(url => url !== action.snapshot.getUrl());
            return { ...state, dataCache: cacheCopy, refreshingUrls: refreshingUrls, configurationChanged: false };
        }
        case types.DASHBOARD_DATA_LOAD_IN_PROGRESS: {
            let cacheCopy = state.dataCache ? { ...state.dataCache } : {};
            if (cacheCopy[action.url]) {
                cacheCopy[action.url].status = 'IN_PROGRESS';
            } else {
                cacheCopy[action.url] = { status: 'IN_PROGRESS' };
            }

            return { ...state, dataCache: cacheCopy };

        }
        case types.DASHBOARD_DATA_BEGIN_LOAD: {
            let refreshingUrls = state.refreshingUrls.concat(action.url);
            return { ...state, refreshingUrls: refreshingUrls };
        }
        case types.DASHBOARD_UPDATE_INTERVAL_SET: {
            return { ...state, refreshInterval: action.interval };
        }
        case types.DASHBOARD_SHOW_SETTINGS_PANE: {
            return { ...state, showSettings: action.show, autoExpandSettings: true };
        }
        case types.DASHBOARD_CONFIGURATION_CHANGED: {
            return { ...state, configurationChanged: action.changed };
        }
        case types.DASHBOARD_UPDATE_CONFIG_ITEMS: {
            return { ...state, configurationItems: action.items };
        }
        case types.DASHBOARD_NAME_CHANGED: {
            return { ...state, name: action.name };
        }
        case types.DASHBOARD_COLLAPSE_SETTINGS_PANE: {
            return { ...state, configPaneCollapsed: action.collapse };
        }
        case types.DASHBOARD_VERSIONS_LOADED: {
            return { ...state, dashboardVersions: action.versions };
        }
        case types.RESIZE_COMPONENTS: {
            if (state.resizeEvents) {
                return { ...state, resizeEvents: [...state.resizeEvents, { eventId: action.eventId, componentId: action.componentId }] };
            }
            return { ...state, resizeEvents: [{ eventId: action.eventId, componentId: action.componentId }] };
        }
        case types.RESIZE_EVENT_CONSUMED: {
            const existingEvents = [...state.resizeEvents];
            const consumedEventIndex = existingEvents.findIndex(event => event.eventId === action.eventId);
            if (consumedEventIndex !== -1) {
                existingEvents.splice(consumedEventIndex, 1);
            }
            return { ...state, resizeEvents: [...existingEvents] };
        }
        case types.RESET_DASHBOARD: {
            return {
                widgets: {},
                widgetControls: [],
                loadedDashboards: [],
                refreshInterval: 30,
                dataCache: {},
                refreshingUrls: [],
                showHeaders: null,
                saving: false,
                notification: {},
                redirect: null,
                loading: state.loading,
                preferences: state.preferences,
                maximize: false,
                hasLocalData: false,
                showSettings: false,
                autoExpandSettings: false,
                configPaneCollapsed: false,
                configurationItems: [],
                dashboardVersions: [],
                configurationChanged: false
            };
        }
        case types.REGISTER_WIDGET_CONTROLS: {
            let filtered = state.widgetControls.filter(control => control.id !== action.uid);
            filtered.push({
                id: action.uid,
                controls: action.controls
            });
            return { ...state, widgetControls: filtered };
        }
        case types.TOGGLE_WIDGET_HEADERS: {
            return { ...state, showHeaders: action.show };
        }
        case types.DASHBOARD_LOADED: {
            if (action.dashboard) {
                let loadedDashboards = state.loadedDashboards.filter(dashboard => dashboard.key !== action.dashboard.key);
                loadedDashboards.push(action.dashboard);
                return { ...state, loadedDashboards: loadedDashboards, loading: false, refreshInterval: action.dashboard.refreshInterval ? action.dashboard.refreshInterval : state.refreshInterval };
            } else {
                return { ...state, loading: false };
            }
        }
        case types.DASHBOARD_LOADING: {
            return { ...state, loading: true };
        }
        case types.DASHBOARD_SAVING: {
            return { ...state, saving: true };
        }
        case types.DASHBOARD_SAVED: {
            return { ...state, saving: false };
        }
        case types.SHOW_DASHBOARD_NOTIFICATION: {
            return { ...state, notification: action.notification };
        }
        case types.CLEAR_DASHBOARD_NOTIFICATION: {
            return { ...state, notification: {} };
        }
        case types.DASHBOARD_REDIRECT: {
            return { ...state, redirect: action.redirect };
        }
        case types.DASHBOARD_REDIRECT_COMPLETED: {
            return { ...state, redirect: null };
        }
        case types.MAXIMIZE_DASHBOARD: {
            return { ...state, maximize: true };
        }
        default:
            return state;
    }

    function getWidgetCopy(uid) {
        let widgetCopy = state.widgets[uid];
        if ((!widgetCopy))
            widgetCopy = {};
        else {
            widgetCopy = Object.assign({}, widgetCopy);
        }
        return widgetCopy;
    }
}
