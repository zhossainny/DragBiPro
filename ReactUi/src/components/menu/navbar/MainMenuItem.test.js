import React from 'react';
import { NavLink } from 'react-router-dom';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { faUser } from '@fortawesome/free-solid-svg-icons/index';
import MainMenuItem from './MainMenuItem';


describe('MainMenuItem tests', () => {
    test('should display active item correctly', () => {
        const props = { active: true, value: 'dashboards', icon: faUser, label: 'All Dashboards'};
        const wrapper = shallow(<MainMenuItem {...props}/>);

        expect(wrapper.find(NavLink).props().to).toBe('/dashboards');
        expect(wrapper.find(NavLink).childAt(1).text()).toBe('All Dashboards');
        expect(wrapper.find('MainMenuItem__Icon').props().icon).toBe(props.icon);
    });

    test('should call onClick handler', () => {
        const onClickSpy = sinon.spy();
        const props = { active: true, value: 'dashboards', icon: faUser, label: 'All Dashboards', onClick: onClickSpy};
        const wrapper = shallow(<MainMenuItem {...props}/>);

        wrapper.find(NavLink).simulate('click');
        expect(onClickSpy.calledWith('dashboards')).toBe(true);
    });
});