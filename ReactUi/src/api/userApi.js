import fetch from "./ddFetch";

import {getBaseUrl} from '../configuration/config';

class userApi{
    static fetchUsers(){
        // const url = getBaseUrl() + '/users';
        // return fetch(url, {
        //     credentials: 'include'
        // }).then(function (response) {
        //     return response.json();
        // }).catch(error => {
        //     throw error;
        // });
    }

    static fetchGroups(){
        // const url = getBaseUrl() + '/groups';
        // return fetch(url, {
        //     credentials: 'include'
        // }).then(function (response) {
        //     return response.json();
        // }).catch(error => {
        //     throw error;
        // });
    }

    static fetchUserId(){
        // const url = getBaseUrl() + '/users/username';
        // return fetch(url, {
        //     credentials: 'include'
        // }).then(function (response) {
        //     return response.json();
        // }).catch(error => {
        //     throw error;
        // });
    }
}


export default userApi;