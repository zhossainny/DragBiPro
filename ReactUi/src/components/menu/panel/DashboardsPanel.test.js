import React from 'react';
import { shallow } from 'enzyme';
import { DashboardsPanel } from './DashboardsPanel';
import CategoriesMenu from './CategoriesMenu';
import Header from './Header';
import Card from './Card';
import sinon from 'sinon';
import AppDeleteModal from './../../dashboard/dashboard/AppDeleteModal';
import * as _ from 'lodash';

describe('DashboarsPanel tests', () => {
    test('should display CategoriesMenu', () => {
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [] };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        expect(wrapper.find(CategoriesMenu).props().category).toBe('nam');
    });

    test('should have correct Header props', () => {
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [] };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        expect(wrapper.find(Header).props().onSearchTextChanged).toBeDefined();
    });

    test('should display cards for each app', () => {
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [{ key: 'app1', appType: 'DASHBOARD', name: 'App 1' }, { key: 'app2', appType: 'DASHBOARD', name: 'App 2' }] };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        expect(wrapper.find(Card).length).toBe(2);
        expect(wrapper.find(Card).at(0).prop('app')).toEqual(props.filteredApps[0]);
        expect(wrapper.find(Card).at(1).prop('app')).toEqual(props.filteredApps[1]);
    });

    test('should be able to set app to delete', () => {
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [{ key: 'app1', appType: 'DASHBOARD', name: 'App 1' }, { key: 'app2', appType: 'DASHBOARD', name: 'App 2' }] };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        wrapper.find(Card).at(1).prop('onDelete')(props.filteredApps[1]);
        expect(wrapper.state().appToDelete).toEqual(props.filteredApps[1]);
    });

    test('should call actions to delete app', () => {
        const deleteAppSpy = sinon.spy();
        const showDashboardNotificationSpy = sinon.spy();
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [{ key: 'app1', appType: 'DASHBOARD', name: 'App 1' }, { key: 'app2', name: 'App 2', appType: 'DASHBOARD' }], actions: { deleteApp: deleteAppSpy, showDashboardNotification: showDashboardNotificationSpy } };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        wrapper.find(Card).at(1).prop('onDelete')(props.filteredApps[1]);
        wrapper.find(AppDeleteModal).props().onOk();

        expect(deleteAppSpy.calledWith('app2')).toBe(true);
        expect(showDashboardNotificationSpy.calledWith({ type: 'info', message: `App App 2 deleted` })).toBe(true);
    });

    test('should trigger sort action', () => {
        const sortSpy = sinon.spy();
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [], actions: { sort: sortSpy } };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        wrapper.find(Header).props().onSortChanged('za');
        expect(wrapper.state().sort).toBe('za');
        expect(sortSpy.calledWith('za')).toBe(true);
    });

    test('should trigger actions when category changes', () => {
        const sortSpy = sinon.spy();
        const filterAndSortSpy = sinon.spy();
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [], actions: { sort: sortSpy, filterAndSort: filterAndSortSpy } };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        const propsUpdate = _.cloneDeep(props);
        propsUpdate.match.url = '/categories/emea';
        propsUpdate.match.params.category = 'emea';
        wrapper.setProps(propsUpdate);

        expect(filterAndSortSpy.calledWith(props.apps, 'emea', '', 'az')).toBe(true);
        expect(wrapper.state().category).toBe('emea');
        expect(sortSpy.called).toBe(false);
    });

    test('should trigger actions when apps change', () => {
        const sortSpy = sinon.spy();
        const filterAndSortSpy = sinon.spy();
        const props = { apps: [], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [], actions: { sort: sortSpy, filterAndSort: filterAndSortSpy } };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        const propsUpdate = _.cloneDeep(props);
        propsUpdate.apps = [{}];
        wrapper.setProps(propsUpdate);


        expect(filterAndSortSpy.calledWith(propsUpdate.apps, 'nam', '', 'az')).toBe(true);
        expect(sortSpy.called).toBe(false);
    });

    test('should resolve app categories', () => {
        const props = { apps: [{ region: '' }, { region: 'nam' }, { region: 'nam' }], match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [] };
        const wrapper = shallow(<DashboardsPanel {...props} />);


        expect(wrapper.find(CategoriesMenu).props().categories).toEqual([{ label: 'nam', value: 'nam', subcategories: [] }]);
    });

    test('should be able to favourite app', () => {
        const favouriteAppSpy = sinon.spy();
        const props = { apps: [], userId: 'kss', match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [{ key: 'app1', appType: 'DASHBOARD', name: 'App 1' }], actions: { favouriteApp: favouriteAppSpy } };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        wrapper.find(Card).props().onFavourite('app1');

        expect(favouriteAppSpy.calledWith('kss', 'app1')).toBe(true);
    });

    test('should be able to unfavourite app', () => {
        const unfavouriteAppSpy = sinon.spy();
        const props = { apps: [], userId: 'kss', match: { url: '/categories/nam', params: { category: 'nam' } }, filteredApps: [{ key: 'app1', appType: 'DASHBOARD', name: 'App 1' }], actions: { unfavouriteApp: unfavouriteAppSpy } };
        const wrapper = shallow(<DashboardsPanel {...props} />);

        wrapper.find(Card).props().onFavourite('app1', true);

        expect(unfavouriteAppSpy.calledWith('kss', 'app1')).toBe(true);
    });
});