import * as types from './actionTypes';

export function loadFavourites(userId) {
    return { type: types.LOAD_FAVOURITES_REQUEST, userId };
}

export function unfavouriteApp(userId, appKey) {
    return { type: types.UNFAVOURITE_APP_REQUEST, userId, appKey};
}

export function favouriteApp(userId, appKey) {
    return { type: types.FAVOURITE_APP_REQUEST, userId, appKey};
}