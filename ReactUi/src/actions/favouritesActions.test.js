import * as actions from './favouritesActions';
import * as types from './actionTypes';


describe('Favourites actions test', () => {
    test('should create load favourites request', () => {
        const expectedAction = {
            type: types.LOAD_FAVOURITES_REQUEST,
            userId: 'ksss'
        };

        expect(actions.loadFavourites('ksss')).toEqual(expectedAction);
    });

    test('should create unfavourite app request', () => {
        const expectedAction = {
            type: types.UNFAVOURITE_APP_REQUEST,
            userId: 'ksss',
            appKey: 'app1'
        };

        expect(actions.unfavouriteApp('ksss', 'app1')).toEqual(expectedAction);
    });

    test('should create favourite app request', () => {
        const expectedAction = {
            type: types.FAVOURITE_APP_REQUEST,
            userId: 'ksss',
            appKey: 'app1'
        };

        expect(actions.favouriteApp('ksss', 'app1')).toEqual(expectedAction);
    });
});