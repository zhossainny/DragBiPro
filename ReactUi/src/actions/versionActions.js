import * as types from './actionTypes';

export function loadVersions(appKey){ 
    return {type: types.LOAD_VERSIONS_REQUEST, appKey};
}

export function clearVersions(){
    return {type: types.CLEAR_VERSIONS_REQUEST};
}