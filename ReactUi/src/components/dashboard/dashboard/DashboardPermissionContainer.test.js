import React from 'react';
import { shallow } from 'enzyme';
import { DashboardPermissionContainer } from './DashboardPermissionContainer';

describe('DashboardPermissionContainer tests', () => {
    test('should load the permissions tables', () => {
        const users = [
                {firstName: "Euan", lastName: "Finlayson", username: "ef24597"},
                {firstName: "Jubayer", lastName: "Miah", username: "jm94958"}];

        const members = [
            {"id":"ef24597","type":"USER","role":"Admin", name : "Finlayson, Euan"},
            {"id":"jm94958","type":"USER","role":"Admin", name : "Miah, Jubayer"},
            {"id":"EQ US Exotics Trading","type":"GROUP","role":"ReadOnly", name: "EQ US Exotics Trading"}
        ];

        const app ={ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' };
        const apps = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const groups = ["EQ US Exotics Trading"];
        const actions = {loadMembers: (key)=> {}};
        const props = { options: {}, app: app, apps: apps, users: users, groups: groups, members: members, actions: actions};

        const expectedUsers = [{"id":"ef24597","type":"USER","role":"Admin", name : "Finlayson, Euan"}, {"id":"jm94958","type":"USER","role":"Admin", name : "Miah, Jubayer"}];
        const expectedGroups = [{"id":"EQ US Exotics Trading","type":"GROUP","role":"ReadOnly", name: "EQ US Exotics Trading"}];

        const wrapper = shallow(<DashboardPermissionContainer {...props} />);

        expect(wrapper.find('AppPermissions').prop('userMembers')).toEqual(expectedUsers);
        expect(wrapper.find('AppPermissions').prop('groupMembers')).toEqual(expectedGroups);
    });
});