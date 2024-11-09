import fetch from "./ddFetch";

import {getAppsUri, getContentsUri} from '../configuration/config';
import { handleErrors } from './../functions/utils';

class appsApi {
    static createApp(appMeta) {
        const url = getAppsUri();
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appMeta)
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }

    static fetchApps() {
        return fetch(getAppsUri(), {
            
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static deleteApp(appKey) {
        const url = `${getAppsUri()}/${appKey}`;
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            
        })
            .then(handleErrors)
            .then(response => response)
            .catch(error => { throw error; });
    }

    static fetchAppContent(appKey, version) {
        //let hostname = "http://"+window.location.hostname;
        //let port=9002;
        let conApi = getContentsUri();
        return fetch(conApi+"/"+appKey, {
            
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static fetchAppsByRole(role) {
        // return fetch(getAppsUri() + "/roles/" + role, {
        //
        // })
        //     .then(handleErrors)
        //     .then(function (response) {
        //         return response.json();
        //     }).catch(error => {
        //         throw error;
        //     });
    }

    static fetchAppMembers(appKey) {
        // const url = getAppsUri() + "/" + appKey + '/members';
        // return fetch(url, {
        //
        // })
        //     .then(handleErrors)
        //     .then(function (response) {
        //         return response.json();
        //     }).catch(error => {
        //         throw error;
        //     });
    }

    static addAppMember(appKey, member) {
        const url = getAppsUri() + "/" + appKey + '/members';
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(member),
            
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }

    static deleteAppMember(appKey, member) {
        const url = getAppsUri() + "/" + appKey + '/members';
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(member),
            
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }

    static updateAppMember(appKey, member) {
        const url = getAppsUri() + "/" + appKey + '/members';
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(member),
            
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }

    static saveAppMeta(appMeta) {
        const url = getAppsUri() + "/";
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appMeta),
            
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }

    static fetchVersions(appKey) {
        const url = getAppsUri() + "/" + appKey;
        return fetch(url, {
            mode: 'no-cors',
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static uploadVersion(version, file, includeFileName = false) {
        //const url = getAppsUri() + "/" + version.appKey;
        let hostname = "http://"+window.location.hostname;
        let port=9002;
        const url = getContentsUri();

        // let formData = new FormData();
        // if (includeFileName) {
        //     formData.append("file", file, version.fileName);
        // } else {
        //     formData.append("file", file);
        // }
        // formData.append("data", new Blob([JSON.stringify(version)], { type: "application/json" }));

        return fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: file,
            //parseReqBody: false
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }

    static labelVersion(appKey, label, tag) {
        const url = getAppsUri() + "/" + appKey + '/labels/' + label;
        let body = { label: label, tag: tag };

        return fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            
            method: "PUT",
            body: JSON.stringify(body)
        })
            .then(handleErrors)
            .then(function (response) {
                return response;
            }).catch(error => {
                throw error;
            });
    }
}

export default appsApi;