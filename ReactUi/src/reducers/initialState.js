export default {
    apps: [],
    filteredApps: [],
    favourites: [],
    appsByRole: {},
    appNavBar: {
        showMenu: true
    },
    versions: [],
    members : [],
    users : [],
    groups :[],
    notification : {},
    store: {
        members: [],
        collections: [],
        contents: [],
        error: null
    },
    admin :{
        userId: null,
        permissionedApps: [],
        membersByAppKey: {},
        notification : {},
        appsLoading: false,
        permissionsSaving: false,
        groupsSaving: false,
        requestsInProgress: 0
    },
    dashboard: {
        name: null,
        widgets: {},
        preferences: {},
        refreshInterval: 30,
        widgetControls: [],
        loadedDashboards: [],
        dataCache: {},
        refreshingUrls: [],
        showHeaders: null,
        saving: false,
        loading: false,
        notification: {},
        redirect: null,
        resizeEvents: [],
        maximize: false,
        hasLocalData: false,
        showSettings: false,
        autoExpandSettings: false,
        configPaneCollapsed: false,
        configurationItems: [],
        dashboardVersions: [],
        configurationChanged: false
    },
    ajax: {
        ajaxCallsInProgress: 0,
        error:""
    }
};