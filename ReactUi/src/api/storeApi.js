import fetch from "./ddFetch";
import {getAppsUri, getQdStoreUri} from '../configuration/config';
import { handleErrors } from './../functions/utils';

class storeApi{
    static createCollection(collectionMeta){
        const url = getQdStoreUri() + '/collections';
        return fetch(url, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(collectionMeta),
            credentials: 'include'
        })
        .then(handleErrors)
        .then(function (response) {
            return response.json();
        }).catch(error => {
            throw error;
        });
    }

    static fetchCollections(){
        const url = getQdStoreUri() + '/collections';
        return fetch(url, {
            credentials: 'include'
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static fetchCollectionMembers(collection){
        const url = getQdStoreUri()  + '/collections/' + collection + '/members';
        return fetch(url, {
            credentials: 'include'
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static fetchCollectionContents(collection, label, path){
        let url = getQdStoreUri() + '/data/' + collection + '/' + label + '/';
        if (path)
            url = url + path;
        return fetch(url, {
            credentials: 'include'
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            }).catch(error => {
                throw error;
            });
    }

    static deleteCollectionFile(collection, label, path){
        let url = getQdStoreUri() + '/data/' + collection + '/' + label + '/';
        if (path)
            url = url + path;
        return fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(handleErrors)
        .catch(error => {
            throw error;
        });
    }

    static saveFile(key, path, json, stringify = true){
        const url = getQdStoreUri() + '/data/' + key + '/DEV/' + path;
        let payload = stringify ? JSON.stringify(json) : json;
        return fetch(url, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : payload,
            credentials: 'include'
        })
            .then(handleErrors)
            .catch(error => {
                throw error;
            });
    }

    static addCollectionMember(collection, member){
        const url = getQdStoreUri()  + '/collections/' + collection + '/members';
        return fetch(url,{
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(member),
            credentials : 'include'
        })
            .then(handleErrors)
            .then(function(response){
                return response;
            }).catch(error=>{
                throw error;
            });
    }

    static deleteCollectionMember(collection, member){
        const url = getQdStoreUri()  + '/collections/' + collection + '/members';
        return fetch(url,{
            method: 'DELETE',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(member),
            credentials : 'include'
        })
            .then(handleErrors)
            .then(function(response){
                return response;
            }).catch(error=>{
                throw error;
            });
    }

    static updateCollectionMember(collection, member){
        const url = getQdStoreUri()  + '/collections/' + collection + '/members';
        return fetch(url,{
            method: 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(member),
            credentials : 'include'
        })
            .then(handleErrors)
            .then(function(response){
                return response;
            }).catch(error=>{
                throw error;
            });
    }
}

export default storeApi;