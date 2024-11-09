import * as types from './actionTypes';

export function saveNewDashboard(dashboardMeta, versionMeta, payload, redirect) {
    return { type: types.SAVE_NEW_DASHBOARD, dashboardMeta, versionMeta, payload, redirect };
}

export function updateDashboard(dashboardMeta, versionMeta, payload) {
    return { type: types.UPDATE_DASHBOARD, dashboardMeta, versionMeta, payload };
}

export function loadDashboard(dashboardKey, version) {
    return { type: types.LOAD_DASHBOARD, dashboardKey, version };
}

export function clearDashboardNotification() {
    return { type: types.CLEAR_DASHBOARD_NOTIFICATION };
}

export function redirectCompleted() {
    return { type: types.DASHBOARD_REDIRECT_COMPLETED };
}

export function maximizeDashboard() {
    return { type: types.MAXIMIZE_DASHBOARD };
}

export function resizeWidgetComponents(eventId, componentId) {
    return { type: types.RESIZE_COMPONENTS, eventId, componentId };
}

export function markResizeEventAsConsumed(eventId) {
    return { type: types.RESIZE_EVENT_CONSUMED, eventId };
}

export function toggleHeaders(show) {
    return { type: types.TOGGLE_WIDGET_HEADERS, show };
}

export function resetDashboard() {
    return { type: types.RESET_DASHBOARD };
}

export function setUpdateInterval(interval) {
    return { type: types.DASHBOARD_UPDATE_INTERVAL_SET, interval };
}

export function updateDashboardData() {
    return { type: types.DASHBOARD_DATA_UPDATE };
}

export function dashboardNameChanged(name) {
    return { type: types.DASHBOARD_NAME_CHANGED, name };
}

export function showDashboardSettingsPane(show) {
    return { type: types.DASHBOARD_SHOW_SETTINGS_PANE, show };
}

export function collapseDashboardSettingsPane(collapse) {
    return { type: types.DASHBOARD_COLLAPSE_SETTINGS_PANE, collapse };
}

export function updateDashboardConfigItems(items) {
    return { type: types.DASHBOARD_UPDATE_CONFIG_ITEMS, items };
}

export function dashboardConfigurationChanged(changed) {
    return { type: types.DASHBOARD_CONFIGURATION_CHANGED, changed };
}

export function showDashboardNotification(notification) {
    return { type: types.SHOW_DASHBOARD_NOTIFICATION, notification };
}

export function saveUserPreferences(collectionMeta, preferences) {
    return { type: types.SAVE_USER_PREFERENCES, collectionMeta, preferences };
}

export function loadUserPreferences(userId) {
    return { type: types.USER_PREFERENCES_REQUEST, userId };
}


