import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ToggleSelect from './ToggleSelect';

describe('ToggleSelect tests', () => {
    test('should render when no selected option and no default', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', option1: 'left', option2: 'right', selectedOption: null, onChange: onChangeSpy };
        const wrapper = shallow(<ToggleSelect {...props} />);

        expect(wrapper.find('ToggleSelect__Toggle[value="left"]').length).toBe(1);
        expect(wrapper.find('ToggleSelect__Toggle[value="right"]').length).toBe(1);
        expect(wrapper.find('ToggleSelect__Toggle[className="selected"]').length).toBeFalsy();
    });

    test('should render when no selected option and existing default', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', option1: 'left', option2: 'right', selectedOption: null, defaultOption: 'left', onChange: onChangeSpy };
        const wrapper = shallow(<ToggleSelect {...props} />);

        expect(wrapper.find('ToggleSelect__Toggle[value="left"]').length).toBe(1);
        expect(wrapper.find('ToggleSelect__Toggle[value="right"]').length).toBe(1);
        expect(wrapper.find('ToggleSelect__Toggle[className="selected"][value="left"]').length).toBe(1);
    });

    test('should render correctly selected option', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', option1: 'left', option2: 'right', selectedOption: 'left', onChange: onChangeSpy };
        const wrapper = shallow(<ToggleSelect {...props} />);

        expect(wrapper.find('ToggleSelect__Toggle[value="left"]').length).toBe(1);
        expect(wrapper.find('ToggleSelect__Toggle[value="right"]').length).toBe(1);
        expect(wrapper.find('ToggleSelect__Toggle[className="selected"][value="left"]').length).toBe(1);
    });

    test('should change state when option clicked', () => {
        const onChangeSpy = sinon.spy();
        const props = { name: 'toggle', option1: 'left', option2: 'right', selectedOption: 'left', onChange: onChangeSpy };
        const wrapper = shallow(<ToggleSelect {...props} />);

        wrapper.find('ToggleSelect__Toggle[value="right"]').simulate('click', { target: { getAttribute: name => 'right'}});
        expect(onChangeSpy.calledWith({ target: { name: 'toggle', value: 'right'}}));
    });

});