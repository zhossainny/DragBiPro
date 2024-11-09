import fetch from "./ddFetch";
import { getFavouritesUri } from '../configuration/config';
import { handleErrors } from './../functions/utils';

class favouritesApi {
    static fetchFavourites(userId) {
        const uri = `${getFavouritesUri()}/${userId}/favourites`;
        return fetch(uri, {}).then(handleErrors).then(response => response.json());
    }

    static unfavouriteApp(userId, appKey) {
        const uri = `${getFavouritesUri()}/${userId}/favourites/${appKey}`;
        return fetch(uri, {
            method: 'DELETE'
        }).then(handleErrors).then(response => response.json());
    }

    static favouriteApp(userId, appKey) {
        const uri = `${getFavouritesUri()}/${userId}/favourites/${appKey}`;
        return fetch(uri, {
            method: 'POST'
        }).then(handleErrors).then(response => response.json());
    }
}

export default favouritesApi;
