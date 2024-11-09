import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { DashboardOverviewContainer } from './DashboardOverviewContainer';

describe('DashboardOverviewContainer tests', () => {
    test('should render dashboards', () => {
        const dashboards = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const props = { options: {}, apps: dashboards, userId: 'ks33' };
        const wrapper = shallow(<DashboardOverviewContainer {...props} />);

        expect(wrapper.find('Connect(UserHelper)[caption="Personal"]').prop('dashboards')).toEqual(dashboards);
    });

    test('should open modal for dashboard to be deleted', () => {
        const dashboards = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const props = { options: {}, apps: dashboards, userId: 'ks33' };
        const wrapper = shallow(<DashboardOverviewContainer {...props} />);

        wrapper.find('Connect(UserHelper)[caption="Personal"]').prop('onDeleteDashboard')(dashboards[0]);

        expect(wrapper.state('showDeleteConfirmation')).toBe(true);
        expect(wrapper.state('selectedDashboard')).toBe(dashboards[0]);
        expect(wrapper.find('AppDeleteModal').prop('show')).toBe(true);
    });

    test('should fire action for delete dashboard confirmation', () => {
        const dashboards = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const deleteDashboardSpy = sinon.spy();
        const showDashNotification = sinon.spy();
        const props = { options: {}, apps: dashboards, userId: 'ks33', actions: { deleteApp: deleteDashboardSpy, showDashboardNotification: showDashNotification } };
        const wrapper = shallow(<DashboardOverviewContainer {...props} />);

        wrapper.find('Connect(UserHelper)[caption="Personal"]').prop('onDeleteDashboard')(dashboards[0]);
        wrapper.find('AppDeleteModal').prop('onOk')();

        expect(wrapper.state('showDeleteConfirmation')).toBe(false);
        expect(wrapper.state('selectedDashboard')).toBe(null);
        expect(deleteDashboardSpy.calledWith('dash-1')).toBe(true);
        expect(showDashNotification.calledWith({ type: 'info', message: 'Dashboard dash 1 deleted' })).toBe(true);
    });

    test('should cancel delete dashboard', () => {
        const dashboards = [{ appType: 'DASHBOARD', name: 'dash 1', key: 'dash-1' }, { appType: 'DASHBOARD', name: 'dash 2', key: 'dash-2' }];
        const props = { options: {}, apps: dashboards, userId: 'ks33' };
        const wrapper = shallow(<DashboardOverviewContainer {...props} />);

        wrapper.find('AppDeleteModal').prop('onCancel')(dashboards[0]);

        expect(wrapper.state('showDeleteConfirmation')).toBe(false);
        expect(wrapper.state('selectedDashboard')).toBe(null);
    });
});
