import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import NewConfigurationItemForm from './NewConfigurationItemForm';
import ConfigItemValue from './ConfigItemValue';

describe('NewConfigurationItemForm tests', () => {
    test('should reset options when switching from checklist to dropdown', () => {
        const wrapper = shallow(<NewConfigurationItemForm />);

        wrapper.setProps({ item: { name: 'config item 1', id: 'ccff', version: 5, type: 'checkList', options: [{ selected: true, value: 'USD' }, { selected: true, value: 'EUR' }] } });

        wrapper.find('NewConfigurationItemForm__ComboBox').simulate('change', { target: { name: 'type', value: 'dropDown' } });

        expect(wrapper.update().state().options).toEqual(['USD', 'EUR']);
    });

    test('should reset options when switching from dropdown to checklist', () => {
        const wrapper = shallow(<NewConfigurationItemForm />);

        wrapper.setProps({ item: { name: 'config item 1', id: 'ccff', version: 5, type: 'dropDown', options: ['USD', 'EUR'] } });

        wrapper.find('NewConfigurationItemForm__ComboBox').simulate('change', { target: { name: 'type', value: 'checkList' } });

        expect(wrapper.update().state().options).toEqual([{ selected: true, value: 'USD' }, { selected: true, value: 'EUR' }]);
    });

    test('changing text value changes the state', () => {
        const wrapper = shallow(<NewConfigurationItemForm />);

        wrapper.setProps({ item: { name: 'config item 1', id: 'ccff', version: 5, type: 'text' } });
        wrapper.find(ConfigItemValue).simulate('change', 'some random text');

        expect(wrapper.state().value).toBe('some random text');
    });

    test('changing checkList value changes the state', () => {
        const wrapper = shallow(<NewConfigurationItemForm />);

        wrapper.setProps({ item: { name: 'config item 1', id: 'ccff', version: 5, type: 'checkList', options: [{ selected: true, value: 'USD' }, { selected: true, value: 'EUR' }] } });
        wrapper.find(ConfigItemValue).simulate('change', 'USD,CAD,EUR');

        expect(wrapper.state().value).toBe('USD,CAD,EUR');
        expect(wrapper.state().options).toEqual([{ selected: true, value: 'USD' }, { selected: true, value: 'CAD' }, { selected: true, value: 'EUR' }]);
    });

    test('changing dropDown value changes the state', () => {
        const wrapper = shallow(<NewConfigurationItemForm />);

        wrapper.setProps({ item: { name: 'config item 1', id: 'ccff', version: 5, type: 'dropDown', options: [['USD', 'EUR']] } });
        wrapper.find(ConfigItemValue).simulate('change', 'USD,CAD,EUR');

        expect(wrapper.state().value).toBe('USD');
        expect(wrapper.state().options).toEqual(['USD', 'CAD', 'EUR']);
    });

});