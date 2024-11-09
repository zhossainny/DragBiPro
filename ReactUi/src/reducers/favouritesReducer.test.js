import * as types from '../actions/actionTypes';
import FavouritesReducer from './favouritesReducer';

describe('FavouritesReducer tests', () => {
    let initialFavourites = [
        { key: 'app1' },
        { key: 'app2' },
        { key: 'app3' },
        { key: 'app4' }
    ];

    test('should ', () => {
        expect(FavouritesReducer([], { type: types.LOAD_FAVOURITES_SUCCESS, favourites: initialFavourites }))
            .toEqual([
                { key: 'app1' },
                { key: 'app2' },
                { key: 'app3' },
                { key: 'app4' }
            ]);

    });

});