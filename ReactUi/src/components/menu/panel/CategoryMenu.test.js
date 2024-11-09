import React from 'react';
import { shallow } from 'enzyme';
import CategoryMenu from './CategoryMenu';
import CategoryMenuItem from './CategoryMenuItem';

describe('CategoryMenu tests', () => {
    test('should render CategoryMenuItems', () => {
        const props = { categories: [{ label: 'Nam', value: 'nam' }, { label: 'EMEA', value: 'emea' }], selectedCategory: 'emea' };
        const wrapper = shallow(<CategoryMenu {...props}/>);

        expect(wrapper.find(CategoryMenuItem).length).toBe(2);
        expect(wrapper.find(CategoryMenuItem).at(0).props().active).toBe(false);
        expect(wrapper.find(CategoryMenuItem).at(1).props().active).toBe(true);
    });

    test('should bind correctly CategoryMenuItems', () => {
        const props = { categories: [{ label: 'Nam', value: 'nam' }, { label: 'EMEA', value: 'emea' }], selectedCategory: 'emea' };
        const wrapper = shallow(<CategoryMenu {...props}/>);

        expect(wrapper.find(CategoryMenuItem).at(0).props().name).toBe('Nam');
        expect(wrapper.find(CategoryMenuItem).at(0).props().value).toBe('nam');
        expect(wrapper.find(CategoryMenuItem).at(0).props().active).toBe(false);

        expect(wrapper.find(CategoryMenuItem).at(1).props().name).toBe('EMEA');
        expect(wrapper.find(CategoryMenuItem).at(1).props().value).toBe('emea');
        expect(wrapper.find(CategoryMenuItem).at(1).props().active).toBe(true);
    });
});