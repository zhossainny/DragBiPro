
export const ag_grid_licence = "SHI_International_Corp_-_UK_on_behalf_of_CITI_Equities_DeskDev_Platform_1Devs20_July_2019__MTU2MzU3NzIwMDAwMA==c6726a68842a2d406d17f8348110b3f8";

let environment = "";

function resolveCurrentUrl() {
    if (getEnvironment() === 'local') {
        if(window.location.protocol === "https:"){
            return { hostname: 'localhost', scheme: 'https:', port: 9102 };
        }

        return { hostname: 'localhost', scheme: 'http:', port: 9002 };
    }

    return {
        hostname: window.location.hostname,
        scheme: window.location.protocol,
        port: window.location.protocol === "https:" ? 9102 : 9002
    };
}

export function getUiUrl(){
    let hostname = window.location.hostname;
    let scheme = window.location.protocol;
    let port = window.location.port;

    return scheme + "//" + hostname + (port !== "" ? ":" + port : "");
}

export function getBaseUrl() {
    const { hostname, scheme, port } = resolveCurrentUrl();

    let server = scheme + "//" + hostname + ":" + port;

    return server + '/api/v1';
}
export function getContentsUri(){
    return getBaseUrl()+"/appContent"
}
export function getAppsUri() {
    return getBaseUrl() + "/apps";
}

export function getFavouritesUri() {
    const { hostname, scheme } = resolveCurrentUrl();
    let port = scheme === "https:" ? 9104 : 9004;

    let server = scheme + "//" + hostname + ":" + port;

    return server + "/api/v1/user";
}

export function getQdStoreUri() {
    const { hostname, scheme } = resolveCurrentUrl();
    let port = scheme === "https:" ? 9100 : 9000;

    let server = scheme + "//" + hostname + ":" + port;

    return server + "/api/v1";
}

export function packageUriFromLabel(app, label) {
    let prefix = app.appType === "EXCEL" ? "sheet" : "app";

    let appsUrl = getAppsUrl();

    return appsUrl + "/" + prefix + "/" + app.key + (label.toLowerCase() === "prod" ? "" : "/" + label + "/");
}

export function packageUriFromVersion(appKey, appType, version) {
    let prefix = appType === "EXCEL" ? "sheet" : "app";

    let appsUrl = getAppsUrl();

    return appsUrl + "/" + prefix + "/" + appKey + "/version/" + version + "/";
}

export function packageStoreUri(collection, label, file) {
    let storeUri = getQdStoreUri();

    return storeUri + "/data/" + collection + "/" + label + "/" + file;
}

export function getAuthCookieName() {
    switch (getEnvironment().toLowerCase()) {
        case "prod":
            return "dd-token-prod";
        default:
            return "dd-token-ua";
    }
}

export function internalDomains() {
    return [
        'localhost'
    ];
}

export function getAppsUrl() {
    const { hostname, scheme, port } = resolveCurrentUrl();
    return scheme + "//" + hostname + (port !== "" ? ":" + port : "");
}



export function getEnvironment() {
    if (document.getElementById('env') === null) {
        return "local";
    }

    if (environment === "") {
        environment = document.getElementById('env').getAttribute("data-dd-value");
        return environment;
    }
    else {
        return "prod";
    }
}


