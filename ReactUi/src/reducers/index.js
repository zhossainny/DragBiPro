import {combineReducers} from 'redux';
import apps from './appsReducer';
import appsByRole from './appsByRoleReducer';
import versions from './versionsReducer';
import members from './membersReducer';
import users from './usersReducer';
import groups from './groupsReducer';
import notification from './notificationReducer';
import ajax from './ajaxStatusReducer';
import admin from './adminReducer';
import dashboard from './dashboardReducer';
import store from './storeReducer';
import appNavBar from './appNavBarReducer';
import filteredApps from './filteredAppsReducer';
import favourites from './favouritesReducer';

const rootReducer = combineReducers({
    apps,
    filteredApps,
    favourites,
    appsByRole,
    members,
    users,
    groups,
    admin,
    versions,
    notification,
    ajax,
    dashboard,
    store,
    appNavBar
});

export default rootReducer;