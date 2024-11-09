import React from 'react';
import { shallow } from 'enzyme';
import ConfigItemValue from './ConfigItemValue';
import sinon from 'sinon';

describe('ConfigItemValue test', () => {
    it('should convert checklist to new line separated values', () => {
        const props = { type: 'checkList', options: [{ selected: true, value: 'USD' }, { selected: true, value: 'EUR' }] };
        const wrapper = shallow(<ConfigItemValue {...props} />);

        expect(wrapper.find('ConfigItemValue__TextBox').props().value).toBe('USD\r\nEUR');
    });

    it('should convert dropdown to new line separated values', () => {
        const props = { type: 'dropDown', options: ['USD', 'EUR'] };
        const wrapper = shallow(<ConfigItemValue {...props} />);

        expect(wrapper.find('ConfigItemValue__TextBox').props().value).toBe('USD\r\nEUR');
    });

    it('should convert text value', () => {
        const props = { type: 'text', value: 'some random text', options: [{ selected: true, value: 'USD' }, { selected: true, value: 'EUR' }] };
        const wrapper = shallow(<ConfigItemValue {...props} />);

        expect(wrapper.find('ConfigItemValue__TextBox').props().value).toBe('some random text');
    });

    it('should be able to change text value', () => {
        const onChangeSpy = sinon.spy();
        const props = { type: 'text', value: 'some random text', onChange: onChangeSpy };
        const wrapper = shallow(<ConfigItemValue {...props} />);

        wrapper.find('ConfigItemValue__TextBox').simulate('change', { target: { value: 'text changed' } });

        expect(onChangeSpy.calledWith('text changed')).toBe(true);
    });

    it('should be able to change checklist values', () => {
        const onChangeSpy = sinon.spy();
        const props = { type: 'checkList', options: [{ selected: true, value: 'USD' }, { selected: true, value: 'EUR' }], onChange: onChangeSpy };
        const wrapper = shallow(<ConfigItemValue {...props} />);

        wrapper.find('ConfigItemValue__TextBox').simulate('change', { target: { value: 'CAD\r\nUSD ' } });

        expect(onChangeSpy.calledWith('CAD,USD')).toBe(true);
    });

    it('should be able to change dropdown values', () => {
        const onChangeSpy = sinon.spy();
        const props = { type: 'dropDown', options: ['USD', 'EUR'], onChange: onChangeSpy };
        const wrapper = shallow(<ConfigItemValue {...props} />);

        wrapper.find('ConfigItemValue__TextBox').simulate('change', { target: { value: 'CAD\r\nUSD ' } });

        expect(onChangeSpy.calledWith('CAD,USD')).toBe(true);
    });
});