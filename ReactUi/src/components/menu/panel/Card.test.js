import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Card } from './Card';
import { faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons/index';
import { faStar as faStarAlt } from '@fortawesome/free-regular-svg-icons/index';


describe('Card tests', () => {
    test('should generate correct app name and update by', () => {
        const props = { app: { key: 'app1', name:'App 1', tags: { updatedBy: 'Kamen Staykov (ks29437)' } }, userId: 'ks29437', isAdminOn: sinon.spy(), hasFavourited: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);

        expect(wrapper.find('Card__Name').dive().text()).toBe('App 1');
        expect(wrapper.find('Card__Author').find('Card__Span').dive().text()).toBe('Kamen Staykov');

    });

    test('should generate correct app url for shared dashboard', () => {
        const props = { app: { key: 'app1', tags: { updatedBy: 'Kamen Staykov (ks29437)' } }, userId: 'ks29437', isAdminOn: sinon.spy(), hasFavourited: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);

        expect(wrapper.find('Card__AppLink').props().to).toBe('/dashboard/app1');
    });

    test('should generate correct app url for non shared dashboard', () => {
        const props = { app: { key: 'app1', tags: { updatedBy: 'Kamen Staykov (ks29437)', shared: 'false' } }, userId: 'ks29437', isAdminOn: sinon.spy(), hasFavourited: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);

        expect(wrapper.find('Card__AppLink').props().to).toBe('/dashboard/ks29437/app1');
    });

    test('should have enabled delete icon when user is admin', () => {
        const isAdminOnSpy = sinon.fake.returns(true);
        const props = { app: { key: 'app1', tags: { updatedBy: 'Kamen Staykov (ks29437)' } }, userId: 'ks29437', isAdminOn: isAdminOnSpy, hasFavourited: sinon.spy(), onDelete: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);


        expect(wrapper.find('DashboardIcon').props().className).toBe('');
        expect(wrapper.find('DashboardIcon').props().icon).toBe(faTrashAlt);
        expect(wrapper.find('DashboardIcon').props().value).toBe('app1');
    });

    test('should have disabled delete icon when user is not admin', () => {
        const isAdminOnSpy = sinon.fake.returns(false);
        const props = { app: { key: 'app1', tags: { updatedBy: 'Kamen Staykov (ks29437)' } }, userId: 'ks29437', isAdminOn: isAdminOnSpy, hasFavourited: sinon.spy(), onDelete: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);


        expect(wrapper.find('DashboardIcon').props().className).toBe('disabled');
    });

    test('should have full star when card already favourited', () => {
        const hasFavouritedSpy = sinon.fake.returns(true);
        const props = { app: { key: 'app1', tags: { updatedBy: 'Kamen Staykov (ks29437)' } }, userId: 'ks29437', isAdminOn: sinon.spy(), hasFavourited: hasFavouritedSpy, onFavourite: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);

        expect(wrapper.find('DashboardIcon').props().icon).toBe(faStar);
    });

    test('should have holow star when card not favourited', () => {
        const hasFavouritedSpy = sinon.fake.returns(false);
        const props = { app: { key: 'app1', tags: { updatedBy: 'Kamen Staykov (ks29437)' } }, userId: 'ks29437', isAdminOn: sinon.spy(), hasFavourited: hasFavouritedSpy, onFavourite: sinon.spy() };
        const wrapper = shallow(<Card {...props} />);

        expect(wrapper.find('DashboardIcon').props().icon).toBe(faStarAlt);
    });
});