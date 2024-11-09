import { recordSaga } from '../../test/sagaHelpers';
import { fetchCollectionMembers} from './storeSaga';
import * as types from '../actions/actionTypes';
import fetchMock from 'fetch-mock';
import * as _ from 'lodash';


describe('StoreSaga tests', () => {

    beforeEach(() => {
            window.location = "http://localhost:3500/";
            fetchMock.restore();
    });

    test('should return the collection members with a display name', async ()=>{
        let members = [
            {"id":"ef24597","type":"USER","role":"Admin"},
            {"id":"jm94958","type":"USER","role":"Admin"},
            {"id":"EQ US Exotics Trading","type":"GROUP","role":"ReadOnly"}
        ];

        const state = { users: [
                {firstName: "Euan", lastName: "Finlayson", username: "ef24597", name: "Finlayson, Euan"},
                {firstName: "Jubayer", lastName: "Miah", username: "jm94958", name: "Miah, Jubayer"}]};

        const expected = [
            {"id":"ef24597","type":"USER","role":"Admin", name : "Finlayson, Euan"},
            {"id":"jm94958","type":"USER","role":"Admin", name : "Miah, Jubayer"},
            {"id":"EQ US Exotics Trading","type":"GROUP","role":"ReadOnly", name: "EQ US Exotics Trading"}
        ];

        fetchMock.mock((url, options) => _.endsWith(url, "/api/v1/collections/coll-1/members"), Promise.resolve(JSON.stringify(members)));

        const initialAction = { type: types.LOAD_COLLECTION_MEMBERS_REQUEST, collection: 'coll-1' };
        const dispatched = await recordSaga(fetchCollectionMembers, initialAction, state);

        expect(dispatched).toContainEqual({ type: 'BEGIN_AJAX_CALL' });
        expect(dispatched).toContainEqual({type: types.LOAD_COLLECTION_MEMBERS_SUCCESS, members: expected});
    });
});
