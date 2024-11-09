import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import BooleanToggle from './BooleanToggle';

describe('BooleanToggle tests', () => {
    test('should render when checked is false by default', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', checked: false, onChange: onChangeSpy };
        const wrapper = shallow(<BooleanToggle {...props} />);

        expect(wrapper.find('input').props().checked).toBe(false);
    });

    test('should render when checked is undefined by default', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', onChange: onChangeSpy };
        const wrapper = shallow(<BooleanToggle {...props} />);

        expect(wrapper.find('input').props().checked).toBe(false);
    });

    test('should render when checked is true by default', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', checked: true, onChange: onChangeSpy };
        const wrapper = shallow(<BooleanToggle {...props} />);

        expect(wrapper.find('input').props().checked).toBe(true);
    });

    test('should be able to flick toggle', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', checked: false, onChange: onChangeSpy };
        const wrapper = mount(<BooleanToggle {...props} />);

        wrapper.find('input').simulate('change', { target: { checked: true } });

        expect(onChangeSpy.calledWith({ target: {name: 'toggle', value: true}})).toBe(true);
        expect(wrapper.find('input').props().checked).toBe(true);
    });
});