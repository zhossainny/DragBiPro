import React from 'react';
import { shallow } from 'enzyme';
import { CollectionPermissionsContainer } from './CollectionPermissionsContainer';

describe('CollectionPermissionsContainer tests', () => {
    test('should load the permissions tables', () => {
        const users = [
            {firstName: "Euan", lastName: "Finlayson", username: "ef24597"},
            {firstName: "Jubayer", lastName: "Miah", username: "jm94958"}];

        const members = [
            {"id":"ef24597","type":"USER","role":"Admin", name : "Finlayson, Euan"},
            {"id":"jm94958","type":"USER","role":"Admin", name : "Miah, Jubayer"},
            {"id":"EQ US Exotics Trading","type":"GROUP","role":"ReadOnly", name: "EQ US Exotics Trading"}
        ];

        const collection = 'coll-1';
        const groups = ["EQ US Exotics Trading"];
        const actions = {loadCollectionMembers: (key)=> {}};
        const props = { options: {}, collection: collection, users: users, groups: groups, members: members, actions: actions};

        const expectedUsers = [{"id":"ef24597","type":"USER","role":"Admin", name : "Finlayson, Euan"}, {"id":"jm94958","type":"USER","role":"Admin", name : "Miah, Jubayer"}];
        const expectedGroups = [{"id":"EQ US Exotics Trading","type":"GROUP","role":"ReadOnly", name: "EQ US Exotics Trading"}];

        const wrapper = shallow(<CollectionPermissionsContainer {...props} />);

        expect(wrapper.find('CollectionPermissions').prop('userMembers')).toEqual(expectedUsers);
        expect(wrapper.find('CollectionPermissions').prop('groupMembers')).toEqual(expectedGroups);
    });
});