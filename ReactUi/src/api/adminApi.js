import fetch from "./ddFetch";

import {getBaseUrl} from '../configuration/config';
import { handleErrors } from './../functions/utils';

class adminApi {
    static createGroup(name, alias) {
        const url = getBaseUrl() + '/groups/' + alias;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: name,
            credentials: 'include'
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static fetchUserApps(userId, isGroup) {
        let userType = isGroup ? 'groups' : 'users';
        const url = getBaseUrl() + '/' + userType + '/' + userId + '/apps';
        return fetch(url, {
            credentials: 'include'
        }).then(function (response) {
            return response.json();
        }).catch(error => {
            throw error;
        });
    }
}

export default adminApi;