import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Dashboardlist } from './DashboardList';

describe('DashboardList tests', () => {
    test('should render dashboards', () => {
        const dashboards = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const props = { dashboards, isAdminOn: () => {}, favourites: [], userId: 'ks2333', caption: 'Personal' };
        const isAdminSpy = sinon.stub(props, 'isAdminOn');
        isAdminSpy.returns(false);

        const wrapper = shallow(<Dashboardlist {...props} />);
        wrapper.find('DashboardList__HeaderSmall').simulate('click');

        expect(wrapper.find('DashboardList__AppLink').at(0).prop('to')).toBe('/dashboard/dash-1');
        expect(wrapper.find('DashboardList__AppLink').at(1).prop('to')).toBe('/dashboard/dash-2');
    });

    test('should disable delete where user not admin', () => {
        const dashboards = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const props = { dashboards, isAdminOn: () => {}, favourites: [], userId: 'ks2333', caption: 'Personal' };
        const isAdminSpy = sinon.stub(props, 'isAdminOn');
        isAdminSpy.withArgs('dash-1').returns(false);
        isAdminSpy.withArgs('dash-2').returns(true);

        const wrapper = shallow(<Dashboardlist {...props} />);
        wrapper.find('DashboardList__HeaderSmall').simulate('click');

        expect(wrapper.find('DashboardList__ListItem').at(0).find('DashboardIcon').at(0).prop('className')).toBe('disabled');
        expect(wrapper.find('DashboardList__ListItem').at(1).find('DashboardIcon').at(0).prop('className')).toBe('');
    });
});