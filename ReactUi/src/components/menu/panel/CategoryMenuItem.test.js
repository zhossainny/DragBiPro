import React from 'react';
import { MemoryRouter } from 'react-router';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CategoryMenuItem from './CategoryMenuItem';

describe('CategoryMenuItem tests', () => {
    test('should render active menu item', () => {
        const props = { active: true, value: 'nam', name: 'NAM', subcategories: []};
        const wrapper = shallow(<CategoryMenuItem {...props}/>);

        expect(wrapper.state().expanded).toBe(true);
        expect(wrapper.find('NavLink').props().to).toBe('/categories/nam');
        expect(wrapper.find('NavLink').children().at(0).props().icon.iconName).toBe('angle-right');
        expect(wrapper.find('NavLink').children().at(1).text()).toBe('NAM');
    });

    test('should render active menu item with subcategories', () => {
        const props = { active: true, value: 'nam', name: 'NAM', subcategories: [{ name: 'sub-one'}]};
        const wrapper = shallow(<CategoryMenuItem {...props}/>);

        expect(wrapper.state().expanded).toBe(true);
        expect(wrapper.find('NavLink').props().to).toBe('/categories/nam');
        expect(wrapper.find('NavLink').children().at(0).props().icon.iconName).toBe('angle-down');
        expect(wrapper.find('NavLink').children().at(1).text()).toBe('NAM');
    });

    test('should render non active menu item', () => {
        const props = { active: false, value: 'nam', name: 'NAM', subcategories: []};
        const wrapper = shallow(<CategoryMenuItem {...props}/>);

        expect(wrapper.state().expanded).toBe(false);
        expect(wrapper.find('NavLink').props().to).toBe('/categories/nam');
        expect(wrapper.find('NavLink').children().at(0).props().icon.iconName).toBe('angle-right');
        expect(wrapper.find('NavLink').children().at(1).text()).toBe('NAM');
    });

    test('should be able to collapse expanded item', () => {
        const props = { active: true, value: 'nam', name: 'NAM', subcategories: []};
        const wrapper = shallow(<CategoryMenuItem {...props}/>);


        wrapper.find('NavLink').simulate('click', { preventDefault: sinon.spy(), stopPropagation: sinon.spy() });
        expect(wrapper.state().expanded).toBe(false);
    });

    test('should change state when item not active and expanded', () => {
        const props = { active: false, value: 'nam', name: 'NAM', subcategories: []};
        const wrapper = shallow(<CategoryMenuItem {...props}/>);

        wrapper.find('NavLink').simulate('click', { preventDefault: sinon.spy(), stopPropagation: sinon.spy() });

        wrapper.setProps({active: true});
        expect(wrapper.state().expanded).toBe(false);
    });
});