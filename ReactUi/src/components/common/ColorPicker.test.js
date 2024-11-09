import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import ColorPicker from './ColorPicker';

describe('ColorPicker tests', () => {
    test('should use default color when color not supplied', () => {
        const props = { name: 'colorPicker', onColorChanged: sinon.spy() };
        const wrapper = shallow(<ColorPicker {...props} />);

        wrapper.find('ColorPicker__ColorDisplay').simulate('click');

        expect(wrapper.update().find('ColorPicker').props().color).toEqual({ r: '0', g: '0', b: '0', a: '1' });
        expect(wrapper.update().find('ColorPicker__ColorBox').props().color).toEqual({ r: '0', g: '0', b: '0', a: '1' });
    });

    test('should use passed in color', () => {
        const props = { name: 'colorPicker', onColorChanged: sinon.spy(), color: { r: 23, g: 44, b: 23, a: 0.65 } };
        const wrapper = shallow(<ColorPicker {...props} />);

        wrapper.find('ColorPicker__ColorDisplay').simulate('click');

        expect(wrapper.update().find('ColorPicker').props().color).toEqual({ r: 23, g: 44, b: 23, a: 0.65 });
        expect(wrapper.update().find('ColorPicker__ColorBox').props().color).toEqual({ r: 23, g: 44, b: 23, a: 0.65 });
    });


    test('should be able to change color', () => {
        const props = { name: 'colorPicker', onColorChanged: sinon.spy(), color: { r: 23, g: 44, b: 23, a: 0.65 } };
        const wrapper = shallow(<ColorPicker {...props} />);

        wrapper.find('ColorPicker__ColorDisplay').simulate('click');
        wrapper.update().find('ColorPicker').simulate('change', { rgb: { r: 55, g: 55, b: 55, a: 0.65 }});

        expect(wrapper.update().find('ColorPicker__ColorBox').props().color).toEqual({ r: 55, g: 55, b: 55, a: 0.65 });
    });

    test('should be able to change color and fire change event', () => {
        const colorChangedSpy = sinon.spy();
        const props = { name: 'colorPicker', onColorChanged: colorChangedSpy, color: { r: 23, g: 44, b: 23, a: 0.65 } };
        const wrapper = shallow(<ColorPicker {...props} />);

        wrapper.find('ColorPicker__ColorDisplay').simulate('click');
        wrapper.update().find('ColorPicker').simulate('change', { rgb: { r: 55, g: 55, b: 55, a: 0.65 }});
        wrapper.update().find('ColorPicker__Overlay').simulate('click');

        expect(wrapper.update().state().displayColorPicker).toBe(false);
        expect(colorChangedSpy.calledWith('colorPicker', { r: 55, g: 55, b: 55, a: 0.65 })).toBe(true);
    });

    test('should be able to handle string hash colors', () => {
        const props = { name: 'colorPicker', onColorChanged: sinon.spy(), color: '#7cb5ec' };
        const wrapper = shallow(<ColorPicker {...props} />);

        wrapper.find('ColorPicker__ColorDisplay').simulate('click');

        expect(wrapper.update().find('ColorPicker').props().color).toEqual('#7cb5ec');

        expect(wrapper.update().find('ColorPicker__ColorBox').props().color).toEqual('#7cb5ec');
    });
});