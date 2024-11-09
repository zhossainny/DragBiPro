import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import YOptionSection from './YOptionSection';

describe('YOptionSection tests', () => {
    test('should render', () => {
        const props = { selectedOption: {}, id: 0 };
        const wrapper = shallow(<YOptionSection {...props} />);

        expect(wrapper.find('#yAxis_1')).toBeTruthy();
        expect(wrapper.find('BrowserSelect[name="y"]').prop('value')).toBe('');
    });

    test('should render Y axis selected option', () => {
        const props = { selectedOption: { y: 'Notional', type: 'pie' }, columnOptions: ['Price', 'Notional'], id: 0 };
        const wrapper = shallow(<YOptionSection id={1} {...props} />);

        expect(wrapper.find('BrowserSelect[value="Notional"]')).toBeTruthy();
        expect(wrapper.find('BrowserSelect[value="pie"]')).toBeTruthy();
    });

    test('should trigger addAxis handler', () => {
        const props = { selectedOption: {}, addAxis: sinon.spy(), id: 0 };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('YOptionSection__HelperButton').simulate('click');
        expect(props.addAxis.called).toBe(true);
    });

    test('should trigger deleteAxis handler', () => {
        const deleteAxisSpy = sinon.spy();
        const props = { selectedOption: {}, id: 1, deleteAxis: deleteAxisSpy };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('YOptionSection__HelperButton').simulate('click');
        expect(deleteAxisSpy.calledWith(1)).toBe(true);
    });

    test('should trigger handler when Y column changes', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'pie' }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('BrowserSelect[name="y"]').simulate('change', { target: { value: 'Price', name: 'y' } });
        expect(optionChanged.calledWith('y', 'Price', 0)).toBe(true);
    });

    test('should trigger handler when Type changes', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'pie' }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('BrowserSelect[name="type"]').simulate('change', { target: { value: 'bar', name: 'type' } });
        expect(optionChanged.calledWith('type', 'bar', 0)).toBe(true);
    });

    test('should trigger handler when Caption changes', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'pie', caption: null }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('PropValue').simulate('change', { target: { value: 'some user caption', name: 'caption' } });
        expect(optionChanged.calledWith('caption', 'some user caption', 0)).toBe(true);
    });

    test('should trigger handler when Position changes', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'pie', caption: null }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('ToggleSelect').simulate('change', { target: { value: 'Right', name: 'position' } });
        expect(optionChanged.calledWith('position', 'Right', 0)).toBe(true);
    });

    test('should use default color when none specified', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'line', caption: null }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        expect(wrapper.find('ColorPicker').props().color).toBe('#7cb5ec');
    });


    test('should use option color', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'line', caption: null, color: { r: 22, g: 23, b: 24, a: 0.55 } }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        expect(wrapper.find('ColorPicker').props().color).toEqual({ r: 22, g: 23, b: 24, a: 0.55 });
    });

    test('should be able to change Color', () => {
        const optionChanged = sinon.spy();
        const props = { selectedOption: { y: 'Notional', type: 'line', caption: null, color: { r: 22, g: 23, b: 24, a: 0.55 } }, id: 0, optionChanged: optionChanged, columnOptions: ['Price', 'Notional'] };
        const wrapper = shallow(<YOptionSection {...props} />);

        wrapper.find('ColorPicker').props().onColorChanged('color', { r: 52, g: 53, b: 54, a: 0.55 });

        expect(wrapper.update().state().color).toEqual({ r: 52, g: 53, b: 54, a: 0.55 });
    });
});