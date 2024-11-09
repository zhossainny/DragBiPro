import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function FavouritesReducer(state = initialState.favourites, action) {
    switch (action.type) {
        case types.LOAD_FAVOURITES_SUCCESS:
            return action.favourites;
        default:
            return state;
    }
}